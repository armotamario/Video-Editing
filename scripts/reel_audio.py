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

# The grid these beds sit on. It matches the balance of the reference he sent:
# a slow ~99bpm walk, the weight all in the 60-250Hz octave, the 500-2000Hz
# mids left mostly empty so a caption reads over it, and the air back on top as
# sixteenth hats. Everything below is written here, not sampled.
BPM = 99.0
BEAT = 60.0 / BPM
BAR = BEAT * 4
SIX = BEAT / 4

rng = np.random.default_rng(11)


def glide(f0, f1, dur, bend=0.22):
    """A sliding 808: the bass note smears from one pitch to the next.

    The reference's low end sits between C2 and C#2 rather than on a single
    partial, which is what a pitched glide looks like on a spectrum.
    """
    n = int(SR * dur)
    k = np.clip(t(n) / max(bend * dur, 1e-6), 0, 1) ** 0.7
    f = f0 * (f1 / f0) ** k
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) + 0.12 * np.sin(2 * ph)
    return np.tanh(body * 1.25) * env(n, 0.004, 0.25, 1, max(dur * 0.55, 0.2), sus=0.72)


def air(m, at, dur, gain=0.05, cut=9000):
    """A breath of filtered noise — the top octave the reference keeps lit."""
    n = int(SR * dur)
    place(m, at, highpass(noise(n), cut) * env(n, 0.35, 0.5, 1, dur * 0.6, sus=0.7), gain)


def hats(m, start, stop, step=SIX, gain=0.20, bright=9600, decay=180, rolls=()):
    """Sixteenth hats with optional double-time rolls on the given step index."""
    i = 0
    at = start
    while at < stop:
        roll = (i % 16) in rolls
        if roll:
            for j in range(2):
                place(m, at + j * step / 2, hat(0.03, bright, decay + 60), gain * 0.7)
        else:
            place(m, at, hat(0.045, bright, decay), gain if i % 2 else gain * 1.35)
        at += step
        i += 1


def tilt(x, low_gain=1.5, low_cut=380.0, high_gain=0.55, high_cut=6500.0, presence=0.9):
    """Weight the bed the way the reference is weighted.

    Synthesised hats and noise put far too much energy above 8kHz and leave the
    bottom thin; a low shelf up and a high shelf down lands the octave balance
    where his reference sits, which is what makes it sound like a track off a
    phone rather than a sound-design exercise.
    """
    shaped = x + low_gain * lowpass(x, low_cut) - high_gain * highpass(x, high_cut)
    # these beds are deliberately mid-scooped, which leaves a hole where the
    # reference still has body; put a little of the 2-4kHz band back
    shaped = shaped + presence * (lowpass(x, 4000.0) - lowpass(x, 1800.0))
    # nothing under ~32Hz survives a phone speaker; it only eats headroom
    return highpass(shaped, 32.0)


def master(mono, target=0.17, peak=0.86, stereo_ms=0.011):
    """Gentle master: sits under burned-in captions without disappearing."""
    wet = reverb(tilt(mono), 0.2)
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
#
# All four sit on the same low-and-airy floor so the set reads as one brand,
# and separate on what is above it: prayer is almost all pad, bible adds a
# figure, mass adds the organ stack, promo is the only one that really drives.

CM = dict(c=65.41, g=48.99, af=51.91, bf=58.27, ef=77.78)  # the low register


