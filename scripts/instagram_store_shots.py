#!/usr/bin/env python3
"""Store shots fitted to Instagram's feed, with nothing cropped.

A 9:16 image posted to the feed gets centre-cropped to 4:5, which is why a
promo that looks right on TikTok and YouTube loses its edges on Instagram. So
the frame here is 4:5 and the shot is *contained* in it rather than filled:
everything that was in the picture is still in the picture.

The padding is the page's own white, so there is no bar of any colour, and the
carousel chevrons come out on the way past — they sit on the plain card, clear
of the product, so clearing the card outside the product silhouette takes them
without touching the title, the price or anything else on the page.

    python3 scripts/instagram_store_shots.py <image> [...] -o <outdir>
"""

import argparse
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

from cut_store_hats import arrow_mask, inpaint_vertical

# 4:5 is the tallest the feed shows uncropped; 1440 wide is the most it keeps.
FRAME = (1440, 1800)


def white_mask(a):
    return (a.min(2) >= 250) & ((a.max(2) - a.min(2)) <= 6)


def clear_card(a):
    """Take out the carousel chevrons and the scrollbar rule.

    The chevrons are what they have always been in these shots — short, thin,
    dark runs near the sides at mid height — so the detector written for the
    cap shots finds them here too, and repairing them vertically just puts the
    white card back. Nothing else on the page is touched.
    """
    # the chevrons ride at the product's own mid height, which varies between
    # these shots, so the search band is tied to the product rather than fixed
    # — widened to a flat fraction it reaches the title and eats the "G".
    h, w, _ = a.shape
    solid = (~white_mask(a)[:, int(w * 0.20):int(w * 0.80)]).mean(1) > 0.25
    e = np.diff(np.concatenate(([0], solid.view(np.int8), [0])))
    st, en = np.nonzero(e == 1)[0], np.nonzero(e == -1)[0]
    if len(st):
        i = int(np.argmax(en - st))
        band = (max(int(st[i]) / h - 0.02, 0.0), min(int(en[i]) / h + 0.02, 1.0))
    else:
        band = (0.30, 0.72)
    mask = arrow_mask(a, band=band)
    mask = np.array(Image.fromarray((mask * 255).astype(np.uint8))
                    .filter(ImageFilter.MaxFilter(5))) > 127
    out = inpaint_vertical(a.astype(np.uint8), mask).astype(int)

    # the page's scrollbar survives as a hairline against one edge
    clean = white_mask(out).mean(0) > 0.99
    w = out.shape[1]
    margin = int(w * 0.10)
    edges = np.diff(np.concatenate(([0], (~clean).view(np.int8), [0])))
    for a0, b0 in zip(np.nonzero(edges == 1)[0], np.nonzero(edges == -1)[0]):
        if b0 - a0 > 26 or (a0 >= margin and b0 <= w - margin):
            continue
        src = a0 - 1 if a0 > 0 and clean[a0 - 1] else min(b0, w - 1)
        out[:, a0:b0] = out[:, src][:, None, :]
    return out


def fit(a, frame=FRAME):
    """Contain the whole shot in the frame, padded with its own white."""
    im = Image.fromarray(a.astype(np.uint8))
    fw, fh = frame
    scale = min(fw / im.width, fh / im.height)
    size = (max(int(round(im.width * scale)), 1), max(int(round(im.height * scale)), 1))
    im = im.resize(size, Image.LANCZOS)
    out = Image.new("RGB", frame, (255, 255, 255))
    out.paste(im, ((fw - size[0]) // 2, (fh - size[1]) // 2))
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("images", nargs="+")
    ap.add_argument("-o", "--out", required=True)
    ap.add_argument("--name", nargs="*", default=None)
    args = ap.parse_args()
    out_dir = Path(args.out)
    out_dir.mkdir(parents=True, exist_ok=True)

    for i, src in enumerate(args.images):
        a = np.array(Image.open(src).convert("RGB")).astype(int)
        im = fit(clear_card(a))
        stem = args.name[i] if args.name and i < len(args.name) else Path(src).stem
        path = out_dir / f"{stem}.jpg"
        im.save(path, quality=96, subsampling=0)
        print(f"{Path(src).name}  ->  {path.name}  {im.size}  "
              f"aspect {im.width / im.height:.3f}")


if __name__ == "__main__":
    main()
