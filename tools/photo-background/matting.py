"""
Background removal tuned for second-hand device photos.

Pipeline (all steps are deterministic and unit-tested where they are pure):
  1. A high-accuracy segmentation model (BiRefNet) finds the device; a guided filter then snaps the soft edge
     band to the real edges of the photo, which keeps thin rims and rounded corners clean (and uses little memory).
  2. The mask is cleaned: only the main object (plus anything touching it) is kept, so the specks,
     scratches on the table and neighbouring clutter around the phone disappear. Small holes inside the
     device (camera glass, speaker grilles) are filled so they are not cut out by mistake.
  3. The edge is decontaminated (colour of the old table bled into the rim is replaced) and the device is
     placed on one standard background with a soft contact shadow.
The device itself is never retouched: scratches ON the phone stay exactly as photographed.
"""
from __future__ import annotations

import io
import os
from dataclasses import dataclass

import numpy as np
from PIL import Image, ImageFilter, ImageOps
from scipy import ndimage as ndi

MODEL_NAME = os.environ.get("BG_MODEL", "birefnet-general")  # "birefnet-general-lite" is ~4x faster, a little less exact
BACKGROUND = (239, 236, 230)  # warm light grey, same family as the site
SHADOW_COLOR = (70, 64, 58)
MAX_SIDE = 1280
THUMB_SIDE = 360
JPEG_QUALITY = 80

# Photos that must stay exactly as taken (they are evidence, not product shots).
SKIP_SLOTS = {"battery", "storage", "defects"}
# Slots that show several separate objects (box + accessories, a watch band in two parts).
MULTI_OBJECT_SLOTS = {"box", "accessories", "band"}

MIN_COVERAGE = 0.03  # the device must fill at least 3% of the frame ...
MAX_COVERAGE = 0.93  # ... and the model must not have kept almost everything


@dataclass
class Outcome:
    ok: bool
    image: Image.Image | None  # composited result (RGB), full size
    note: str
    coverage: float = 0.0


def load_image(data: bytes) -> Image.Image:
    img = Image.open(io.BytesIO(data))
    img = ImageOps.exif_transpose(img)
    img = img.convert("RGB")
    if max(img.size) > MAX_SIDE:
        img.thumbnail((MAX_SIDE, MAX_SIDE), Image.LANCZOS)
    return img


_session = None


def get_session():
    global _session
    if _session is None:
        import onnxruntime as ort
        from rembg import new_session

        # BiRefNet is memory-hungry; without the arena/pattern caches its peak drops by several GB (needed for 7 GB CI runners).
        opts = ort.SessionOptions()
        opts.enable_cpu_mem_arena = False
        opts.enable_mem_pattern = False
        opts.intra_op_num_threads = int(os.environ.get("BG_THREADS", "4"))
        _session = new_session(MODEL_NAME, sess_opts=opts)
    return _session


def guided_filter(guide: np.ndarray, src: np.ndarray, radius: int, eps: float) -> np.ndarray:
    """Edge-preserving smoothing of `src` that follows the edges of `guide` (He et al.), O(N) memory."""
    size = 2 * radius + 1
    mean = lambda x: ndi.uniform_filter(x, size=size, mode="reflect")  # noqa: E731
    mean_g, mean_s = mean(guide), mean(src)
    var_g = mean(guide * guide) - mean_g * mean_g
    cov = mean(guide * src) - mean_g * mean_s
    a = cov / (var_g + eps)
    b = mean_s - a * mean_g
    return mean(a) * guide + mean(b)


def refine_edges(img: Image.Image, alpha: np.ndarray) -> np.ndarray:
    """
    The model's mask is soft but a little blurry after being scaled back to the photo's size.
    Inside the thin band around the edge, snap it to the real edges of the photo with a guided filter;
    the solid core and the empty outside are left untouched.
    """
    h, w = alpha.shape
    band_px = max(3, int(0.006 * max(h, w)))
    band = ndi.binary_dilation(alpha > 0.04, iterations=band_px) & ~ndi.binary_erosion(alpha > 0.96, iterations=band_px)
    gray = np.asarray(img.convert("L"), dtype=np.float32) / 255.0
    refined = np.clip(guided_filter(gray, alpha, radius=max(3, band_px), eps=1e-4), 0.0, 1.0)
    out = alpha.copy()
    out[band] = refined[band]
    return out


def segment(img: Image.Image) -> np.ndarray:
    """Soft alpha in [0, 1], same size as the image."""
    from rembg import remove

    mask = remove(img, session=get_session(), only_mask=True, post_process_mask=False, alpha_matting=False)
    alpha = np.asarray(mask.convert("L"), dtype=np.float32) / 255.0
    return refine_edges(img, alpha)


