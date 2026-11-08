#!/usr/bin/env python3
"""
Background-removal worker for mobilekarkarde.ir.

  python process.py run                   process every photo waiting in the queue (used by the scheduled workflow)
  python process.py selftest IN_DIR OUT_DIR   try the pipeline on local photos and write before/after sheets

The queue is the `listing_photos` table: a photo is `pending` when the partner uploads it. The worker claims
it (`processing`), writes the standard-background copy next to the original (`<listing>/processed/<slot>.jpg`
plus a thumbnail), and marks it `done`, `skipped` (screenshots, close-ups of damage) or `failed` (with a reason,
the original stays visible). Needs SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.
"""
from __future__ import annotations

import os
import sys
import time
from datetime import datetime, timedelta, timezone
from pathlib import Path

import requests
from PIL import Image

sys.path.insert(0, os.path.dirname(__file__))
import matting  # noqa: E402

BUCKET = "listing-photos"
BATCH = int(os.environ.get("BATCH", "60"))
STALE_AFTER = timedelta(minutes=30)
MAX_ATTEMPTS = 3


def env(name: str) -> str:
    value = os.environ.get(name, "").strip()
    if not value:
        sys.exit(f"{name} is not set")
    return value


class Supabase:
    def __init__(self) -> None:
        self.url = env("SUPABASE_URL").rstrip("/")
        key = env("SUPABASE_SERVICE_ROLE_KEY")
        self.http = requests.Session()
        self.http.headers.update({"apikey": key, "Authorization": f"Bearer {key}"})

    def select(self, params: dict[str, str]) -> list[dict]:
        r = self.http.get(f"{self.url}/rest/v1/listing_photos", params=params, timeout=60)
        r.raise_for_status()
        return r.json()

    def patch(self, match: dict[str, str], body: dict) -> list[dict]:
        r = self.http.patch(
            f"{self.url}/rest/v1/listing_photos",
            params=match,
            json=body,
            headers={"Prefer": "return=representation"},
            timeout=60,
        )
        r.raise_for_status()
        return r.json()

    def download(self, path: str) -> bytes:
        r = self.http.get(f"{self.url}/storage/v1/object/{BUCKET}/{path}", timeout=120)
        r.raise_for_status()
        return r.content

    def upload(self, path: str, data: bytes) -> None:
        r = self.http.post(
            f"{self.url}/storage/v1/object/{BUCKET}/{path}",
            data=data,
            headers={"Content-Type": "image/jpeg", "x-upsert": "true", "cache-control": "3600"},
            timeout=120,
        )
        r.raise_for_status()


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def run() -> int:
    db = Supabase()

    # a worker that died mid-photo must not block it forever
    stale = (datetime.now(timezone.utc) - STALE_AFTER).isoformat()
    db.patch({"process_status": "eq.processing", "process_claimed_at": f"lt.{stale}"}, {"process_status": "pending"})

    rows = db.select({
        "process_status": "eq.pending",
        "process_attempts": f"lt.{MAX_ATTEMPTS}",
        "select": "listing_id,slot,path,listings!inner(category,deleted_at)",
        "listings.deleted_at": "is.null",
        "order": "listing_id",
        "limit": str(BATCH),
    })
    print(f"{len(rows)} photo(s) waiting")
    done = failed = skipped = 0
    for row in rows:
        key = {"listing_id": f"eq.{row['listing_id']}", "slot": f"eq.{row['slot']}"}
        # claim it; if another run got there first the PATCH matches nothing and we move on
        claimed = db.patch(
            {**key, "process_status": "eq.pending"},
            {"process_status": "processing", "process_claimed_at": now_iso()},
        )
        if not claimed:
            continue
        slot, category = row["slot"], row["listings"]["category"]
        started = time.time()
        try:
            if slot in matting.SKIP_SLOTS:
                db.patch(key, {"process_status": "skipped", "process_note": "kept as taken", "processed_at": now_iso()})
                skipped += 1
                continue
            img = matting.load_image(db.download(row["path"]))
            result = matting.process(img, slot, category)
            if not result.ok or result.image is None:
                db.patch(key, {"process_status": "failed", "process_note": result.note[:300], "process_attempts": claimed[0].get("process_attempts", 0) + 1})
                print(f"  {row['listing_id']}/{slot}: FAILED - {result.note}")
                failed += 1
                continue
            base = f"{row['listing_id']}/processed"
            db.upload(f"{base}/{slot}.jpg", matting.encode_jpeg(result.image, matting.MAX_SIDE))
            db.upload(f"{base}/thumb-{slot}.jpg", matting.encode_jpeg(result.image, matting.THUMB_SIDE, 72))
            db.patch(key, {
                "process_status": "done", "processed_path": f"{base}/{slot}.jpg", "process_note": f"covers {result.coverage:.0%}",
                "processed_at": now_iso(),
            })
            print(f"  {row['listing_id']}/{slot}: done in {time.time() - started:.1f}s")
            done += 1
        except Exception as exc:  # network or storage hiccup: put it back in the queue (up to MAX_ATTEMPTS)
            attempts = claimed[0].get("process_attempts", 0) + 1
            db.patch(key, {
                "process_status": "pending" if attempts < MAX_ATTEMPTS else "failed",
                "process_attempts": attempts, "process_note": f"error: {exc}"[:300],
            })
            print(f"  {row['listing_id']}/{slot}: error {exc}")
            failed += 1
    print(f"done={done} skipped={skipped} failed={failed}")
    return 0


def selftest(in_dir: str, out_dir: str) -> int:
    src, dst = Path(in_dir), Path(out_dir)
    dst.mkdir(parents=True, exist_ok=True)
    for path in sorted(src.glob("*.jpg")) + sorted(src.glob("*.png")):
        t0 = time.time()
        img = matting.load_image(path.read_bytes())
        result = matting.process(img, "front-on")
        took = time.time() - t0
        if result.image is None:
            print(f"{path.name}: {result.note}")
            continue
        sheet = Image.new("RGB", (img.width * 2 + 10, img.height), (255, 255, 255))
        sheet.paste(img, (0, 0))
        sheet.paste(result.image, (img.width + 10, 0))
        sheet.save(dst / f"{path.stem}-compare.jpg", quality=88)
        result.image.save(dst / f"{path.stem}-result.jpg", quality=92)
        print(f"{path.name}: {result.note}, covers {result.coverage:.0%}, {took:.1f}s")
    return 0


if __name__ == "__main__":
    if len(sys.argv) >= 2 and sys.argv[1] == "run":
        sys.exit(run())
    if len(sys.argv) == 4 and sys.argv[1] == "selftest":
        sys.exit(selftest(sys.argv[2], sys.argv[3]))
    sys.exit(__doc__)
