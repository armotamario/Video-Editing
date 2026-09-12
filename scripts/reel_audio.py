#!/usr/bin/env python3
"""Original 13s beds for the reel sets, one per content category.

These are synthesised here rather than lifted from anything — real trending
audio belongs to whoever made it, and gets a post muted. Each bed is written
to the shape the reels cut to: hook, a quieter proof section, a lift under the
benefits, and the peak on the call to action.

    python3 scripts/reel_audio.py

Output: public/audio/reel-<name>.wav
"""

import sys
import wave
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent))

from web_audio import (  # noqa: E402
    SR, bell, compress, env, hat, highpass, impact, kick, limiter, lowpass,
    noise, pad, place, pluck, reverb, rim, riser, saw, sine, snare, sub808, t,
)

DUR = 13.0
N = int(SR * DUR)
OUT = Path(__file__).resolve().parent.parent / "public" / "audio"

# where the reel cuts land
HOOK, PROOF, BEN1, BEN2, CTA = 0.0, 2.6, 6.0, 8.2, 10.4

rng = np.random.default_rng(11)


def master(mono, target=0.17, peak=0.86, stereo_ms=0.011):
    """Gentle master: sits under burned-in captions without disappearing."""
    wet = reverb(mono, 0.2)
    d = int(SR * stereo_ms)
    right = np.concatenate([np.zeros(d), wet[:-d]])
    left = wet
    out = np.stack([left, right], axis=1)
    out = np.stack([compress(out[:, 0], thresh=0.16, ratio=3.2),
                    compress(out[:, 1], thresh=0.16, ratio=3.2)], axis=1)
    for _ in range(3):
        out *= target / max(np.sqrt(np.mean(out ** 2)), 1e-9)
        out = np.stack([limiter(out[:, 0], peak), limiter(out[:, 1], peak)], axis=1)
    # ease the last half second out so nothing clips the end of the cut
    f = int(0.5 * SR)
    ramp = np.linspace(1, 0, f) ** 1.4
    out[-f:] *= ramp[:, None]
    out[: int(0.12 * SR)] *= np.linspace(0, 1, int(0.12 * SR))[:, None]
    return out


def write(name, mono, **kw):
    OUT.mkdir(parents=True, exist_ok=True)
    st = master(mono, **kw)
    data = (np.clip(st, -1, 1) * 32767).astype("<i2")
    path = OUT / f"reel-{name}.wav"
    with wave.open(str(path), "wb") as f:
        f.setnchannels(2)
        f.setsampwidth(2)
        f.setframerate(SR)
        f.writeframes(data.tobytes())
    rms = 20 * np.log10(max(np.sqrt(np.mean(st ** 2)), 1e-9))
    print(f"  reel-{name}.wav  {DUR:.0f}s  {rms:5.1f} dBFS")


def keys(m, notes, at, step, dur=1.2, gain=0.22, harm=(1.0, 0.45, 0.2)):
    for i, f in enumerate(notes):
        place(m, at + i * step, pluck(f, dur, harm), gain)


# ------------------------------------------------------------------ Godly Raiment

def prayer():
    """Soft piano over an ambient wash, no drums."""
    m = np.zeros(N)
    chords = [(220.00, 261.63, 329.63), (174.61, 220.00, 261.63),
              (196.00, 246.94, 293.66), (220.00, 261.63, 329.63)]
    for i, ch in enumerate(chords):
        place(m, i * 3.3, pad(ch, 3.7), 0.30)
        place(m, i * 3.3, pad(tuple(f * 2 for f in ch), 3.4), 0.10)
    keys(m, [659.25, 523.25, 587.33, 440.00, 523.25, 659.25], 1.0, 1.9, 1.6, 0.16)
    place(m, CTA, bell(880.00, 2.6), 0.14)
    return m


def bible():
    """Reflective piano with light strings under it."""
    m = np.zeros(N)
    for i, ch in enumerate([(146.83, 220.00, 293.66), (130.81, 196.00, 261.63),
                            (164.81, 246.94, 329.63), (146.83, 220.00, 293.66)]):
        place(m, i * 3.3, pad(ch, 3.6), 0.26)
    keys(m, [587.33, 493.88, 440.00, 493.88, 587.33, 659.25, 587.33], 0.8, 1.6, 1.3, 0.18)
    for i in range(5):
        place(m, PROOF + i * 1.4, sub808(73.42, 1.1), 0.16)
    place(m, BEN1, pad((293.66, 440.00, 587.33), 4.2), 0.14)
    return m


