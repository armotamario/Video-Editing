#!/usr/bin/env python3
"""Synthesise the soundtrack beds for the MFBA Shredded Series.

Four 16s gym tracks through the same mastering chain as the other sets, so
everything on the account plays back at one level.

    python3 scripts/shred_audio.py

Output: public/audio/shred-<name>.wav
"""

import sys
import wave
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
    impact,
    kick,
    lowpass,
    highpass,
    noise,
    pad,
    place,
    pluck,
    reverb,
    rim,
    riser,
    saw,
    snare,
    sub808,
    t,
)

SR = 44100


def write(name: str, left: np.ndarray, right: np.ndarray) -> None:
    stereo = finish(left, right)
    with wave.open(str(OUT / f"shred-{name}.wav"), "wb") as f:
        f.setnchannels(2)
        f.setsampwidth(2)
        f.setframerate(SR)
        f.writeframes((stereo * 32767).astype("<i2").tobytes())
    print(f"shred-{name}.wav  {DUR:.0f}s")


def stab(freq, dur=0.35):
    """Short detuned saw hit — the sound of a set starting."""
    n = int(dur * SR)
    v = saw(freq, n) + saw(freq * 1.01, n) + saw(freq * 0.99, n)
    return lowpass(v / 3, 3000) * np.exp(-t(n) * 9)


def clap(dur=0.24):
    n = int(dur * SR)
    body = highpass(noise(n), 1200) * np.exp(-t(n) * 22)
    return body + np.sin(2 * np.pi * 240 * t(n)) * np.exp(-t(n) * 40) * 0.3


def drive() -> None:
    """Hard and forward — the one for lifting."""
    m = np.zeros(N)
    place(m, 0.0, riser(2.8, 200, 3200), 0.26)
    place(m, 2.8, impact(1.8), 0.5)
    for bar in range(1, 8):
        b = bar * 2.0
        for p in (0.0, 0.75, 1.5):
            place(m, b + p, kick(0.4, 132, 46), 0.55)
        place(m, b + 1.0, clap(), 0.4)
        place(m, b, sub808(65.41 if bar % 2 else 55.00, 1.2), 0.32)
    for i in range(int(3.0 / 0.25), int(DUR / 0.25)):
        at = i * 0.25
        place(m, at, hat(0.05, 8000, 140), 0.30 if i % 2 else 0.20)
    riff = [659.25, 659.25, 783.99, 587.33, 523.25, 587.33]
    for i in range(int((DUR - 3.0) / 0.5)):
        place(m, 3.0 + i * 0.5, stab(riff[i % len(riff)]), 0.26)
    place(m, 12.0, impact(2.4), 0.5)
    place(m, 12.0, bell(1318.51, 2.6), 0.20)
    wet = reverb(m, 0.18)
    write("drive", wet, np.concatenate([[0, 0, 0], wet[:-3]]))


def grind() -> None:
    """Darker and heavier — the second lifting day."""
    m = np.zeros(N)
    m += lowpass(saw(82.41, N) + saw(82.41 * 1.006, N), 900) * 0.07
    place(m, 0.0, riser(2.8, 120, 2400), 0.24)
    place(m, 2.8, impact(2.0), 0.55)
    for bar in range(1, 8):
        b = bar * 2.0
        place(m, b, kick(0.46, 128, 44), 0.55)
        place(m, b + 1.25, kick(0.4, 118, 42), 0.36)
        place(m, b + 1.0, snare(0.26, 200), 0.42)
        place(m, b + 0.5, rim(0.09), 0.26)
    for i in range(int(3.0 / 0.25), int(DUR / 0.25)):
        place(m, i * 0.25, hat(0.045, 7200, 150), 0.26 if i % 2 else 0.18)
    line = [440.00, 466.16, 392.00, 349.23]
    for i in range(int((DUR - 3.0) / 0.75)):
        place(m, 3.0 + i * 0.75, pluck(line[i % 4] * 2, 0.5, (1.0, 0.6, 0.35)), 0.24)
    place(m, 12.0, impact(2.6), 0.55)
    wet = reverb(m, 0.2)
    write("grind", wet, np.concatenate([[0, 0], wet[:-2]]))


def pace() -> None:
    """Steady four-on-the-floor at running cadence — cardio."""
    m = np.zeros(N)
    place(m, 0.0, riser(2.6, 220, 3000), 0.22)
    for bar in range(1, 8):
        b = bar * 2.0
        for beat in range(4):
            place(m, b + beat * 0.5, kick(0.36, 122, 46), 0.5)
            place(m, b + beat * 0.5 + 0.25, hat(0.05, 9000, 170), 0.26)
        place(m, b + 1.0, clap(), 0.32)
    arp = [880.00, 987.77, 1174.66, 987.77, 783.99, 880.00]
    for i in range(int((DUR - 2.8) / 0.25)):
        place(m, 2.8 + i * 0.25, pluck(arp[i % len(arp)], 0.4, (1.0, 0.5, 0.28)), 0.24)
    for i, ch in enumerate([(146.83, 220.00), (164.81, 246.94), (130.81, 196.00), (174.61, 261.63)]):
        place(m, 1.0 + i * 3.5, pad(ch, 3.6), 0.22)
    place(m, 12.0, impact(2.2), 0.42)
    place(m, 12.0, bell(1567.98, 2.6), 0.20)
    wet = reverb(m, 0.2)
    write("pace", wet, np.concatenate([[0, 0, 0, 0], wet[:-4]]))


def mobility() -> None:
    """Slower and open — stretching and the diet breakdown."""
    m = np.zeros(N)
    place(m, 0.0, riser(2.6, 150, 1600), 0.2)
    for bar in range(1, 8):
        b = bar * 2.0
        place(m, b, kick(0.44, 112, 44, click=0.25), 0.46)
        place(m, b + 1.0, snare(0.24, 190), 0.3)
        place(m, b + 1.5, rim(0.09), 0.24)
    for i in range(int(3.0 / 0.25), int(DUR / 0.25)):
        place(m, i * 0.25, hat(0.05, 7800, 150), 0.24 if i % 2 else 0.16)
    notes = [659.25, 783.99, 880.00, 783.99, 587.33, 659.25, 523.25, 587.33]
    for i, f in enumerate(notes):
        place(m, 3.0 + i * 1.5, pluck(f, 0.8, (1.0, 0.55, 0.3)), 0.28)
        place(m, 3.75 + i * 1.5, bell(f * 2, 0.9), 0.14)
    for i, ch in enumerate([(196.00, 293.66), (174.61, 261.63), (220.00, 329.63)]):
        place(m, 1.0 + i * 4.5, pad(ch, 4.4), 0.24)
    place(m, 12.0, bell(1174.66, 2.8), 0.22)
    place(m, 12.0, pad((196.00, 293.66, 392.00), 3.8), 0.26)
    wet = reverb(m, 0.26)
    write("mobility", wet, np.concatenate([[0, 0, 0, 0, 0], wet[:-5]]))


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    drive()
    grind()
    pace()
    mobility()
