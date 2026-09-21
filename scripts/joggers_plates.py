#!/usr/bin/env python3
"""Product-only plates of the joggers, pulled out of the store screenshots.

The screenshots carry the whole product page — thumbnail rail, title, price,
Add To Cart. Only the big picture on the left is wanted, cropped to the
garment, with the carousel chevrons taken off it.

    python3 scripts/joggers_plates.py

The garment is then keyed off its backdrop. On paper the plate's own studio
white reads as a card pasted onto the frame — a soft 250-255 gradient on the
flat shots, a flat grey on the worn one — and no snap-to-white fixes the grey
one. Keying leaves the garment alone on the ground instead.

Output: public/images/store/joggers-<n>.png
"""

from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

from cut_store_hats import arrow_mask, inpaint_vertical

BASE = Path("/tmp/claude-0/-home-user-Video-Editing/fa6a7e27-2c32-5e4e-84fa-9d142fd7cfcb/images")
SHOTS = ["3.webp", "5.webp", "4.webp", "7.webp"]
OUT = Path(__file__).resolve().parent.parent / "public" / "images" / "store"

# the picture panel, as a fraction of the page: past the thumbnail rail, and
# stopping before the right-hand column with the title and the price
PANEL = (0.08, 0.50)


def white_mask(a):
    return (a.min(2) >= 250) & ((a.max(2) - a.min(2)) <= 6)


def panel_of(a):
    """The picture panel only, below the breadcrumb line."""
    h, w, _ = a.shape
    return a[int(h * 0.07):, int(w * PANEL[0]):int(w * PANEL[1])]


def border_connected(mask):
    """Keep only the part of `mask` that reaches the frame edge."""
    h, w = mask.shape
    flat = np.where(mask, 255, 0).astype(np.uint8)
    m = Image.fromarray(np.dstack([flat] * 3), "RGB")
    for xy in ([(x, 0) for x in range(w)] + [(x, h - 1) for x in range(w)]
               + [(0, y) for y in range(h)] + [(w - 1, y) for y in range(h)]):
        if m.getpixel(xy) == (255, 255, 255):
            ImageDraw.floodfill(m, xy, (255, 0, 255))
    r = np.array(m)
    return (r[..., 0] == 255) & (r[..., 1] == 0) & (r[..., 2] == 255)


def key(a, dark_crop=False):
    """Lift the garment off the studio backdrop."""
    h, w, _ = a.shape
    page = (a.min(2) >= 232) & ((a.max(2) - a.min(2)) <= 14)
    # only backdrop that reaches the frame edge is backdrop; anything enclosed
    # by the garment — a highlight, a white shoe — stays
    back = border_connected(page)

    im = Image.fromarray(np.dstack([a.astype(np.uint8),
                                    np.where(back, 0, 255).astype(np.uint8)]), "RGBA")
    al = im.split()[3].filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.MinFilter(3))
    al = al.filter(ImageFilter.MinFilter(3))  # pull the rim in off the backdrop
    im.putalpha(al.filter(ImageFilter.GaussianBlur(0.9)))

    if dark_crop:
        # On the worn shot the model's white trainers sit on a near-white
        # backdrop with his ground shadow between them: nothing separates the
        # two by level, and every attempt took the shoes with the shadow. So
        # that beat is cropped at the cuff instead — waist to hem on a person,
        # which is an ordinary way to shoot trousers and reads as intended.
        dark = np.nonzero((a.mean(2) < 120).any(1))[0]
        if len(dark):
            im = im.crop((0, 0, im.width, min(int(dark[-1]) + 12, im.height)))
    return im.crop(im.split()[3].getbbox())


def crop_product(panel, pad=0.06):
    """The garment's own bounds inside the picture panel."""
    h = panel.shape[0]
    ink = ~white_mask(panel)
    pw = panel.shape[1]
    solid = ink[:, int(pw * 0.15):int(pw * 0.85)].mean(1) > 0.15
    e = np.diff(np.concatenate(([0], solid.view(np.int8), [0])))
    st, en = np.nonzero(e == 1)[0], np.nonzero(e == -1)[0]
    if not len(st):
        return panel
    i = int(np.argmax(en - st))
    top, bot = int(st[i]), int(en[i])
    cols = np.nonzero(ink[top:bot].any(0))[0]
    left, right = int(cols[0]), int(cols[-1]) + 1
    m = int(min(bot - top, right - left) * pad)
    return panel[max(top - m, 0):min(bot + m, h), max(left - m, 0):min(right + m, pw)]


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    for i, name in enumerate(SHOTS, 1):
        a = np.array(Image.open(BASE / name).convert("RGB")).astype(int)
        # the chevrons sit at the panel's edges, which are the middle of the
        # page — so the side-band detector only finds them once the panel is
        # the frame
        panel = panel_of(a)
        mask = arrow_mask(panel, band=(0.20, 0.90))
        mask = np.array(Image.fromarray((mask * 255).astype(np.uint8))
                        .filter(ImageFilter.MaxFilter(5))) > 127
        clean = inpaint_vertical(panel.astype(np.uint8), mask).astype(int)
        art = crop_product(clean)
        im = key(art, dark_crop=(name == "5.webp"))
        path = OUT / f"joggers-{i}.png"
        im.save(path)
        print(f"joggers-{i}.png  {im.size}  from {name}")
