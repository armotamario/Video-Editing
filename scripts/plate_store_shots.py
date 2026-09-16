#!/usr/bin/env python3
"""The store product shots kept on their own backdrop, page furniture removed.

The cut-out pipeline floats a product on black; this one keeps the shot as it
is photographed — product on the studio white — and only takes out what the
store page drew over it: the header fade, the slide counter, the carousel
chevrons, the scrollbar rule, and the product title underneath.

    python3 scripts/plate_store_shots.py

Output: public/images/store/plate-<name>.jpg   (caps)
        public/images/store/tee-<name>.jpg     (tees)
"""

from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

from cut_store_hats import BASE, SHOTS, arrow_mask, inpaint_vertical

OUT = Path(__file__).resolve().parent.parent / "public" / "images" / "store"

TEES = {"black": "eefb57a4", "white": "0d195c0a", "sand": "127340a3"}


def page_mask(a):
    """The studio backdrop only.

    It has to be tight: the white tee sits around 240 and would read as page
    under the threshold that works for the caps.
    """
    return (a.min(2) >= 250) & ((a.max(2) - a.min(2)) <= 6)


def product_rows(a):
    """The first and last row of the product itself.

    Anchoring on the longest unbroken run of solid rows rather than the first
    one steps over the header fade and the slide counter above the product,
    and the title set underneath it.
    """
    h, w, _ = a.shape
    solid = (~page_mask(a)[:, int(w * 0.18):int(w * 0.82)]).mean(1) > 0.25
    edges = np.diff(np.concatenate(([0], solid.view(np.int8), [0])))
    starts, ends = np.nonzero(edges == 1)[0], np.nonzero(edges == -1)[0]
    if not len(starts):
        return 0, h
    i = int(np.argmax(ends - starts))
    return int(starts[i]), int(ends[i])


def trim(a):
    """Crop to the clean page either side of the product."""
    h = a.shape[0]
    top, bot = product_rows(a)
    clean = page_mask(a).mean(1) > 0.995
    r = top
    while r > 0 and clean[r - 1]:
        r -= 1
    b = bot
    while b < h and clean[b]:
        b += 1
    return min(r + 4, max(top - 8, 0)), max(b - 4, min(bot + 8, h))


def derule(a):
    """Paint out the hairline rules the page leaves near an edge.

    Painting rather than cropping: the outer margin is not uniform, and
    trimming to it eats the shoulder of the garment.
    """
    out = a.copy()
    w = a.shape[1]
    clean = page_mask(a).mean(0) > 0.99
    margin = int(w * 0.10)
    edges = np.diff(np.concatenate(([0], (~clean).view(np.int8), [0])))
    for a0, b0 in zip(np.nonzero(edges == 1)[0], np.nonzero(edges == -1)[0]):
        if b0 - a0 > 26:
            continue  # that is the product, not a rule
        if a0 >= margin and b0 <= w - margin:
            continue  # and this one is not near an edge
        src = a0 - 1 if a0 > 0 and clean[a0 - 1] else min(b0, w - 1)
        out[:, a0:b0] = out[:, src][:, None, :]
    return out


def only_product(a):
    """Blank the page back to white outside the product.

    The chevrons, the slide counter and the scrollbar all sit clear of the
    garment on pure white paper, so clearing everything outside a per-row box
    around the product silhouette removes all three at once — and without the
    smear that inpainting a chevron over open page leaves behind.
    """
    h, w, _ = a.shape
    solid = ~page_mask(a)
    # the product is the blob in the middle of the frame, not the furniture
    flat = np.where(solid, 255, 0).astype(np.uint8)
    m = Image.fromarray(np.dstack([flat] * 3), "RGB")
    seed = (w // 2, h // 2)
    if m.getpixel(seed) == (255, 255, 255):
        ImageDraw.floodfill(m, seed, (0, 255, 0))
        r = np.array(m)
        solid = (r[..., 0] == 0) & (r[..., 1] == 255) & (r[..., 2] == 0)

    out = a.copy()
    margin = 45  # wide enough to keep the product's own drop shadow
    for y in range(h):
        cols = np.nonzero(solid[y])[0]
        if not len(cols):
            out[y] = 255
            continue
        out[y, :max(int(cols[0]) - margin, 0)] = 255
        out[y, min(int(cols[-1]) + margin + 1, w):] = 255
    return out


def plate(name, stem, prefix):
    a = np.array(Image.open(BASE + stem + "-image.jpg").convert("RGB")).astype(int)
    top, bot = trim(a)
    a = a[top:bot]

    mask = arrow_mask(a)
    mask = np.array(Image.fromarray((mask * 255).astype(np.uint8))
                    .filter(ImageFilter.MaxFilter(5))) > 127
    out = only_product(derule(inpaint_vertical(a.astype(np.uint8), mask)))

    im = Image.fromarray(out)
    OUT.mkdir(parents=True, exist_ok=True)
    path = OUT / f"{prefix}-{name}.jpg"
    im.save(path, quality=94, subsampling=0)
    print(f"{prefix}-{name:9s} {im.size}  arrow px {int(mask.sum()):6d}")


if __name__ == "__main__":
    for n, s in SHOTS.items():
        plate(n, s, "plate")
    for n, s in TEES.items():
        plate(n, s, "tee")
