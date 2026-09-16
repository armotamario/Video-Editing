#!/usr/bin/env python3
"""The tees cut out of their backdrop — transparent PNGs, no white card.

The white colourway is the awkward one: the garment sits around 240 and the
studio paper at 255, so the page test has to be tight, and the alpha then has
to be closed up and eroded a touch or the anti-aliased rim leaves a pale halo
when the tee is placed on a dark ground.

    python3 scripts/cut_store_tees.py

Output: public/images/store/cut-tee-<name>.png
"""

from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

BASE = "/root/.claude/uploads/fa6a7e27-2c32-5e4e-84fa-9d142fd7cfcb/"
SHOTS = {"black": "aabb2b34", "sand": "66f4ba67", "white": "9dde8808"}

# The white colourway's right edge is blown out to the paper's own 255 with no
# contour left to key on, so no threshold and no flood can find it — the cut
# comes out with lumps of paper still attached. Every colourway is the same
# garment shot on the same mockup, so it borrows a clean silhouette instead,
# scaled to its own height.
BORROWS = {"white": "black"}
OUT = Path(__file__).resolve().parent.parent / "public" / "images" / "store"


def page_mask(a):
    """The studio paper: near-pure white and neutral."""
    return (a.min(2) >= 248) & ((a.max(2) - a.min(2)) <= 8)


def blob(mask, seed):
    """The connected run of `mask` that `seed` sits in."""
    h, w = mask.shape
    flat = np.where(mask, 255, 0).astype(np.uint8)
    m = Image.fromarray(np.dstack([flat] * 3), "RGB")
    if m.getpixel(seed) != (255, 255, 255):
        return np.zeros_like(mask)
    ImageDraw.floodfill(m, seed, (0, 255, 0))
    r = np.array(m)
    return (r[..., 0] == 0) & (r[..., 1] == 255) & (r[..., 2] == 0)


def edges(a):
    """Where the image changes — the garment's contour.

    The white tee reaches 255 in the sleeve highlights, exactly the paper's
    value, so no level test can separate the two. Its outline survives as a
    very soft contour, so the paper is flooded in from the border and that
    contour stops the flood where a threshold cannot.

    The threshold comes from the shot itself: whatever the gradient does on a
    band of known-empty paper is noise, and anything above it is structure.
    That matters because these crops differ — one has a hard rule near the
    frame edge, another is spotless.
    """
    lum = a.mean(2)
    g = np.zeros_like(lum)
    g[1:-1, 1:-1] = (np.abs(lum[2:, 1:-1] - lum[:-2, 1:-1])
                     + np.abs(lum[1:-1, 2:] - lum[1:-1, :-2]))
    h, w = lum.shape
    band = np.concatenate([g[4:14].ravel(), g[-14:-4].ravel(),
                           g[:, 4:14].ravel(), g[:, -14:-4].ravel()])
    return g > max(float(np.percentile(band, 99.9)), 0.5)


def smooth_span(alpha, win=9):
    """Rebuild the silhouette as one clean span per row.

    A tee photographed flat is a single horizontal run on every row, so the
    left and right boundaries are all the shape really is. Median-smoothing
    those two and refilling between them takes out the notches the flood
    leaves along a blown-out edge without touching the shape itself.
    """
    h, w = alpha.shape
    left = np.full(h, -1)
    right = np.full(h, -1)
    for y in range(h):
        row = alpha[y] > 0
        if not row.any():
            continue
        # the longest run, not the outermost pixels: a stray blob left over
        # near the frame edge would otherwise drag the whole row out to meet it
        e = np.diff(np.concatenate(([0], row.view(np.int8), [0])))
        st, en = np.nonzero(e == 1)[0], np.nonzero(e == -1)[0]
        i = int(np.argmax(en - st))
        left[y], right[y] = int(st[i]), int(en[i]) - 1
    rows = np.nonzero(left >= 0)[0]
    out = np.zeros_like(alpha)
    for y in rows:
        lo = max(int(rows[0]), y - win)
        hi = min(int(rows[-1]), y + win) + 1
        seg = slice(lo, hi)
        l = int(np.median(left[seg][left[seg] >= 0]))
        r = int(np.median(right[seg][right[seg] >= 0]))
        out[y, l:r + 1] = 255
    return out


