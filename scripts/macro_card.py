#!/usr/bin/env python3
"""Lay out the meal photo and its macros so neither covers the other.

    python3 scripts/macro_card.py

Output: out/food/macros-story.png (1080x1920) and macros-feed.png (1080x1350)
"""

import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FONTS = ROOT / "node_modules" / "@fontsource" / "inter" / "files"
PHOTO = ROOT / "out" / "food" / "food-square.jpg"
OUT = ROOT / "out" / "food"
WORK = Path("/tmp/macro-card")
CHROME = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell"

INK = "#ffffff"
INK_SOFT = "#9a9186"
ACCENT = "#ff8a3d"
PANEL = "#121110"

TOTAL = {"weight": "939g", "kcal": "1,840", "p": "179g", "c": "74g", "f": "87g"}
ITEMS = [
    ("Meat", "525g", "1,250", "125g", "—", "80g"),
    ("Chicken", "152g", "250", "47g", "—", "6g"),
    ("Rice", "262g", "340", "7g", "74g", "1g"),
]


def font_face(weight: int, file: str) -> str:
    return f"""@font-face {{ font-family: 'Inter'; font-weight: {weight};
      src: url('file://{FONTS}/{file}') format('woff2'); }}"""


def build(width: int, height: int, photo_h: int) -> str:
    rows = "".join(
        f"""<div class="row">
              <div class="name">{name}<span class="w">{w}</span></div>
              <div class="nums">
                <span class="kcal">{kcal}</span>
                <span class="macro">P {p}</span>
                <span class="macro">C {c}</span>
                <span class="macro">F {f}</span>
              </div>
            </div>"""
        for name, w, kcal, p, c, f in ITEMS
    )

    return f"""<!doctype html><html><head><meta charset="utf-8"><style>
    {font_face(500, 'inter-latin-500-normal.woff2')}
    {font_face(700, 'inter-latin-700-normal.woff2')}
    {font_face(900, 'inter-latin-900-normal.woff2')}
    * {{ margin:0; padding:0; box-sizing:border-box; }}
    html, body {{ width:{width}px; height:{height}px; }}
    body {{ background:{PANEL}; font-family:'Inter',sans-serif;
            -webkit-font-smoothing:antialiased; display:flex; flex-direction:column; }}

    .photo {{ position:relative; height:{photo_h}px; flex:none; overflow:hidden; }}
    .photo img {{ width:100%; height:100%; object-fit:cover; object-position:center 30%; display:block; }}
    .fade {{ position:absolute; inset:auto 0 0 0; height:200px;
             background:linear-gradient(to bottom, rgba(18,17,16,0), {PANEL}); }}

    .panel {{ flex:1; padding:0 62px 54px; display:flex; flex-direction:column; }}

    .hero {{ display:flex; align-items:flex-end; justify-content:space-between;
             padding-bottom:28px; }}
    .hero .label {{ font-size:23px; font-weight:700; letter-spacing:.28em;
                    text-transform:uppercase; color:{ACCENT}; margin-bottom:14px; }}
    .hero .kcal {{ font-size:112px; font-weight:900; color:{INK}; line-height:.9;
                   letter-spacing:-.03em; }}
    .hero .kcal span {{ font-size:34px; font-weight:700; color:{INK_SOFT};
                        letter-spacing:0; margin-left:12px; }}
    .hero .weight {{ font-size:30px; font-weight:700; color:{INK_SOFT}; }}

    .chips {{ display:flex; gap:16px; padding-bottom:34px; }}
    .chip {{ flex:1; background:#1c1a18; border-radius:22px; padding:22px 0 20px;
             text-align:center; }}
    .chip .v {{ font-size:52px; font-weight:900; color:{ACCENT}; letter-spacing:-.02em; }}
    .chip .k {{ font-size:21px; font-weight:700; color:{INK_SOFT};
                letter-spacing:.2em; text-transform:uppercase; margin-top:6px; }}

    .rows {{ border-top:1px solid #2a2724; }}
    .row {{ display:flex; align-items:center; justify-content:space-between;
            padding:22px 2px; border-bottom:1px solid #2a2724; }}
    .name {{ font-size:36px; font-weight:900; color:{INK}; letter-spacing:-.01em; }}
    .name .w {{ font-size:25px; font-weight:700; color:{INK_SOFT}; margin-left:14px; }}
    .nums {{ display:flex; align-items:baseline; gap:20px; }}
    .kcal {{ font-size:34px; font-weight:900; color:{ACCENT}; }}
    .macro {{ font-size:25px; font-weight:700; color:{INK_SOFT}; min-width:86px;
              text-align:right; }}

    .foot {{ margin-top:auto; padding-top:26px; font-size:22px; font-weight:700;
             letter-spacing:.22em; text-transform:uppercase; color:#6a635b; }}
    </style></head><body>
      <div class="photo"><img src="file://{PHOTO}"><div class="fade"></div></div>
      <div class="panel">
        <div class="hero">
          <div>
            <div class="label">Total meal</div>
            <div class="kcal">{TOTAL['kcal']}<span>kcal</span></div>
          </div>
          <div class="weight">{TOTAL['weight']}</div>
        </div>
        <div class="chips">
          <div class="chip"><div class="v">{TOTAL['p']}</div><div class="k">Protein</div></div>
          <div class="chip"><div class="v">{TOTAL['c']}</div><div class="k">Carbs</div></div>
          <div class="chip"><div class="v">{TOTAL['f']}</div><div class="k">Fat</div></div>
        </div>
        <div class="rows">{rows}</div>
        <div class="foot">Rough estimates only</div>
      </div>
    </body></html>"""


def render(name: str, width: int, height: int, photo_h: int) -> None:
    page = WORK / f"{name}.html"
    page.write_text(build(width, height, photo_h))
    subprocess.run(
        [CHROME, "--headless", "--no-sandbox", "--disable-gpu", "--hide-scrollbars",
         "--force-device-scale-factor=1", f"--window-size={width},{height}",
         f"--screenshot={OUT / (name + '.png')}", f"file://{page}"],
        check=True, capture_output=True,
    )
    print(f"{name}.png  {width}x{height}")


if __name__ == "__main__":
    WORK.mkdir(parents=True, exist_ok=True)
    OUT.mkdir(parents=True, exist_ok=True)
    render("macros-story", 1080, 1920, 1120)
    render("macros-feed", 1080, 1350, 540)
