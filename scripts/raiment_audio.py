#!/usr/bin/env python3
"""Synthesise the soundtrack beds for the Godly Raiment film set.

Four 16s reverent tracks that share the web set's mastering chain, so they sit
at the same loudness and stay audible on a phone speaker.

    python3 scripts/raiment_audio.py

Output: public/audio/gr-<name>.wav
"""

import sys
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent))

from web_audio import (  # noqa: E402
    DUR,
    N,
    OUT,
    bell,
    finish,
    hat,
    kick,
    lowpass,
    noise,
    pad,
    place,
    pluck,
    reverb,
    riser,
    saw,
    sine,
    t,
)
import wave  # noqa: E402

SR = 44100


def write(name: str, left: np.ndarray, right: np.ndarray) -> None:
    stereo = finish(left, right)
    data = (stereo * 32767).astype("<i2")
    with wave.open(str(OUT / f"gr-{name}.wav"), "wb") as f:
        f.setnchannels(2)
        f.setsampwidth(2)
        f.setframerate(SR)
        f.writeframes(data.tobytes())
    print(f"gr-{name}.wav  {DUR:.0f}s")


def organ(freqs, dur):
    """Stacked sines with a slow swell — a pipe organ without the noise."""
    n = int(dur * SR)
    v = np.zeros(n)
    for f in freqs:
        for m, g in ((1, 1.0), (2, 0.5), (3, 0.28), (4, 0.16), (6, 0.08)):
            v += np.sin(2 * np.pi * f * m * t(n)) * g
    v /= len(freqs) * 2.0
    swell = np.linspace(0, 1, n) ** 0.4
    tail = np.linspace(1, 0, n) ** 0.6
    return v * np.minimum(swell * 3, 1.0) * tail


def choir(freqs, dur):
    n = int(dur * SR)
    v = np.zeros(n)
    for f in freqs:
        for d in (-0.006, 0.0, 0.006):
            v += saw(f * (1 + d), n)
    v = lowpass(v / (len(freqs) * 3), 2200)
    vib = 1 + 0.02 * np.sin(2 * np.pi * 4.5 * t(n))
    return v * vib * np.minimum(np.linspace(0, 4, n), 1.0) * np.linspace(1, 0, n) ** 0.5


def shaker(dur=0.09):
    n = int(dur * SR)
    return (noise(n) - lowpass(noise(n), 5000)) * np.exp(-t(n) * 55)


def chant() -> None:
    """Low drone, a bell on the bar, a choir that opens at the first cut."""
    m = np.zeros(N)
    m += lowpass(saw(65.41, N) + saw(65.41 * 1.004, N), 500) * 0.10
    place(m, 0.0, riser(2.8, 130, 1500), 0.22)
    for i, ch in enumerate([(261.63, 329.63, 392.00), (233.08, 293.66, 349.23),
                            (261.63, 311.13, 392.00), (196.00, 261.63, 329.63)]):
        place(m, 0.5 + i * 4.0, choir(ch, 4.2), 0.26)
        place(m, 0.5 + i * 4.0, organ([f / 2 for f in ch], 4.0), 0.16)
    for bar in range(1, 8):
        place(m, bar * 2.0, kick(0.5, 100, 42, click=0.15), 0.4)
        place(m, bar * 2.0, bell(1046.50 if bar % 2 else 783.99, 2.4), 0.36)
    for i in range(int(3.0 / 0.25), int(DUR / 0.25)):
        place(m, i * 0.25, hat(0.05, 8200, 130), 0.16 if i % 2 else 0.26)
    for i, f in enumerate((1318.51, 1174.66, 1567.98, 1174.66)):
        place(m, 3.0 + i * 2.0, pluck(f, 0.8, (1.0, 0.55, 0.3)), 0.34)
    place(m, 12.0, organ([130.81, 196.00, 261.63, 329.63], 4.0), 0.26)
    place(m, 12.0, bell(1567.98, 3.0), 0.26)
    wet = reverb(m, 0.34)
    write("chant", wet, np.concatenate([[0, 0, 0], wet[:-3]]))