def borrow(name, a, template):
    """Use a clean colourway's silhouette, scaled to this shot's garment."""
    ta = np.array(template)[..., 3]
    rows = np.nonzero((np.array(template)[..., 3] > 0).any(1))[0]
    del rows

    alpha = np.zeros(a.shape[:2], np.uint8)
    # this shot's vertical extent and left edge are still readable; the right
    # is the part that is gone, so the template supplies the width
    ink = ~page_mask(a)
    # the longest run of solid rows is the garment; the title set beneath it is
    # a much shorter one, and taking "any ink" would swallow it
    solid = ink[:, int(a.shape[1] * 0.25):int(a.shape[1] * 0.75)].mean(1) > 0.25
    e = np.diff(np.concatenate(([0], solid.view(np.int8), [0])))
    st, en = np.nonzero(e == 1)[0], np.nonzero(e == -1)[0]
    if not len(st):
        return alpha
    i = int(np.argmax(en - st))
    top, bot = int(st[i]), int(en[i]) - 1
    scale = (bot - top + 1) / ta.shape[0]
    tw = max(int(round(ta.shape[1] * scale)), 1)
    th = bot - top + 1
    mask = Image.fromarray(ta).resize((tw, th), Image.LANCZOS)

    xs = np.nonzero(ink[(top + bot) // 2])[0]
    left = int(xs[0]) if len(xs) else 0
    left = min(max(left - int(tw * 0.008), 0), a.shape[1] - tw)
    alpha[top:bot + 1, left:left + tw] = np.array(mask)
    return alpha


def cut(name, stem, template=None):
    src = Image.open(BASE + stem + "-image.jpg").convert("RGB")
    a = np.array(src).astype(int)
    h, w, _ = a.shape

    # the paper can be walked through; the garment and its contour cannot
    passable = page_mask(a) & ~edges(a)
    # force the outer ring open and start there, so the flood can run right
    # round the frame before it works inward — seeding a pixel that happens to
    # sit on a contour would strand it and key the whole frame as garment
    passable[0, :] = passable[-1, :] = True
    passable[:, 0] = passable[:, -1] = True
    paper = blob(passable, (0, 0))

    garment = blob(~paper, (w // 2, int(h * 0.42)))
    alpha = np.where(garment, 255, 0).astype(np.uint8)

    if template is not None:
        alpha = borrow(name, a, template)

    im = Image.fromarray(np.dstack([a.astype(np.uint8), alpha]), "RGBA")
    al = im.split()[3]
    # close the pinholes, then round the boundary by blurring the mask and
    # re-thresholding: on the white tee the contour the flood follows is only
    # a level or two deep and it comes out as a staircase, which reads as a
    # bad cut the moment the tee is placed on anything but white
    al = al.filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.MinFilter(5))
    al = al.filter(ImageFilter.GaussianBlur(5))
    al = al.point(lambda v: 255 if v >= 128 else 0)
    al = Image.fromarray(smooth_span(np.array(al)))
    al = al.filter(ImageFilter.MinFilter(3))  # pull the rim in off the paper
    im.putalpha(al.filter(ImageFilter.GaussianBlur(1.0)))
    im = im.crop(im.split()[3].getbbox())

    OUT.mkdir(parents=True, exist_ok=True)
    path = OUT / f"cut-tee-{name}.png"
    im.save(path)
    print(f"cut-tee-{name:6s} {im.size}  opaque {100 * (np.array(im)[..., 3] > 0).mean():4.1f}%")
    return im


if __name__ == "__main__":
    done = {}
    for n, stem in SHOTS.items():
        src = BORROWS.get(n)
        done[n] = cut(n, stem, template=done.get(src) if src else None)
