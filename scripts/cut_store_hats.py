"""Cut the Godly Raiment product shots out of the store screenshots.

Keys the white page away, repairs the carousel arrows drawn over the cap,
drops the header bar and the slide counter, clears the mockup's ground
shadow, and lands all three colourways on one shared canvas so they sit at
the same size and position in a reel.
"""
from PIL import Image, ImageDraw, ImageFilter
import numpy as np

BASE = '/root/.claude/uploads/fa6a7e27-2c32-5e4e-84fa-9d142fd7cfcb/'
SHOTS = {'black': 'f70e5199', 'charcoal': '01c678ac', 'stone': 'e20e330f'}


def border_connected(bg):
    """Keep only background that reaches the frame edge.

    The page is white and neutral, but so is the embroidery on the crown, and
    a plain colour test punches holes through the lettering. Flooding in from
    the border keeps the page and leaves anything enclosed by the cap opaque.
    """
    h, w = bg.shape
    flat = np.where(bg, 255, 0).astype(np.uint8)
    m = Image.fromarray(np.dstack([flat] * 3), 'RGB')
    seeds = ([(x, 0) for x in range(w)] + [(x, h - 1) for x in range(w)]
             + [(0, y) for y in range(h)] + [(w - 1, y) for y in range(h)])
    for xy in seeds:
        if m.getpixel(xy) == (255, 255, 255):
            ImageDraw.floodfill(m, xy, (255, 0, 255))
    r = np.array(m)
    return (r[..., 0] == 255) & (r[..., 1] == 0) & (r[..., 2] == 255)


def main_component(mask, seed):
    """Keep only the blob the cap sits in, dropping stray page furniture."""
    h, w = mask.shape
    flat = np.where(mask, 255, 0).astype(np.uint8)
    m = Image.fromarray(np.dstack([flat] * 3), 'RGB')
    if m.getpixel(seed) != (255, 255, 255):
        return mask
    ImageDraw.floodfill(m, seed, (0, 255, 0))
    r = np.array(m)
    return (r[..., 0] == 0) & (r[..., 1] == 255) & (r[..., 2] == 0)


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
    bg = border_connected(bg)

    alpha = np.where(bg, 0, 255).astype(np.uint8)
    # the slide counter sits above the cap in every shot
    alpha[:int(h * 0.16)] = 0

    # The mockup's ground shadow under the brim. Fabric always carries a
    # little colour (stone ~25, charcoal ~5) or, on the black cap, sits far
    # below the shadow's luminance ramp; the shadow itself is a dead-neutral
    # grey. Tested only low in the frame, so the white crown embroidery is
    # never a candidate.
    low0 = int(h * 0.68)
    band = repaired[low0:].astype(int)
    lum = band.mean(2)
    sat = band.max(2) - band.min(2)
    shadow = (sat <= 2) & (lum > 100)
    a_low = alpha[low0:]
    a_low[shadow] = 0
    alpha[low0:] = a_low
    # the pale rim where the brim meets the crown reads as neutral too, so
    # restore anything the shadow test punched out inside the silhouette.
    alpha = np.where(border_connected(alpha == 0), 0, 255).astype(np.uint8)

    # the brim's underside is a smooth arc, so median-smooth the bottom
    # boundary across columns: that trims the teeth the per-pixel test leaves
    # in the weave and fills the notches it punches.
    bottom = np.full(w, -1)
    for c in range(w):
        rows = np.nonzero(alpha[:, c] > 0)[0]
        if len(rows):
            bottom[c] = rows[-1]
    cols = np.nonzero(bottom >= 0)[0]
    R = 26
    sm = bottom.copy()
    for c in cols:
        win = bottom[max(0, c - R):c + R + 1]
        win = win[win >= 0]
        if len(win):
            sm[c] = int(np.median(win))
    for c in cols:
        b, t = bottom[c], sm[c]
        if t > b:
            # only close a short notch, and only over pixels that are not the
            # page itself: at the brim's outer tips the median sits far below
            # the silhouette and would paint a white strip down the side.
            if t - b > 14:
                continue
            seg = repaired[b + 1:t + 1, c].astype(int)
            keep = ~((seg.min(1) > 214) & ((seg.max(1) - seg.min(1)) < 16))
            alpha[np.arange(b + 1, t + 1)[keep], c] = 255
        elif t < b:
            alpha[t + 1:b + 1, c] = 0

    alpha = np.where(main_component(alpha > 0, (w // 2, int(h * 0.40))),
                     255, 0).astype(np.uint8)

    im = Image.fromarray(np.dstack([repaired, alpha]), 'RGBA')
    # close single-pixel notches, then pull the edge in a touch: the page is
    # lighter than these caps, so the anti-aliased rim leaves a pale halo
    al = im.split()[3].filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.MinFilter(3))
    im.putalpha(al.filter(ImageFilter.GaussianBlur(0.9)))

    print(f'{name:9s} crop {src.size}  arrow px {int(am.sum()):6d}  transparent {100*bg.mean():4.1f}%')
    return im


OUT = '/home/user/Video-Editing/public/images/store/'

caps = {n: cut(n, s) for n, s in SHOTS.items()}
caps = {n: im.crop(im.split()[3].getbbox()) for n, im in caps.items()}

# one canvas for every colourway: the shots differ slightly in resolution, and
# a cap that jumps size between cuts reads as a mistake.
W = max(c.width for c in caps.values())
H = max(c.height for c in caps.values())
for n, c in caps.items():
    out = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    out.paste(c, ((W - c.width) // 2, 0), c)
    out.save(OUT + n + '.png')
    print(f'{n:9s} -> {OUT}{n}.png  {out.size}')
