#!/usr/bin/env python3
"""Product-only plates of the shorts, for the promo film.

Same cleaning as the Instagram set — chevrons and scrollbar out — but cropped
to the product itself rather than the page, so the film can set its own type
instead of carrying the store's.

    python3 scripts/shorts_plates.py

Output: public/images/store/shorts-<n>.jpg
"""

from pathlib import Path

import numpy as np
from PIL import Image

from instagram_store_shots import clear_card, white_mask

BASE = "/root/.claude/uploads/fa6a7e27-2c32-5e4e-84fa-9d142fd7cfcb/"
SHOTS = ["642cd315", "03c3bf58", "2593347b", "2d87b9b8", "4498333d"]
OUT = Path(__file__).resolve().parent.parent / "public" / "images" / "store"


def crop_to_product(a, pad=0.05):
    """The product's own rows and columns, with a little air around them."""
    h, w, _ = a.shape
    ink = ~white_mask(a)
    solid = ink[:, int(w * 0.20):int(w * 0.80)].mean(1) > 0.25
    e = np.diff(np.concatenate(([0], solid.view(np.int8), [0])))
    st, en = np.nonzero(e == 1)[0], np.nonzero(e == -1)[0]
    if not len(st):
        return a
    i = int(np.argmax(en - st))
    top, bot = int(st[i]), int(en[i])
    cols = np.nonzero(ink[top:bot].any(0))[0]
    left, right = int(cols[0]), int(cols[-1]) + 1
    m = int(min(h, w) * pad)
    return a[max(top - m, 0):min(bot + m, h), max(left - m, 0):min(right + m, w)]


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    for i, stem in enumerate(SHOTS, 1):
        a = np.array(Image.open(BASE + stem + "-image.jpg").convert("RGB")).astype(int)
        im = Image.fromarray(crop_to_product(clear_card(a)).astype(np.uint8))
        path = OUT / f"shorts-{i}.jpg"
        im.save(path, quality=95, subsampling=0)
        print(f"shorts-{i}.jpg  {im.size}")