def clean_mask(alpha: np.ndarray, multi_object: bool = False, allow_hole_fill: bool = True) -> np.ndarray:
    """
    Boolean mask of what to keep: the main object, anything touching it, and (for multi-object slots)
    other big objects. Everything else — specks, table scratches, far clutter — is dropped.
    """
    hard = alpha > 0.5
    if not hard.any():
        return hard
    labels, count = ndi.label(hard)
    areas = ndi.sum(hard, labels, index=np.arange(1, count + 1))
    main = int(np.argmax(areas)) + 1
    keep = labels == main

    # pieces of the same device that the model cut apart by a thin gap (camera bump, button strips)
    near = ndi.binary_dilation(keep, iterations=max(3, int(0.004 * max(alpha.shape))))
    for idx in range(1, count + 1):
        if idx == main:
            continue
        piece = labels == idx
        big = areas[idx - 1] >= (0.10 if multi_object else 0.02) * areas[main - 1]
        if (big and multi_object) or (piece & near).any() and areas[idx - 1] >= 0.002 * areas[main - 1]:
            keep |= piece

    if allow_hole_fill:
        filled = ndi.binary_fill_holes(keep)
        holes = filled & ~keep
        if holes.any():
            hole_labels, hole_count = ndi.label(holes)
            hole_areas = ndi.sum(holes, hole_labels, index=np.arange(1, hole_count + 1))
            limit = 0.02 * keep.sum()  # only small holes: a closed watch strap keeps its big opening
            for idx, area in enumerate(hole_areas, start=1):
                if area <= limit:
                    keep |= hole_labels == idx
    return keep


def final_alpha(alpha: np.ndarray, keep: np.ndarray) -> np.ndarray:
    """Soft matting alpha inside a 'near the kept object' zone, fully opaque in its core, zero elsewhere."""
    reach = max(2, int(0.003 * max(alpha.shape)))
    zone = ndi.binary_dilation(keep, iterations=reach)
    core = ndi.binary_erosion(keep, iterations=reach)
    out = np.where(zone, alpha, 0.0).astype(np.float32)
    out[core] = 1.0
    return np.clip(out, 0.0, 1.0)


def decontaminate(rgb: np.ndarray, alpha: np.ndarray) -> np.ndarray:
    """Replace the colour of semi-transparent edge pixels with the nearest solid interior colour (no old-table halo)."""
    solid = alpha > 0.97
    if not solid.any():
        return rgb
    edge = (alpha > 0.0) & ~solid
    if not edge.any():
        return rgb
    _, (iy, ix) = ndi.distance_transform_edt(~solid, return_indices=True)
    out = rgb.copy()
    out[edge] = rgb[iy[edge], ix[edge]]
    return out


def compose(img: Image.Image, alpha: np.ndarray, shadow: bool = True) -> Image.Image:
    h, w = alpha.shape
    rgb = decontaminate(np.asarray(img, dtype=np.uint8), alpha)
    canvas = np.zeros((h, w, 3), dtype=np.float32)
    canvas[:] = BACKGROUND
    if shadow:
        blur = max(4, int(0.012 * max(h, w)))
        offset = max(2, int(0.008 * h))
        shifted = np.zeros_like(alpha)
        shifted[offset:, :] = alpha[: h - offset, :]
        soft = np.asarray(Image.fromarray((shifted * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(blur)), dtype=np.float32) / 255.0
        canvas = canvas * (1 - 0.30 * soft[..., None]) + np.array(SHADOW_COLOR, dtype=np.float32) * (0.30 * soft[..., None])
    a = alpha[..., None]
    out = rgb.astype(np.float32) * a + canvas * (1 - a)
    return Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))


def process(img: Image.Image, slot: str, category: str = "phone") -> Outcome:
    if slot in SKIP_SLOTS:
        return Outcome(True, None, "skipped: evidence photo kept as taken")
    multi = slot in MULTI_OBJECT_SLOTS
    alpha = segment(img)
    keep = clean_mask(alpha, multi_object=multi, allow_hole_fill=category != "watch" or slot != "band")
    coverage = float(keep.mean())
    if coverage < MIN_COVERAGE:
        return Outcome(False, None, f"device not found (covers {coverage:.1%} of the frame)", coverage)
    if coverage > MAX_COVERAGE:
        return Outcome(False, None, f"could not tell the device from the background ({coverage:.1%} kept)", coverage)
    return Outcome(True, compose(img, final_alpha(alpha, keep)), "ok", coverage)


def encode_jpeg(img: Image.Image, max_side: int, quality: int = JPEG_QUALITY) -> bytes:
    out = img.copy()
    if max(out.size) > max_side:
        out.thumbnail((max_side, max_side), Image.LANCZOS)
    buf = io.BytesIO()
    out.save(buf, "JPEG", quality=quality, optimize=True, progressive=True)
    return buf.getvalue()
