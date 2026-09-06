#!/usr/bin/env python3
"""Synthesise an original cinematic bed for the sermon-style shorts.

Reverent and slow: a low string-like pad moving through Am - F - C - G, a
soft bell ostinato over the top, sub hits on the chord changes and a lift
two thirds of the way in. Mixed to sit under a speaking voice.

    python3 scripts/sermon_bed.py

Output: out/audio/sermon-bed.wav
"""

import sys
import wave
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent))

from web_audio import (  # noqa: E402
    SR, bell, finish, impact, pad, place, pluck, reverb, riser, sub808,
)

DUR = 30.0
N = int(SR * DUR)
OUT = Path(__file__).resolve().parent.parent / "out" / "audio"

# A minor: Am - F - C - G - Am, six seconds each.
CHORDS = [
    (220.00, 261.63, 329.63),
    (174.61, 220.00, 261.63),
    (196.00, 261.63, 329.63),
    (196.00, 246.94, 293.66),
    (220.00, 261.63, 329.63),
]
ROOTS = [55.00, 87.31, 65.41, 49.00, 55.00]


def build() -> np.ndarray:
    m = np.zeros(N)

    for i, ch in enumerate(CHORDS):
        at = i * 6.0
        place(m, at, pad(ch, 6.6), 0.34)
        place(m, at, pad(tuple(f * 2 for f in ch), 6.2), 0.13)
        place(m, at, sub808(ROOTS[i], 2.4), 0.30)

    # Opening swell and the lift where the message turns.
    place(m, 0.0, riser(3.2, 110, 900), 0.16)
    place(m, 0.0, impact(2.6), 0.34)
    place(m, 18.0, riser(2.2, 160, 1200), 0.14)
    place(m, 18.0, impact(2.8), 0.30)

    # Bell ostinato — enters after the first chord, thins out at the end.
    figure = [659.25, 523.25, 880.00, 659.25, 587.33, 523.25]
    for i in range(28):
        at = 4.0 + i * 0.9
        if at > DUR - 2.0:
            break
        f = figure[i % len(figure)]
        gain = 0.16 if i % 2 else 0.22
        if at >= 18.0:
            gain *= 1.25
        place(m, at, bell(f, 1.8), gain)
        if i % 3 == 0:
            place(m, at + 0.45, pluck(f * 2, 0.5, (1.0, 0.4, 0.2)), 0.10)

    # A single high bell to close it out.
    place(m, 25.6, bell(1046.50, 3.4), 0.18)
    place(m, 25.6, pad((220.00, 261.63, 329.63), 4.2), 0.24)

    return reverb(m, 0.34, decay=0.5)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    wet = build()
    delay = int(SR * 0.012)
    right = np.concatenate([np.zeros(delay), wet[:-delay]])
    stereo = finish(wet, right, target_rms=0.24, peak=0.88)
    data = (stereo * 32767).astype("<i2")
    path = OUT / "sermon-bed.wav"
    with wave.open(str(path), "wb") as f:
        f.setnchannels(2)
        f.setsampwidth(2)
        f.setframerate(SR)
        f.writeframes(data.tobytes())
    print(f"{path}  {DUR:.0f}s")


if __name__ == "__main__":
    main()
