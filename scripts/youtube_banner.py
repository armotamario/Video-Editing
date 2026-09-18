#!/usr/bin/env python3
"""The GR mark as a YouTube banner, sized so nothing is ever cropped.

YouTube takes one 2560x1440 image and shows a different slice of it on every
device. Only the centre 1546x423 — the "safe area" — is visible everywhere,
including on a TV, so the whole mark goes inside that box and the rest of the
canvas is just ground extending to the edges.

    python3 scripts/youtube_banner.py <logo> -o <outdir>
"""

import argparse
from pathlib import Path

import numpy as np
from PIL import Image

CANVAS = (2560, 1440)
SAFE = (1546, 423)          # visible on every device, including TV
MARK_HEIGHT = 330           # inside the safe height, with air above and below


def trim(im):
    """The mark's own bounds, whatever margin the file was saved with."""
    a = np.array(im.convert("L"))
    ink = a < 128 if a[0, 0] > 128 else a > 128
    ys, xs = np.nonzero(ink)
    if not len(ys):
        return im
    return im.crop((int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1))


def banner(logo, ground, mark):
    """Centre the mark in the safe area on a full-bleed ground."""
    cw, ch = CANVAS
    out = Image.new("RGB", CANVAS, ground)

    sw, sh = SAFE
    scale = min(MARK_HEIGHT / logo.height, (sw * 0.6) / logo.width)
    size = (max(int(round(logo.width * scale)), 1), max(int(round(logo.height * scale)), 1))
    art = logo.resize(size, Image.LANCZOS)

    # recolour the mark and carry its shape as the alpha, so it sits on any ground
    a = np.array(art.convert("L")).astype(float) / 255.0
    alpha = (1.0 - a) if np.array(art.convert("L"))[0, 0] > 128 else a
    tile = Image.new("RGB", size, mark)
    out.paste(tile, ((cw - size[0]) // 2, (ch - size[1]) // 2),
              Image.fromarray((alpha * 255).astype(np.uint8)))
    return out


def guides(im):
    """A proof copy with the crops YouTube applies drawn on."""
    from PIL import ImageDraw
    out = im.copy()
    d = ImageDraw.Draw(out, "RGBA")
    cw, ch = CANVAS
    for (w, h), colour, label in ((SAFE, (255, 60, 140, 255), "TV / all devices  1546x423"),
                                 ((1855, 423), (60, 170, 255, 255), "tablet  1855x423"),
                                 ((2560, 423), (255, 190, 40, 255), "desktop  2560x423")):
        box = ((cw - w) // 2, (ch - h) // 2, (cw + w) // 2 - 1, (ch + h) // 2 - 1)
        d.rectangle(box, outline=colour, width=4)
        d.text((box[0] + 12, box[1] + 10), label, fill=colour)
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("logo")
    ap.add_argument("-o", "--out", required=True)
    args = ap.parse_args()
    out_dir = Path(args.out)
    out_dir.mkdir(parents=True, exist_ok=True)

    logo = trim(Image.open(args.logo))
    for name, ground, mark in (("banner-black", (11, 10, 9), (255, 255, 255)),
                               ("banner-white", (247, 246, 243), (18, 16, 15))):
        im = banner(logo, ground, mark)
        im.save(out_dir / f"{name}.png")
        guides(im).save(out_dir / f"{name}-guides.png")
        print(f"{name}.png  {im.size}")


if __name__ == "__main__":
    main()