def _floor(m, root=("c", "af", "bf", "g"), gain=0.46, drive=1.0, per=2):
    """The shared bottom: one sliding 808 every `per` bars, kick on the one."""
    for bar in range(6):
        b = bar * BAR
        if bar % per == 0:
            a, z = root[(bar // per) % len(root)], root[((bar // per) + 1) % len(root)]
            note = glide(CM[a], CM[z], BAR * per * 0.92)
            place(m, b, np.tanh(note * drive), gain)
        place(m, b, kick(0.40, 118, 44), 0.42 * drive)


def prayer():
    """Almost no percussion — a low pulse, a wash, and one figure on top."""
    m = np.zeros(N)
    for i, ch in enumerate([(130.81, 155.56, 196.00), (116.54, 155.56, 185.00),
                            (123.47, 146.83, 196.00), (130.81, 155.56, 196.00)]):
        place(m, i * 3.3, lowpass(pad(ch, 3.8, detune=0.003), 620), 0.34)
    for bar in range(6):
        place(m, bar * BAR, glide(CM["c"], CM["c"], BAR * 0.9), 0.34)
    hats(m, PROOF, DUR - 0.7, step=SIX * 2, gain=0.09, bright=10400, decay=210)
    keys(m, [523.25, 622.25, 523.25, 466.16], 1.1, 2.6, 1.7, 0.10,
         harm=(1.0, 0.22, 0.06))
    place(m, CTA, bell(784.00, 2.6), 0.10)
    air(m, 0.0, DUR, 0.045)
    return m


def bible():
    """The pulse walks — a two-note bass figure under a still pad."""
    m = np.zeros(N)
    for i, ch in enumerate([(116.54, 155.56, 185.00), (130.81, 155.56, 196.00)]):
        place(m, i * 6.5, lowpass(pad(ch, 6.8, detune=0.003), 560), 0.30)
    _floor(m, root=("c", "af", "bf", "af"), gain=0.42, drive=0.9)
    hats(m, 0.6, DUR - 0.7, gain=0.13, bright=9800, decay=190, rolls=(14, 15))
    keys(m, [622.25, 523.25, 466.16, 523.25, 622.25], 0.9, 2.3, 1.4, 0.11,
         harm=(1.0, 0.24, 0.08))
    place(m, BEN1, bell(932.33, 2.2), 0.08)
    air(m, 0.0, DUR, 0.05)
    return m


def mass():
    """The organ stack over the same floor, with the long tail it needs."""
    m = np.zeros(N)
    for i, ch in enumerate([(98.00, 130.81, 155.56), (103.83, 130.81, 155.56),
                            (87.31, 116.54, 146.83), (98.00, 130.81, 155.56)]):
        at = i * 3.3
        place(m, at, lowpass(pad(ch, 3.8, detune=0.002), 520), 0.30)
        n = int(3.6 * SR)
        organ = sum(np.sin(2 * np.pi * f * mlt * t(n)) / (mlt ** 1.6)
                    for f in ch for mlt in (1, 2, 3, 4)) / (len(ch) * 4)
        place(m, at, lowpass(organ, 1500) * env(n, 0.55, 0.4, 1, 1.1, sus=0.8), 0.24)
    for bar in range(6):
        place(m, bar * BAR, glide(CM["c"], CM["g"], BAR * 0.95), 0.40)
    hats(m, PROOF, DUR - 0.8, step=SIX * 2, gain=0.10, bright=10200, decay=200)
    place(m, 0.0, bell(1046.50, 3.2), 0.08)
    place(m, CTA, bell(783.99, 3.0), 0.10)
    air(m, 0.0, DUR, 0.05)
    return m


def promo():
    """The product bed — this is the one that actually drives."""
    m = np.zeros(N)
    _floor(m, root=("c", "bf", "af", "g"), gain=0.52, drive=1.15, per=1)
    for bar in range(6):
        b = bar * BAR
        place(m, b + BEAT * 2, rim(0.09), 0.30)
        place(m, b + BEAT * 3 + SIX * 2, kick(0.32, 104, 43), 0.26)
    hats(m, 0.3, DUR - 0.5, gain=0.21, bright=10600, decay=175, rolls=(7, 14, 15))
    keys(m, [622.25, 523.25, 622.25, 698.46, 622.25, 523.25],
         0.7, 2.0, 0.7, 0.13, harm=(1.0, 0.26, 0.09))
    place(m, CTA, lowpass(pad((155.56, 196.00, 233.08), 2.6), 900), 0.16)
    air(m, 0.0, DUR, 0.055)
    return m


# --------------------------------------------------------------------- MFBA
#
# Same floor, more drive on it: the kick is saturated, the 808 is pushed, and
# the hats run faster. The pads stay under 700Hz so the orange captions read.


def mobility():
    """The calm one — the floor at half weight, nothing sharp on top."""
    m = np.zeros(N)
    for i, ch in enumerate([(116.54, 155.56, 185.00), (98.00, 146.83, 174.61)]):
        place(m, i * 6.5, lowpass(pad(ch, 6.8), 620), 0.26)
    _floor(m, root=("g", "bf", "af", "c"), gain=0.38, drive=0.85, per=2)
    hats(m, 0.5, DUR - 0.7, gain=0.13, bright=9400, decay=200)
    keys(m, [466.16, 523.25, 466.16, 415.30], 1.2, 3.0, 1.2, 0.10,
         harm=(1.0, 0.24, 0.08))
    air(m, 0.0, DUR, 0.05)
    return m


def lifting():
    """The heavy one — saturated kick, a hard glide, rolling hats."""
    m = np.zeros(N)
    for bar in range(6):
        b = bar * BAR
        place(m, b, np.tanh(kick(0.42, 150, 45, click=0.85) * 2.6), 0.66)
        place(m, b + BEAT * 2, snare(0.24, 205), 0.44)
        place(m, b + BEAT * 3 + SIX, np.tanh(kick(0.30, 132, 44) * 2.1), 0.32)
        a, z = ("c", "g") if bar % 2 == 0 else ("bf", "af")
        place(m, b, np.tanh(glide(CM[a], CM[z], BAR * 0.95) * 1.7), 0.58)
    hats(m, 0.3, DUR - 0.5, step=SIX, gain=0.22, bright=11000, decay=160,
         rolls=(6, 7, 13, 14, 15))
    n = int(2.0 * SR)
    lead = lowpass(saw(155.56, n) + saw(155.56 * 1.006, n), 820) * env(n, 0.02, 0.4, 1, 0.6, 0.5)
    for at in (PROOF, BEN2):
        place(m, at, lead, 0.15)
    place(m, CTA, impact(2.0), 0.40)
    air(m, 0.0, DUR, 0.06)
    return m


def cardio():
    """Same floor at double-time on top — busier, not faster underneath."""
    m = np.zeros(N)
    _floor(m, root=("c", "af", "bf", "g"), gain=0.48, drive=1.1, per=1)
    for bar in range(6):
        b = bar * BAR
        place(m, b + BEAT * 2, snare(0.20, 215), 0.30)
        place(m, b + BEAT, kick(0.30, 112, 44), 0.24)
    hats(m, 0.25, DUR - 0.5, step=SIX / 2, gain=0.15, bright=11200, decay=140,
         rolls=(15,))
    keys(m, [622.25, 698.46, 622.25, 523.25, 622.25, 783.99],
         0.8, 1.9, 0.6, 0.13, harm=(1.0, 0.3, 0.1))
    for i, ch in enumerate([(130.81, 155.56, 196.00), (146.83, 174.61, 220.00)]):
        place(m, i * 6.5, lowpass(pad(ch, 6.6), 680), 0.20)
    air(m, 0.0, DUR, 0.06)
    return m


def diet():
    """Warm and unhurried — rim instead of a snare, the glide rounded off."""
    m = np.zeros(N)
    for bar in range(6):
        b = bar * BAR
        place(m, b, kick(0.38, 108, 43), 0.46)
        place(m, b + BEAT * 2, rim(0.09), 0.26)
        if bar % 2 == 0:
            a, z = ("bf", "c") if bar % 4 == 0 else ("af", "g")
            place(m, b, glide(CM[a], CM[z], BAR * 1.9, bend=0.3), 0.40)
    hats(m, 0.45, DUR - 0.6, gain=0.15, bright=9600, decay=180, rolls=(15,))
    keys(m, [523.25, 622.25, 698.46, 622.25, 523.25, 466.16],
         0.6, 2.1, 0.9, 0.14, harm=(1.0, 0.28, 0.1))
    for i, ch in enumerate([(116.54, 155.56, 185.00), (103.83, 130.81, 155.56)]):
        place(m, i * 6.5, lowpass(pad(ch, 6.6), 640), 0.20)
    air(m, 0.0, DUR, 0.05)
    return m


def lifestyle():
    """Holds back, then lands the floor on the benefits."""
    m = np.zeros(N)
    for i, ch in enumerate([(116.54, 174.61, 233.08), (130.81, 196.00, 261.63),
                            (98.00, 146.83, 196.00), (116.54, 174.61, 233.08)]):
        place(m, i * 3.3, lowpass(pad(ch, 3.6, detune=0.003), 700), 0.28)
    keys(m, [622.25, 698.46, 783.99, 698.46, 622.25, 523.25], 0.9, 1.8, 1.1, 0.12,
         harm=(1.0, 0.26, 0.09))
    for bar in range(2, 6):
        b = bar * BAR
        place(m, b, kick(0.40, 112, 44), 0.44)
        place(m, b + BEAT * 2, snare(0.22, 195), 0.22)
        place(m, b, glide(CM["c"], CM["af"], BAR * 0.95), 0.42)
    hats(m, BEN1 - 1.0, DUR - 0.6, gain=0.15, bright=10200, decay=180, rolls=(15,))
    place(m, BEN1 - 1.4, riser(1.5, 200, 1400), 0.15)
    place(m, BEN1, impact(1.8), 0.26)
    place(m, CTA, bell(932.33, 2.4), 0.09)
    air(m, 0.0, DUR, 0.055)
    return m


def transformation():
    """Empty until the reveal, then the whole floor arrives at once."""
    m = np.zeros(N)
    for i, ch in enumerate([(116.54, 155.56, 185.00), (130.81, 164.81, 196.00),
                            (87.31, 116.54, 146.83), (116.54, 155.56, 185.00)]):
        place(m, i * 3.3, lowpass(pad(ch, 3.6, detune=0.003), 640), 0.30)
    keys(m, [622.25, 523.25, 466.16, 523.25], 0.8, 1.7, 1.4, 0.11,
         harm=(1.0, 0.24, 0.08))
    place(m, BEN2 - 2.0, riser(2.0, 160, 2200), 0.22)
    place(m, BEN2, impact(2.4), 0.46)
    for bar in range(3, 6):
        b = bar * BAR
        place(m, b, np.tanh(kick(0.44, 138, 45) * 2.2), 0.56)
        place(m, b + BEAT * 2, snare(0.26, 200), 0.32)
        place(m, b, np.tanh(glide(CM["c"], CM["g"], BAR * 0.95) * 1.5), 0.50)
    hats(m, BEN2, DUR - 0.5, gain=0.18, bright=10600, decay=165, rolls=(14, 15))
    air(m, BEN2 - 1.0, DUR - BEN2 + 1.0, 0.06)
    return m


BEDS = {
    "gr-prayer": prayer, "gr-bible": bible, "gr-mass": mass, "gr-promo": promo,
    "mfba-mobility": mobility, "mfba-lifting": lifting, "mfba-cardio": cardio,
    "mfba-diet": diet, "mfba-lifestyle": lifestyle, "mfba-transformation": transformation,
}

if __name__ == "__main__":
    for name, fn in BEDS.items():
        write(name, fn())