def vigil() -> None:
    """Sparse and still — a single line over candlelight."""
    m = np.zeros(N)
    place(m, 0.0, riser(2.6, 110, 900), 0.16)
    line = [880.00, 987.77, 1046.50, 987.77, 783.99, 880.00, 659.25, 783.99]
    for i, f in enumerate(line):
        place(m, 2.8 + i * 1.6, pluck(f, 1.2, (1.0, 0.45, 0.2)), 0.30)
        place(m, 3.6 + i * 1.6, bell(f * 2, 1.0), 0.14)
    for i, ch in enumerate([(220.00, 329.63), (196.00, 293.66), (174.61, 261.63), (196.00, 246.94)]):
        place(m, 0.4 + i * 4.0, pad(ch, 4.4), 0.28)
    for bar in range(2, 8):
        place(m, bar * 2.0, kick(0.46, 96, 40, click=0.12), 0.34)
        place(m, bar * 2.0 + 1.0, shaker(), 0.22)
    for i in range(int(4.0 / 0.5), int(DUR / 0.5)):
        place(m, i * 0.5, hat(0.045, 7600, 150), 0.16)
    place(m, 12.0, choir((261.63, 329.63, 392.00), 3.8), 0.28)
    place(m, 12.0, bell(1318.51, 2.8), 0.22)
    wet = reverb(m, 0.36)
    write("vigil", wet, np.concatenate([[0, 0, 0, 0], wet[:-4]]))


def hymn() -> None:
    """Warm and rising — the one that should feel like good news."""
    m = np.zeros(N)
    place(m, 0.0, riser(2.8, 160, 2000), 0.22)
    prog = [(261.63, 329.63, 392.00), (349.23, 440.00, 523.25),
            (293.66, 369.99, 440.00), (392.00, 493.88, 587.33)]
    for i, ch in enumerate(prog):
        place(m, 0.5 + i * 4.0, organ(ch, 4.2), 0.22)
        place(m, 2.5 + i * 4.0, choir([f * 2 for f in ch], 2.0), 0.18)
    arp = [523.25, 659.25, 783.99, 1046.50, 783.99, 659.25]
    for i in range(int((DUR - 2.8) / 0.25)):
        place(m, 2.8 + i * 0.25, pluck(arp[i % len(arp)], 0.4, (1.0, 0.5, 0.25)), 0.22)
    for bar in range(1, 8):
        b = bar * 2.0
        place(m, b, kick(0.42, 110, 44, click=0.2), 0.42)
        place(m, b + 1.0, kick(0.4, 104, 42, click=0.18), 0.3)
        for k in range(4):
            place(m, b + k * 0.5 + 0.25, shaker(), 0.2)
    place(m, 12.0, organ([196.00, 261.63, 329.63, 392.00], 4.0), 0.28)
    place(m, 12.0, bell(1567.98, 3.0), 0.24)
    wet = reverb(m, 0.28)
    write("hymn", wet, np.concatenate([[0, 0], wet[:-2]]))


def procession() -> None:
    """Steady and weighty — for the one about the Mass."""
    m = np.zeros(N)
    m += lowpass(sine(98.00, N) + sine(146.83, N) * 0.6, 700) * 0.06
    place(m, 0.0, riser(2.8, 140, 1700), 0.24)
    for bar in range(1, 8):
        b = bar * 2.0
        place(m, b, kick(0.52, 112, 44, click=0.18), 0.46)
        place(m, b + 1.0, kick(0.44, 104, 42, click=0.14), 0.3)
        place(m, b + 1.5, shaker(), 0.24)
    for i, ch in enumerate([(196.00, 246.94, 293.66), (220.00, 261.63, 329.63),
                            (174.61, 220.00, 261.63), (196.00, 233.08, 293.66)]):
        place(m, 0.5 + i * 4.0, organ(ch, 4.2), 0.24)
    for i in range(8):
        place(m, 3.0 + i * 1.5, bell(1046.50 if i % 2 else 1318.51, 1.6), 0.22)
    for i in range(int(3.0 / 0.25), int(DUR / 0.25)):
        place(m, i * 0.25, hat(0.045, 8000, 160), 0.13 if i % 2 else 0.22)
    place(m, 12.0, organ([130.81, 196.00, 261.63, 392.00], 4.0), 0.3)
    place(m, 12.0, bell(1567.98, 3.0), 0.24)
    wet = reverb(m, 0.3)
    write("procession", wet, np.concatenate([[0, 0, 0], wet[:-3]]))


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    chant()
    vigil()
    hymn()
    procession()
