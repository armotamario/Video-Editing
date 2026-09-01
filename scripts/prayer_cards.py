#!/usr/bin/env python3
"""Render the "Have you prayed today?" carousel as 1080x1920 cards.

Each card is laid out in HTML (so we get the real Playfair / JetBrains Mono
typography) and screenshotted with the bundled headless Chromium.

    python3 scripts/prayer_cards.py

Output: out/prayer-cards/card-NN.png
"""

import html
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FONTS = ROOT / "node_modules" / "@fontsource"
OUT = ROOT / "out" / "prayer-cards"
WORK = Path("/tmp/prayer-cards")
CHROME = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell"

PAPER_IN, PAPER_MID, PAPER_OUT = "#faf7f0", "#f0e8d9", "#e0d4bd"
INK, INK_SOFT, GOLD = "#17140f", "#6d6355", "#8a6a33"

# (kind, text, citation)
#   kind: "open" | "quote" | "close"
CARDS = [
    ("open", "Have you<br>prayed today?", "A daily examination"),

    ("quote",
     "Rejoice always, pray without ceasing, give thanks in all circumstances; "
     "for this is the will of God in Christ Jesus for you.",
     "1 Thessalonians 5:16–18 · NRSV"),
    ("quote",
     "But whenever you pray, go into your room and shut the door and pray to your "
     "Father who is in secret; and your Father who sees in secret will reward you.",
     "Matthew 6:6 · NRSV"),
    ("quote",
     "Do not worry about anything, but in everything by prayer and supplication with "
     "thanksgiving let your requests be made known to God.",
     "Philippians 4:6 · NRSV"),
    ("quote",
     "Then Jesus told them a parable about their need to pray always and not to lose heart.",
     "Luke 18:1 · NRSV"),
    ("quote",
     "Likewise the Spirit helps us in our weakness; for we do not know how to pray as we "
     "ought, but that very Spirit intercedes with sighs too deep for words.",
     "Romans 8:26 · NRSV"),
    ("quote",
     "Devote yourselves to prayer, keeping alert in it with thanksgiving.",
     "Colossians 4:2 · NRSV"),
    ("quote",
     "The prayer of the righteous is powerful and effective.",
     "James 5:16 · NRSV"),
    ("quote",
     "In the morning, while it was still very dark, he got up and went out to a deserted "
     "place, and there he prayed.",
     "Mark 1:35 · NRSV"),

    ("quote",
     "Prayer is the raising of one’s mind and heart to God or the requesting of good "
     "things from God.",
     "St. John Damascene · CCC 2559"),
    ("quote",
     "For me, prayer is a surge of the heart; it is a simple look turned toward heaven, "
     "it is a cry of recognition and of love, embracing both trial and joy.",
     "St. Thérèse of Lisieux · CCC 2558"),
    ("quote", "Prayer is a vital necessity.", "CCC 2744"),
    ("quote",
     "Prayer is both a gift of grace and a determined response on our part. "
     "It always presupposes effort.",
     "CCC 2725"),

    ("quote",
     "The first and foremost duty of all religious is to be the contemplation of divine "
     "things and assiduous union with God in prayer.",
     "Code of Canon Law · CIC c. 663 §1"),
    ("quote",
     "Other members of the Christian faithful are also earnestly invited to participate "
     "in the liturgy of the hours as an action of the Church.",
     "Code of Canon Law · CIC c. 1174 §2"),
    ("quote",
     "The Christian faithful have the right to worship God according to the prescripts of "
     "their own Church sui iuris.",
     "Eastern Code · CCEO c. 17"),

    ("quote",
     "When you read, God speaks to you; when you pray, you speak to God.",
     "St. Augustine · Enarrationes in Psalmos"),
    ("quote", "Prayer is the light of the soul.", "St. John Chrysostom"),
    ("quote",
     "Prayer is nothing else than being on terms of friendship with God.",
     "St. Teresa of Ávila · The Book of Her Life"),
    ("quote",
     "We pray not in order to change the divine disposition, but so that we may obtain by "
     "prayer what God has arranged to be given through prayer.",
     "St. Thomas Aquinas · Summa Theologiae II-II, q. 83"),

    ("close", "Pray<br>today.", "Wear your faith"),
]


