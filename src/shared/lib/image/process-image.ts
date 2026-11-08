export interface Processed {
  blob: Blob
  /** Small copy (about 360 px) for lists and grids, so screens don't download the full photo. */
  thumb: Blob
  url: string
  width: number
  height: number
  warnings: string[]
}

const MAX_SIDE = 1280
const THUMB_SIDE = 360
const MIN_SIDE = 900
const SAMPLE_WIDTH = 200
const JPEG_QUALITY = 0.78
const THUMB_QUALITY = 0.7

interface Decoded {
  draw: CanvasImageSource
  width: number
  height: number
  release: () => void
}

async function decode(src: Blob): Promise<Decoded> {
  if (typeof createImageBitmap === 'function') {
    try {
      const bmp = await createImageBitmap(src, { imageOrientation: 'from-image' })
      return { draw: bmp, width: bmp.width, height: bmp.height, release: () => bmp.close() }
    } catch {
      /* fall back to <img> */
    }
  }
  const url = URL.createObjectURL(src)
  const img = new Image()
  img.src = url
  await img.decode()
  return { draw: img, width: img.naturalWidth, height: img.naturalHeight, release: () => URL.revokeObjectURL(url) }
}

function createCanvas(width: number, height: number, options?: CanvasRenderingContext2DSettings) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d', options)
  return { canvas, ctx }
}

/** Cheap checks on a small copy of the photo: too dark, too bright, blurry (Laplacian variance). */
function exposureAndSharpnessWarnings(source: HTMLCanvasElement): string[] {
  const w = SAMPLE_WIDTH
  const h = Math.max(1, Math.round((source.height / source.width) * w))
  const { ctx } = createCanvas(w, h, { willReadFrequently: true })
  if (!ctx) return []
  ctx.drawImage(source, 0, 0, w, h)
  const { data } = ctx.getImageData(0, 0, w, h)

  const gray = new Float32Array(w * h)
  let sum = 0
  for (let i = 0; i < gray.length; i++) {
    gray[i] = 0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2]
    sum += gray[i]
  }
  const mean = sum / gray.length

  let energy = 0
  let samples = 0
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = y * w + x
      const laplacian = 4 * gray[i] - gray[i - 1] - gray[i + 1] - gray[i - w] - gray[i + w]
      energy += laplacian * laplacian
      samples++
    }
  }
  const variance = energy / Math.max(1, samples)

  const warnings: string[] = []
  if (mean < 55) warnings.push('عکس تاریک است؛ نور بیشتری بدهید.')
  else if (mean > 225) warnings.push('عکس بیش‌ازحد روشن است؛ از نور مستقیم دوری کنید.')
  if (variance < 25) warnings.push('عکس تار به نظر می‌رسد؛ دوباره بگیرید.')
  return warnings
}

const toJpeg = (canvas: HTMLCanvasElement, quality: number) =>
  new Promise<Blob>((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('encode failed'))), 'image/jpeg', quality))

/** A smaller copy of a canvas whose longest side is `side` px. */
function shrink(source: HTMLCanvasElement, side: number): HTMLCanvasElement {
  const scale = Math.min(1, side / Math.max(source.width, source.height))
  const { canvas, ctx } = createCanvas(Math.max(1, Math.round(source.width * scale)), Math.max(1, Math.round(source.height * scale)))
  if (!ctx) throw new Error('canvas unavailable')
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height)
  return canvas
}

/**
 * Re-encodes the photo through a canvas (which drops EXIF/GPS/device-name metadata),
 * keeps the longest side at 1280 px (JPEG 78%) plus a 360 px thumbnail, and runs quality checks (resolution, brightness, blur) so bad shots are caught on the spot.
 */
export async function processImage(src: Blob): Promise<Processed> {
  const decoded = await decode(src)
  try {
    const scale = Math.min(1, MAX_SIDE / Math.max(decoded.width, decoded.height))
    const width = Math.round(decoded.width * scale)
    const height = Math.round(decoded.height * scale)
    const { canvas, ctx } = createCanvas(width, height)
    if (!ctx) throw new Error('canvas unavailable')
    ctx.drawImage(decoded.draw, 0, 0, width, height)

    const warnings: string[] = []
    if (Math.max(decoded.width, decoded.height) < MIN_SIDE) warnings.push('وضوح عکس کم است؛ نزدیک‌تر یا با کیفیت بالاتر بگیرید.')
    warnings.push(...exposureAndSharpnessWarnings(canvas))

    const blob = await toJpeg(canvas, JPEG_QUALITY)
    const thumb = await toJpeg(shrink(canvas, THUMB_SIDE), THUMB_QUALITY)
    return { blob, thumb, url: URL.createObjectURL(blob), width, height, warnings }
  } finally {
    decoded.release()
  }
}
