"""Cut the Godly Raiment product shots out of the store screenshots.

Keys the white page away, repairs the carousel arrows drawn over the cap, and
drops the header bar and the slide counter.
"""
from PIL import Image, ImageDraw, ImageFilter
import numpy as np

BASE = '/root/.claude/uploads/fa6a7e27-2c32-5e4e-84fa-9d142fd7cfcb/'
SHOTS = {'black': '2ce2dda5', 'charcoal': 'e6140471', 'stone': '4359afe6'}


def cap_bbox(a):
    """The cap only: below the header bar, ignoring the small slide counter."""
    h, w, _ = a.shape
    lum = a.mean(2)
    header = np.nonzero((lum < 90).mean(1) < 0.5)[0]
    top = (header[0] if len(header) else 0) + 30
    content = (a.min(2) < 232)
    content[:top] = False
    rows = content.sum(1)
    cols = content.sum(0)
    rk = np.nonzero(rows > 120)[0]
    ck = np.nonzero(cols > 120)[0]
    return ck.min(), ck.max(), rk.min(), rk.max()


def arrow_mask(a):
    """The chevrons: short, thin dark runs near the sides, at mid height."""
    lum = a.mean(2)
    h, w = lum.shape
    mask = np.zeros((h, w), bool)
    top, bot = int(h * 0.30), int(h * 0.72)
    for c0, c1 in ((0, int(w * 0.18)), (int(w * 0.82), w)):
        strip = lum[:, c0:c1]
        pad = np.pad(strip, ((0, 0), (34, 34)), mode='edge')
        level = np.median(
            np.stack([pad[:, i:i + strip.shape[1]] for i in range(0, 69, 4)]), axis=0)
        cand = strip < (level - 18)
        for r in range(top, bot):
            row = cand[r]
            if not row.any():
                continue
            edges = np.diff(np.concatenate(([0], row.view(np.int8), [0])))
            for a0, b0 in zip(np.nonzero(edges == 1)[0], np.nonzero(edges == -1)[0]):
                if b0 - a0 <= 46:
                    mask[r, c0 + a0:c0 + b0] = True
    return mask


def inpaint_vertical(a, mask):
    """Fill each masked pixel from the nearest clean pixel above and below."""
    out = a.copy().astype(float)
    h, w, _ = a.shape
    for c in np.nonzero(mask.any(0))[0]:
        rows = np.nonzero(mask[:, c])[0]
        clean = np.nonzero(~mask[:, c])[0]
        if not len(clean):
            continue
        for r in rows:
            above = clean[clean < r]
            below = clean[clean > r]
            if len(above) and len(below):
                ra, rb = above[-1], below[0]
                t = (r - ra) / max(rb - ra, 1)
                out[r, c] = a[ra, c] * (1 - t) + a[rb, c] * t
            elif len(above):
                out[r, c] = a[above[-1], c]
            elif len(below):
                out[r, c] = a[below[0], c]
    return out.round().astype(np.uint8)


def cut(name, stem):
    src_full = Image.open(BASE + stem + '-image.jpg').convert('RGB')
    a_full = np.array(src_full).astype(int)
    x0, x1, y0, y1 = cap_bbox(a_full)
    M = 14
    box = (max(0, x0 - M), max(0, y0 - M),
           min(a_full.shape[1], x1 + M), min(a_full.shape[0], y1 + M))
    src = src_full.crop(box)
    a = np.array(src).astype(int)
    h, w, _ = a.shape

    am = arrow_mask(a)
    am = np.array(Image.fromarray((am * 255).astype(np.uint8))
                  .filter(ImageFilter.MaxFilter(5))) > 127
    repaired = inpaint_vertical(a.astype(np.uint8), am)

    # a dark cap sits far from the white page, so the fill can be bolder and
    # swallow the soft reflection under the brim; the stone cap cannot.
    crown0 = repaired[int(h * 0.34):int(h * 0.46), int(w * 0.36):int(w * 0.64)]
    crown_lum0 = float(crown0.reshape(-1, 3).mean(1).mean())
    thresh = 62 if crown_lum0 < 130 else 28

    flood = Image.fromarray(repaired).copy()
    SENT = (255, 0, 255)
    seeds = ([(x, 0) for x in range(0, w, 6)] + [(x, h - 1) for x in range(0, w, 6)]
             + [(0, y) for y in range(0, h, 6)] + [(w - 1, y) for y in range(0, h, 6)])
    for xy in seeds:
        px = flood.getpixel(xy)
        if px != SENT and min(px) > 214:
            ImageDraw.floodfill(flood, xy, SENT, thresh=thresh)
    fa = np.array(flood)
    bg = (fa[..., 0] == 255) & (fa[..., 1] == 0) & (fa[..., 2] == 255)
    neutral = (repaired.min(2) > 226) & ((repaired.max(2) - repaired.min(2)) < 14)
    bg |= neutral

    alpha = np.where(bg, 0, 255).astype(np.uint8)
    # the slide counter sits above the cap in every shot
    alpha[:int(h * 0.16)] = 0

    # the mockup's ground reflection under the brim: neutral, and lighter than
    # this cap's own crown. Cleared low in the frame only, so the white
    # embroidery higher up survives on the dark colourways.
    crown = repaired[int(h * 0.34):int(h * 0.46), int(w * 0.36):int(w * 0.64)]
    crown_lum = float(crown.reshape(-1, 3).mean(1).mean())
    low = slice(int(h * 0.70), h)
    band = repaired[low].astype(int)
    lum = band.mean(2)
    sat = band.max(2) - band.min(2)
    glare = (lum > crown_lum + 28) & (sat < 15)
    a_low = alpha[low]
    a_low[glare] = 0
    alpha[low] = a_low
    print(f'    crown lum {crown_lum:5.1f}  glare px {int(glare.sum())}')

    # walk up each column from the bottom of the silhouette, clearing the
    # light neutral reflection until real fabric is reached
    rep = repaired.astype(int)
    lum_all = rep.mean(2)
    sat_all = rep.max(2) - rep.min(2)
    reflect = (lum_all > crown_lum + 20) & (sat_all < 26)
    for c in range(w):
        rows = np.nonzero(alpha[:, c] > 0)[0]
        if not len(rows):
            continue
        r = rows[-1]
        while r >= 0 and alpha[r, c] > 0 and reflect[r, c]:
            alpha[r, c] = 0
            r -= 1

    im = Image.fromarray(np.dstack([repaired, alpha]), 'RGBA')
    # close the single-pixel notches the erosion leaves along the brim
    al = im.split()[3].filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.MinFilter(3))
    im.putalpha(al.filter(ImageFilter.GaussianBlur(1.0)))
    im.save(f'cut-{name}.png')
    print(f'{name:9s} crop {src.size}  arrow px {int(am.sum()):6d}  transparent {100*bg.mean():4.1f}%')
    return im


for n, s in SHOTS.items():
    cut(n, s)
