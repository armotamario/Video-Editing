#!/usr/bin/env python3
"""The store product shots kept on their own backdrop, arrows repaired.

The cut-out version floats the cap on black; this one keeps the shot as it is
photographed — cap on the studio off-white — and only takes out the page
furniture: the header bar, the slide counter, and the carousel chevrons drawn
over the brim.

    python3 scripts/plate_store_hats.py

Output: public/images/store/plate-<name>.jpg
"""

from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

from cut_store_hats import BASE, SHOTS, arrow_mask, inpaint_vertical

OUT = Path(__file__).resolve().parent.parent / "public" / "images" / "store"


def content_box(a):
    """Crop to the clean page just above the cap.

    Anchoring on the product and then walking up through the empty page takes
    out the header bar, its divider and the slide counter in one go, whatever
    height they happen to be in a given shot: the walk stops at the first row
    that is not pure backdrop.
    """
    h, w, _ = a.shape
    page = (a.min(2) > 224) & ((a.max(2) - a.min(2)) < 18)
    mid = page[:, int(w * 0.18):int(w * 0.82)]
    solid = (~mid).mean(1)
    # the cap is the longest unbroken run of solid rows — picking the *first*
    # solid row instead lands on the header bar and its divider
    rows = solid > 0.25
    edges = np.diff(np.concatenate(([0], rows.view(np.int8), [0])))
    starts, ends = np.nonzero(edges == 1)[0], np.nonzero(edges == -1)[0]
    if not len(starts):
        return 0
    body = [int(starts[int(np.argmax(ends - starts))])]
    clean = page.mean(1) > 0.995
    r = int(body[0])
    while r > 0 and clean[r - 1]:
        r -= 1
    return min(r + 4, int(body[0]) - 8)


def plate(name, stem):
    src = Image.open(BASE + stem + "-image.jpg").convert("RGB")
    a = np.array(src).astype(int)
    top = content_box(a)
    a = a[top:]

    mask = arrow_mask(a)
    mask = np.array(Image.fromarray((mask * 255).astype(np.uint8))
                    .filter(ImageFilter.MaxFilter(5))) > 127
    repaired = inpaint_vertical(a.astype(np.uint8), mask)

    # the store page divider survives as a hairline near one edge of some
    # shots. Paint it out from its clean neighbours rather than cropping: the
    # outer margin is not perfectly uniform, and trimming to it eats the brim.
    a2 = repaired.astype(int)
    page = (a2.min(2) > 224) & ((a2.max(2) - a2.min(2)) < 18)
    clean = page.mean(0) > 0.995
    w2 = a2.shape[1]
    margin = int(w2 * 0.10)
    edges = np.diff(np.concatenate(([0], (~clean).view(np.int8), [0])))
    for a0, b0 in zip(np.nonzero(edges == 1)[0], np.nonzero(edges == -1)[0]):
        if b0 - a0 > 14:
            continue  # that is the cap, not a rule
        if a0 >= margin and b0 <= w2 - margin:
            continue  # and this one is not near an edge
        src_col = a0 - 1 if a0 > 0 and clean[a0 - 1] else min(b0, w2 - 1)
        repaired[:, a0:b0] = repaired[:, src_col][:, None, :]

    im = Image.fromarray(repaired)
    OUT.mkdir(parents=True, exist_ok=True)
    path = OUT / f"plate-{name}.jpg"
    im.save(path, quality=94, subsampling=0)
    print(f"{name:9s} {im.size}  arrow px {int(mask.sum()):6d}  -> {path.name}")


if __name__ == "__main__":
    for n, s in SHOTS.items():
        plate(n, s)