def mass():
    """Organ and a choir-like stack, generous tail."""
    m = np.zeros(N)
    for i, ch in enumerate([(130.81, 196.00, 261.63), (146.83, 220.00, 293.66),
                            (110.00, 164.81, 220.00), (130.81, 196.00, 261.63)]):
        at = i * 3.3
        place(m, at, pad(ch, 3.8, detune=0.002), 0.30)
        # organ: stacked fifths and octaves
        n = int(3.6 * SR)
        organ = sum(np.sin(2 * np.pi * f * mlt * t(n)) / mlt
                    for f in ch for mlt in (1, 2, 3)) / (len(ch) * 3)
        place(m, at, organ * env(n, 0.5, 0.4, 1, 1.0, sus=0.8), 0.20)
    place(m, 0.0, bell(523.25, 3.2), 0.12)
    place(m, CTA, bell(392.00, 3.0), 0.14)
    return m


def promo():
    """Clean luxury beat — soft kit, muted chords, round sub."""
    m = np.zeros(N)
    for bar in range(7):
        b = bar * 1.85
        place(m, b, kick(0.4, 110, 45), 0.55)
        place(m, b + 0.93, rim(0.1), 0.30)
        place(m, b + 1.39, kick(0.34, 100, 44), 0.30)
        if bar >= 1:
            place(m, b, sub808(55.00, 1.5), 0.38)
    for i in range(int(DUR / 0.2313)):
        at = 0.4 + i * 0.2313
        if at > DUR - 0.6:
            break
        place(m, at, hat(0.05, 8200, 120), 0.16 if i % 2 else 0.24)
    keys(m, [440.00, 523.25, 659.25, 523.25, 440.00, 392.00, 440.00],
         0.5, 1.85, 0.8, 0.17, harm=(1.0, 0.3, 0.12))
    place(m, CTA, pad((220.00, 277.18, 329.63), 2.6), 0.16)
    return m


# --------------------------------------------------------------------- MFBA

def mobility():
    """Calm motivational — light phonk pulse, airy top."""
    m = np.zeros(N)
    for bar in range(7):
        b = bar * 1.85
        place(m, b, kick(0.44, 95, 42), 0.44)
        place(m, b + 0.93, snare(0.24, 180), 0.20)
        if bar >= 1:
            place(m, b, sub808(49.00, 1.4), 0.30)
    for i in range(int(DUR / 0.2313)):
        at = 0.5 + i * 0.2313
        if at > DUR - 0.6:
            break
        place(m, at, hat(0.045, 7600, 140), 0.14 if i % 2 else 0.20)
    for i, ch in enumerate([(196.00, 246.94, 293.66), (174.61, 220.00, 261.63)]):
        place(m, i * 6.5, pad(ch, 6.8), 0.22)
    keys(m, [493.88, 587.33, 493.88, 440.00], 1.2, 3.0, 1.0, 0.13)
    return m


def lifting():
    """Hard phonk — distorted kick, heavy 808, fast hats."""
    m = np.zeros(N)
    for bar in range(7):
        b = bar * 1.85
        k = kick(0.42, 145, 46, click=0.8)
        place(m, b, np.tanh(k * 2.4), 0.62)
        place(m, b + 0.93, snare(0.26, 210), 0.44)
        place(m, b + 1.39, np.tanh(kick(0.3, 130, 44) * 2.0), 0.34)
        root = 41.20 if bar % 2 == 0 else 49.00
        place(m, b, np.tanh(sub808(root, 1.7) * 1.6), 0.52)
    step = 0.1157
    for i in range(int(DUR / step)):
        at = 0.3 + i * step
        if at > DUR - 0.5:
            break
        roll = (i % 16) in (13, 14, 15)
        place(m, at, hat(0.04, 8600, 170), 0.22 if not roll else 0.16)
    n = int(2.2 * SR)
    lead = lowpass(saw(164.81, n) + saw(164.81 * 1.005, n), 900) * env(n, 0.02, 0.4, 1, 0.6, 0.5)
    for at in (PROOF, BEN2):
        place(m, at, lead, 0.16)
    place(m, CTA, impact(2.0), 0.42)
    return m


