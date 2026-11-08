# Background removal for device photos

Runs by itself, in the backend: nobody has to do it by hand.

**Flow**
1. A partner uploads a photo → its row in `listing_photos` starts as `pending`.
2. The workflow `.github/workflows/process-photos.yml` wakes every 10 minutes, checks the queue, and if something is waiting runs `process.py run`.
3. For each photo the worker cuts the device out (BiRefNet), cleans the mask (drops specks, table scratches and neighbours; keeps camera glass and grilles), snaps the edge to the real edges of the photo, and places the device on one standard background with a soft shadow.
4. The result is stored next to the original: `<listing>/processed/<slot>.jpg` (+ `thumb-<slot>.jpg`), and the row becomes `done`.
   Screenshots (battery, storage) and damage close-ups are `skipped` — they stay exactly as taken. A photo the model cannot read (`failed`) simply keeps showing the original.
5. Buyers see the standard-background photo; the partner and the reviewers can flip to the original, so flaws on the device are never hidden from them.

**Setup (once)**: add the repository secret `SUPABASE_SERVICE_ROLE_KEY` (GitHub › Settings › Secrets and variables › Actions). It is the Supabase `service_role` key — keep it out of the site's code.

**Try it on local photos**
```bash
pip install -r tools/photo-background/requirements.txt
python tools/photo-background/process.py selftest ./photos ./out    # writes before/after sheets
python -m unittest tools/photo-background/test_matting.py            # mask-cleaning tests (no model needed)
```

**Tuning** (`matting.py`): `BACKGROUND` colour, `SKIP_SLOTS`, `MULTI_OBJECT_SLOTS`, coverage limits. `BG_MODEL=birefnet-general-lite` is faster and uses less memory but is a little less exact. The full model needs about 7 GB of RAM; GitHub's runners for public repositories have 16 GB.