def font_size(text: str, kind: str) -> int:
    if kind != "quote":
        return 132
    n = len(text)
    for limit, size in ((60, 92), (110, 80), (170, 70), (240, 62)):
        if n <= limit:
            return size
    return 56


def font_face(family: str, pkg: str, file: str, weight: int) -> str:
    return f"""@font-face {{
      font-family: '{family}';
      font-weight: {weight};
      src: url('file://{FONTS}/{pkg}/files/{file}') format('woff2');
    }}"""


CROSS = f"""<svg width="46" height="67" viewBox="0 0 100 145" fill="{GOLD}">
  <circle cx="50" cy="9" r="9"/><rect x="41" y="9" width="18" height="91"/>
  <circle cx="14" cy="41" r="9"/><circle cx="86" cy="41" r="9"/>
  <rect x="14" y="32" width="72" height="18"/><polygon points="41,100 59,100 50,145"/>
</svg>"""


def build_html(kind: str, text: str, citation: str) -> str:
    size = font_size(text, kind)
    body = text if kind != "quote" else html.escape(text)
    quote_mark = (
        f'<div class="mark">“</div>' if kind == "quote" else ""
    )
    brand = (
        '<div class="brand">GODLY RAIMENT</div>' if kind == "close" else ""
    )
    return f"""<!doctype html><html><head><meta charset="utf-8"><style>
    {font_face('Playfair', 'playfair-display', 'playfair-display-latin-500-normal.woff2', 500)}
    {font_face('Playfair', 'playfair-display', 'playfair-display-latin-700-normal.woff2', 700)}
    {font_face('Mono', 'jetbrains-mono', 'jetbrains-mono-latin-400-normal.woff2', 400)}
    * {{ margin: 0; padding: 0; box-sizing: border-box; }}
    html, body {{ width: 1080px; height: 1920px; }}
    body {{
      background: radial-gradient(ellipse 120% 78% at 50% 42%,
        {PAPER_IN} 0%, {PAPER_MID} 55%, {PAPER_OUT} 100%);
      display: flex; flex-direction: column; align-items: center;
      justify-content: space-between; padding: 180px 96px 240px;
      text-align: center; -webkit-font-smoothing: antialiased;
    }}
    .top {{ display: flex; flex-direction: column; align-items: center; gap: 34px; }}
    .rule {{ width: 74px; height: 2px; background: {GOLD}; opacity: .55; }}
    .mid {{ display: flex; flex-direction: column; align-items: center;
            justify-content: center; flex: 1; }}
    .mark {{ font-family: 'Playfair', serif; font-size: 130px; line-height: .5;
             color: {GOLD}; opacity: .35; margin-bottom: 46px; }}
    .text {{ font-family: 'Playfair', serif; font-weight: {700 if kind != 'quote' else 500};
             font-size: {size}px; line-height: 1.3; color: {INK};
             letter-spacing: {'-0.02em' if kind != 'quote' else '0'}; max-width: 860px; }}
    .bottom {{ display: flex; flex-direction: column; align-items: center; gap: 26px; }}
    .cite {{ font-family: 'Mono', monospace; font-size: 25px; letter-spacing: .16em;
             text-transform: uppercase; color: {GOLD}; }}
    .brand {{ font-family: 'Mono', monospace; font-size: 21px; letter-spacing: .38em;
              color: {INK_SOFT}; margin-top: 14px; }}
    </style></head><body>
      <div class="top">{CROSS}<div class="rule"></div></div>
      <div class="mid">{quote_mark}<div class="text">{body}</div></div>
      <div class="bottom"><div class="rule"></div>
        <div class="cite">{html.escape(citation)}</div>{brand}</div>
    </body></html>"""


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    WORK.mkdir(parents=True, exist_ok=True)

    for i, (kind, text, citation) in enumerate(CARDS, start=1):
        page = WORK / f"card-{i:02d}.html"
        page.write_text(build_html(kind, text, citation))
        target = OUT / f"card-{i:02d}.png"
        subprocess.run(
            [CHROME, "--headless", "--no-sandbox", "--disable-gpu", "--hide-scrollbars",
             "--force-device-scale-factor=1", "--window-size=1080,1920",
             f"--screenshot={target}", f"file://{page}"],
            check=True, capture_output=True,
        )
        print(f"card-{i:02d}.png  {citation}")

    print(f"\n{len(CARDS)} cards -> {OUT}")


if __name__ == "__main__":
    main()
