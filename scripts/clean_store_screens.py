#!/usr/bin/env python3
"""Store-page screenshots, ready to post.

Three changes only, and nothing else in the frame is touched:

  * the carousel chevrons come out,
  * the slide counter ("1 / 3") comes out,
  * the frame goes to a true 9:16 so nothing letterboxes.

Both the chevrons and the counter sit on the product photo's plain white card,
clear of the garment, so clearing the card back to white outside the garment
silhouette removes exactly those two and leaves the header, the title, the
price and the rest of the page untouched.

The 9:16 is made by widening rather than cropping — a 1290x2796 phone shot is
taller than 9:16, so any crop would eat the page. Each row is extended with
its own edge colour, so the black header extends as black and the white page
as white: the frame gets wider, no bar appears, and nothing is lost.

    python3 scripts/clean_store_screens.py <image> [<image> ...] -o <outdir>
"""

import argparse
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw


def white_mask(a):
    return (a.min(2) >= 250) & ((a.max(2) - a.min(2)) <= 6)


def card_zone(a):
    """The rows of the product card: below the black header, above the title.

    Bounding it this way matters — the chevrons and the counter sit inside it,
    and the title sits just under it, so a zone measured off the garment with a
    fixed margin clips the top of "GODLY".
    """
    h, w, _ = a.shape
    dark = (a.mean(2) < 90).mean(1)
    header = np.nonzero(dark[:int(h * 0.30)] > 0.8)[0]
    top = int(header[-1]) + 2 if len(header) else 0

    ink = ~white_mask(a)
    # find the garment first, so the search for the title starts below it: the
    # sleeves reach into the left margin, and searching from the header up
    # would stop on the garment rather than on the title
    solid = ink[:, int(w * 0.20):int(w * 0.80)].mean(1) > 0.25
    edges = np.diff(np.concatenate(([0], solid.view(np.int8), [0])))
    st, en = np.nonzero(edges == 1)[0], np.nonzero(edges == -1)[0]
    if not len(st):
        return top, top
    end = int(en[int(np.argmax(en - st))])

    # the title is set to the left margin, well outside the garment
    left_ink = ink[:, int(w * 0.02):int(w * 0.30)].mean(1) > 0.01
    below = np.nonzero(left_ink[end:])[0]
    bot = end + int(below[0]) - 2 if len(below) else h
    return top, max(bot, top)


def clear_card(a):
    """White out everything on the product card except the garment."""
    out = a.copy()
    top, bot = card_zone(a)
    if bot <= top:
        return out
    zone = a[top:bot]
    zh, zw, _ = zone.shape

    solid = ~white_mask(zone)
    flat = np.where(solid, 255, 0).astype(np.uint8)
    m = Image.fromarray(np.dstack([flat] * 3), "RGB")
    seed = (zw // 2, zh // 2)
    if m.getpixel(seed) != (255, 255, 255):
        return out
    ImageDraw.floodfill(m, seed, (0, 255, 0))
    r = np.array(m)
    garment = (r[..., 0] == 0) & (r[..., 1] == 255) & (r[..., 2] == 0)

    cleaned = zone.copy()
    margin = 45  # keeps the garment's own drop shadow
    for y in range(zh):
        cols = np.nonzero(garment[y])[0]
        if not len(cols):
            cleaned[y] = 255
            continue
        cleaned[y, :max(int(cols[0]) - margin, 0)] = 255
        cleaned[y, min(int(cols[-1]) + margin + 1, zw):] = 255
    out[top:bot] = cleaned
    return out


def widen(a, ratio=9 / 16):
    """Extend each row with its own edge colour until the frame is 9:16."""
    h, w, _ = a.shape
    target = int(round(h * ratio))
    if target <= w:
        return a
    pad = target - w
    left, right = pad // 2, pad - pad // 2
    return np.concatenate(
        [np.repeat(a[:, :1], left, axis=1), a, np.repeat(a[:, -1:], right, axis=1)],
        axis=1,
    )


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("images", nargs="+")
    ap.add_argument("-o", "--out", required=True)
    args = ap.parse_args()
    out_dir = Path(args.out)
    out_dir.mkdir(parents=True, exist_ok=True)

    for src in args.images:
        a = np.array(Image.open(src).convert("RGB")).astype(int)
        done = widen(clear_card(a))
        im = Image.fromarray(done.astype(np.uint8))
        path = out_dir / (Path(src).stem + ".png")
        im.save(path)
        print(f"{Path(src).name}  ->  {path.name}  {im.size}  "
              f"aspect {im.width / im.height:.4f}")


if __name__ == "__main__":
    main()