def cardio():
    """Upbeat house — four on the floor, offbeat bass, bright top."""
    m = np.zeros(N)
    beat = 0.4615  # 130 bpm
    for i in range(int(DUR / beat)):
        at = i * beat
        if at > DUR - 0.5:
            break
        place(m, at, kick(0.34, 120, 48), 0.56)
        place(m, at + beat / 2, hat(0.05, 9000, 150), 0.22)
        if i % 4 == 2:
            place(m, at, snare(0.2, 200), 0.26)
        place(m, at + beat / 2, sub808(65.41 if (i // 4) % 2 == 0 else 73.42, 0.4), 0.34)
    keys(m, [659.25, 784.00, 659.25, 587.33, 523.25, 587.33, 659.25, 784.00],
         1.0, 1.4, 0.5, 0.16, harm=(1.0, 0.35, 0.15))
    for i, ch in enumerate([(261.63, 329.63, 392.00), (293.66, 349.23, 440.00)]):
        place(m, i * 6.5, pad(ch, 6.6), 0.18)
    return m


def diet():
    """Clean lifestyle — light hip-hop, warm keys."""
    m = np.zeros(N)
    for bar in range(7):
        b = bar * 1.85
        place(m, b, kick(0.38, 105, 44), 0.48)
        place(m, b + 0.93, rim(0.09), 0.26)
        if bar >= 1:
            place(m, b, sub808(58.27, 1.3), 0.30)
    for i in range(int(DUR / 0.2313)):
        at = 0.45 + i * 0.2313
        if at > DUR - 0.6:
            break
        place(m, at, hat(0.05, 7800, 130), 0.15 if i % 2 else 0.21)
    keys(m, [523.25, 587.33, 698.46, 587.33, 523.25, 466.16],
         0.6, 2.1, 0.9, 0.18, harm=(1.0, 0.32, 0.14))
    for i, ch in enumerate([(233.08, 293.66, 349.23), (207.65, 261.63, 311.13)]):
        place(m, i * 6.5, pad(ch, 6.6), 0.18)
    return m


def lifestyle():
    """Motivational cinematic — builds, stays smooth."""
    m = np.zeros(N)
    for i, ch in enumerate([(174.61, 261.63, 349.23), (196.00, 293.66, 392.00),
                            (146.83, 220.00, 293.66), (174.61, 261.63, 349.23)]):
        place(m, i * 3.3, pad(ch, 3.6), 0.26)
    keys(m, [523.25, 587.33, 698.46, 587.33, 523.25, 440.00, 523.25], 0.9, 1.7, 1.1, 0.16)
    for bar in range(3, 7):
        b = bar * 1.85
        place(m, b, kick(0.4, 100, 44), 0.40)
        place(m, b + 0.93, snare(0.22, 190), 0.20)
    place(m, BEN1 - 1.4, riser(1.5, 200, 1400), 0.16)
    place(m, BEN1, impact(1.8), 0.28)
    place(m, CTA, bell(784.00, 2.4), 0.12)
    return m


def transformation():
    """Emotional build with a real drop where the reveal lands."""
    m = np.zeros(N)
    for i, ch in enumerate([(146.83, 220.00, 293.66), (164.81, 246.94, 329.63),
                            (110.00, 164.81, 220.00), (146.83, 220.00, 293.66)]):
        place(m, i * 3.3, pad(ch, 3.6), 0.28)
    keys(m, [587.33, 493.88, 440.00, 493.88], 0.8, 1.6, 1.3, 0.15)
    place(m, BEN2 - 2.0, riser(2.0, 160, 2200), 0.24)
    place(m, BEN2, impact(2.4), 0.48)
    for bar in range(4, 7):
        b = bar * 1.85
        place(m, b, kick(0.44, 130, 46), 0.54)
        place(m, b + 0.93, snare(0.28, 200), 0.34)
        place(m, b, sub808(49.00, 1.6), 0.42)
    step = 0.2313
    for i in range(int((DUR - BEN2) / step)):
        at = BEN2 + i * step
        if at > DUR - 0.5:
            break
        place(m, at, hat(0.05, 8400, 150), 0.18)
    return m


BEDS = {
    "gr-prayer": prayer, "gr-bible": bible, "gr-mass": mass, "gr-promo": promo,
    "mfba-mobility": mobility, "mfba-lifting": lifting, "mfba-cardio": cardio,
    "mfba-diet": diet, "mfba-lifestyle": lifestyle, "mfba-transformation": transformation,
}

if __name__ == "__main__":
    for name, fn in BEDS.items():
        write(name, fn())
