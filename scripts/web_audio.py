#!/usr/bin/env python3
"""Synthesise the soundtrack beds for the web-development film set.

Six 16s tracks at 120 BPM (8 bars), each cut to the same shape the films use:
a riser into the first cut around 2.8s, a groove under the body, and a lift at
12s where the outro card lands.

    python3 scripts/web_audio.py

Output: public/audio/web-<name>.wav
"""

import wave
from pathlib import Path

import numpy as np

SR = 44100
DUR = 16.0
BPM = 120.0
BEAT = 60.0 / BPM
N = int(SR * DUR)
OUT = Path(__file__).resolve().parent.parent / "public" / "audio"

rng = np.random.default_rng(7)


def env(n: int, a: float, d: float, s: float, r: float, sus: float = 0.6) -> np.ndarray:
    """Simple ADSR over n samples, times in seconds."""
    a_n, d_n, r_n = int(a * SR), int(d * SR), int(r * SR)
    s_n = max(0, n - a_n - d_n - r_n)
    return np.concatenate([
        np.linspace(0, 1, a_n, endpoint=False),
        np.linspace(1, sus, d_n, endpoint=False),
        np.full(s_n, sus),
        np.linspace(sus, 0, n - a_n - d_n - s_n),
    ])[:n] * (1.0 if s >= 0 else 1.0)


def place(buf: np.ndarray, at: float, sound: np.ndarray, gain: float = 1.0) -> None:
    i = int(at * SR)
    if i >= len(buf):
        return
    n = min(len(sound), len(buf) - i)
    buf[i:i + n] += sound[:n] * gain


def t(n: int) -> np.ndarray:
    return np.arange(n) / SR


def sine(freq, n, phase=0.0):
    return np.sin(2 * np.pi * freq * t(n) + phase)


def saw(freq, n):
    x = (t(n) * freq) % 1.0
    return 2 * x - 1


def noise(n):
    return rng.standard_normal(n)


def lowpass(x: np.ndarray, cutoff) -> np.ndarray:
    """One-pole lowpass; cutoff may be a scalar or a per-sample sweep."""
    a = np.exp(-2 * np.pi * np.asarray(cutoff, dtype=float) / SR)
    if a.ndim == 0:
        a = np.full(len(x), float(a))
    out = np.empty_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc = a[i] * acc + (1 - a[i]) * x[i]
        out[i] = acc
    return out


def highpass(x: np.ndarray, cutoff: float) -> np.ndarray:
    return x - lowpass(x, cutoff)


def kick(dur=0.42, f0=120.0, f1=44.0, click=0.5):
    n = int(dur * SR)
    sweep = f1 + (f0 - f1) * np.exp(-t(n) * 22)
    phase = 2 * np.pi * np.cumsum(sweep) / SR
    body = np.sin(phase) * np.exp(-t(n) * 6.5)
    tick = noise(n) * np.exp(-t(n) * 320) * click
    return body + tick


def sub808(freq=52.0, dur=0.9):
    n = int(dur * SR)
    return np.sin(2 * np.pi * freq * t(n)) * np.exp(-t(n) * 2.6)


def snare(dur=0.3, tone=190.0):
    n = int(dur * SR)
    body = np.sin(2 * np.pi * tone * t(n)) * np.exp(-t(n) * 26) * 0.5
    hiss = highpass(noise(n), 900) * np.exp(-t(n) * 16)
    return body + hiss


def hat(dur=0.06, bright=7000.0, decay=90.0):
    n = int(dur * SR)
    return highpass(noise(n), bright) * np.exp(-t(n) * decay)


def rim(dur=0.09):
    n = int(dur * SR)
    return (np.sin(2 * np.pi * 1700 * t(n)) + highpass(noise(n), 2500) * 0.6) * np.exp(-t(n) * 60)


def pluck(freq, dur=0.55, harm=(1.0, 0.5, 0.25)):
    n = int(dur * SR)
    v = sum(np.sin(2 * np.pi * freq * m * t(n)) * g for m, g in enumerate(harm, start=1))
    return v * np.exp(-t(n) * 7.5)


def bell(freq, dur=1.6):
    n = int(dur * SR)
    v = (np.sin(2 * np.pi * freq * t(n))
         + 0.4 * np.sin(2 * np.pi * freq * 2.76 * t(n))
         + 0.2 * np.sin(2 * np.pi * freq * 5.4 * t(n)))
    return v * np.exp(-t(n) * 2.4)


def pad(freqs, dur, detune=0.004):
    n = int(dur * SR)
    v = np.zeros(n)
    for f in freqs:
        for d in (-detune, 0.0, detune):
            v += saw(f * (1 + d), n)
    v = lowpass(v / (len(freqs) * 3), 1500)
    return v * env(n, 0.55, 0.3, 1, 1.2, sus=0.85)


def riser(dur=2.8, f0=180.0, f1=2400.0):
    n = int(dur * SR)
    k = np.linspace(0, 1, n) ** 2.2
    sweep = f0 + (f1 - f0) * k
    phase = 2 * np.pi * np.cumsum(sweep) / SR
    tone = np.sin(phase) * 0.35
    air = lowpass(noise(n), 400 + 5000 * k) * 0.5
    return (tone + air) * np.linspace(0.05, 1.0, n) ** 1.6


def impact(dur=1.8):
    n = int(dur * SR)
    boom = np.sin(2 * np.pi * (60 * np.exp(-t(n) * 3) + 32) * t(n)) * np.exp(-t(n) * 3.2)
    crack = lowpass(noise(n), 2600) * np.exp(-t(n) * 9) * 0.5
    return boom + crack


def reverb(x: np.ndarray, mix=0.22, decay=0.4, delays=(0.031, 0.047, 0.071, 0.097)):
    wet = np.zeros_like(x)
    for i, d in enumerate(delays):
        k = int(d * SR)
        tail = np.zeros_like(x)
        tail[k:] = x[:-k]
        wet += tail * (decay ** (i + 1)) * 1.6
    return x * (1 - mix) + lowpass(wet, 5200) * mix


def compress(x: np.ndarray, thresh=0.22, ratio=4.0, attack=0.006, release=0.16) -> np.ndarray:
    """Feed-forward compressor on the summed signal, so the bed sits loud."""
    a_att = np.exp(-1.0 / (attack * SR))
    a_rel = np.exp(-1.0 / (release * SR))
    mag = np.abs(x)
    envv = np.empty_like(mag)
    acc = 0.0
    for i in range(len(mag)):
        coeff = a_att if mag[i] > acc else a_rel
        acc = coeff * acc + (1 - coeff) * mag[i]
        envv[i] = acc
    over = np.maximum(envv, 1e-9) / thresh
    gain = np.where(over > 1.0, over ** (1.0 / ratio - 1.0), 1.0)
    return x * gain


def limiter(x: np.ndarray, ceiling=0.90, lookahead=0.003, release=0.06) -> np.ndarray:
    """Look-ahead brickwall — keeps transients that a tanh curve would round off."""
    la = int(lookahead * SR)
    pad = np.concatenate([x, np.zeros(la)])
    need = np.minimum(1.0, ceiling / np.maximum(np.abs(pad), 1e-9))

    # sliding minimum over the look-ahead window, so a peak only ducks its own
    # neighbourhood rather than everything that came before it
    win = need.copy()
    for k in range(1, la + 1):
        win[:-k] = np.minimum(win[:-k], need[k:])

    a = np.exp(-1.0 / (release * SR))
    g = np.empty_like(win)
    acc = 1.0
    for i in range(len(win)):
        acc = win[i] if win[i] < acc else a * acc + (1 - a) * win[i]
        g[i] = acc
    return (pad * g)[:len(x)]


def phone_master(x: np.ndarray) -> np.ndarray:
    """Rebuild the balance for a phone speaker.

    Nearly all of the energy in these tracks sat under 120 Hz, which a phone
    simply does not reproduce — so the kick and bass are re-voiced as harmonics
    an inch-wide driver can actually move, and the 1-5 kHz band where hearing is
    most sensitive is lifted hard.
    """
    low = lowpass(lowpass(x, 190), 190)
    rest = x - low
    growl = highpass(np.tanh(low * 9.0), 260)
    x = rest + growl * 1.5 + low * 0.09
    presence = highpass(x, 1500)
    upper_mid = lowpass(highpass(x, 700), 4500)
    x = x + 1.7 * presence + 0.95 * upper_mid
    for _ in range(3):
        x = x - lowpass(x, 135)
    return x


def finish(left: np.ndarray, right: np.ndarray, target_rms=0.42, peak=0.90) -> np.ndarray:
    """Phone-voice the mix, compress it flat, then brickwall it to feed level."""
    mid = phone_master((left + right) * 0.5)
    side = (left - right) * 0.5
    mid = compress(mid, thresh=0.10, ratio=8.0, attack=0.003, release=0.09)
    left, right = mid + side * 0.45, mid - side * 0.45

    stereo = np.stack([left, right], axis=1)
    # push into the limiter repeatedly: each pass recovers the level the last
    # one gave away, so the master lands on the target instead of under it
    for _ in range(4):
        stereo *= target_rms / max(np.sqrt(np.mean(stereo ** 2)), 1e-9)
        stereo = np.stack([limiter(stereo[:, 0], peak), limiter(stereo[:, 1], peak)], axis=1)

    fade = int(0.03 * SR)
    stereo[:fade] *= np.linspace(0, 1, fade)[:, None]
    stereo[-fade:] *= np.linspace(1, 0, fade)[:, None]
    return stereo


def write(name: str, left: np.ndarray, right: np.ndarray) -> None:
    stereo = finish(left, right)
    data = (stereo * 32767).astype("<i2")
    path = OUT / f"web-{name}.wav"
    with wave.open(str(path), "wb") as f:
        f.setnchannels(2)
        f.setsampwidth(2)
        f.setframerate(SR)
        f.writeframes(data.tobytes())
    print(f"web-{name}.wav  {DUR:.0f}s")


# ---------------------------------------------------------------- the tracks

def cinematic() -> None:
    """Wide, slow, patient — for the work and the testimonials."""
    m = np.zeros(N)
    chords = [(146.83, 220.00, 293.66), (130.81, 196.00, 261.63),
              (110.00, 164.81, 220.00), (123.47, 185.00, 246.94)]
    for i, ch in enumerate(chords):
        place(m, 0.4 + i * 4.0, pad(ch, 4.4), 0.32)
    place(m, 0.0, riser(2.8, 140, 1600), 0.30)
    place(m, 2.8, impact(2.4), 0.55)
    for bar in range(1, 8):
        place(m, bar * 2.0, kick(0.5, 110, 42), 0.55)
        place(m, bar * 2.0 + 1.0, kick(0.42, 100, 40), 0.32)
    for i in range(6, 32):
        place(m, 3.0 + i * 0.25, hat(0.05, 8000, 120), 0.20 if i % 2 else 0.30)
    for i, f in enumerate((587.33, 440.00, 493.88, 659.25)):
        place(m, 3.0 + i * 2.0, bell(f, 2.2), 0.20)
        place(m, 3.0 + i * 2.0, bell(f * 2, 1.6), 0.30)
        place(m, 4.0 + i * 2.0, pluck(f * 3, 0.5, (1.0, 0.5, 0.3)), 0.24)
    place(m, 12.0, impact(2.6), 0.5)
    place(m, 12.0, pad((146.83, 220.00, 293.66, 440.0), 4.0), 0.34)
    place(m, 12.0, bell(880.0, 3.0), 0.14)
    wet = reverb(m, 0.3)
    write("cinematic", wet, np.concatenate([[0, 0], wet[:-2]]))


def trap() -> None:
    """808s and rolls — for the wipes and rapid transformations."""
    m = np.zeros(N)
    place(m, 0.0, riser(2.8, 200, 3000), 0.26)
    place(m, 2.8, impact(1.6), 0.5)
    pattern = [0.0, 0.75, 1.5, 2.5, 3.0]
    for bar in range(8):
        base = bar * 2.0
        for p in pattern:
            if base + p < DUR:
                place(m, base + p, kick(0.4, 130, 46), 0.6)
        if bar >= 1:
            place(m, base, sub808(51.91 if bar % 2 else 43.65, 1.5), 0.5)
            place(m, base + 1.0, snare(0.28), 0.42)
    step = 0.25
    for i in range(int(3.0 / step), int(DUR / step)):
        at = i * step
        roll = (i % 16) in (13, 14, 15)
        place(m, at, hat(0.05, 7600, 130), 0.34 if not roll else 0.28)
        if roll:
            place(m, at + 0.125, hat(0.04, 8200, 150), 0.24)
    for i, f in enumerate((329.63, 392.00, 349.23, 293.66) * 2):
        place(m, 3.0 + i * 1.5, pluck(f * 2, 0.6, (1.0, 0.55, 0.28)), 0.26)
        place(m, 3.75 + i * 1.5, pluck(f, 0.4, (1.0, 0.6, 0.3)), 0.20)
    for i in range(int(3.0 / 1.0), int(DUR / 1.0)):
        place(m, i * 1.0, bell(1318.51 if i % 4 else 1567.98, 0.6), 0.05)
    place(m, 12.0, impact(2.4), 0.55)
    wet = reverb(m, 0.16)
    write("trap", wet, np.concatenate([[0, 0, 0], wet[:-3]]))


def lofi() -> None:
    """Warm and unhurried — for the phone and the tips."""
    m = np.zeros(N)
    hisses = lowpass(noise(N), 5000) * 0.012
    m += hisses
    chords = [(174.61, 220.00, 261.63, 329.63), (146.83, 196.00, 246.94, 293.66),
              (164.81, 207.65, 246.94, 311.13), (130.81, 196.00, 233.08, 293.66)]
    for i, ch in enumerate(chords):
        place(m, 0.2 + i * 4.0, pad(ch, 4.2), 0.26)
    place(m, 0.0, riser(2.6, 120, 900), 0.16)
    for bar in range(1, 8):
        b = bar * 2.0
        place(m, b, kick(0.44, 100, 40, click=0.25), 0.5)
        place(m, b + 1.0, snare(0.26, 170), 0.3)
        place(m, b + 1.66, kick(0.4, 96, 38, click=0.2), 0.28)
    for i in range(12, 64):
        at = i * 0.25
        if at >= DUR:
            break
        place(m, at, hat(0.05, 6200, 150), 0.18 if i % 2 else 0.26)
    for i, f in enumerate((523.25, 466.16, 392.00, 440.00, 349.23, 392.00)):
        place(m, 3.5 + i * 1.75, pluck(f * 2, 0.8, (1.0, 0.5, 0.28)), 0.26)
        place(m, 4.4 + i * 1.75, bell(f * 3, 1.1), 0.14)
    place(m, 12.0, pad((174.61, 261.63, 329.63, 440.0), 4.0), 0.3)
    place(m, 12.0, bell(659.25, 2.4), 0.10)
    wet = reverb(m, 0.24)
    write("lofi", wet, np.concatenate([[0, 0, 0, 0], wet[:-4]]))


def uplift() -> None:
    """Bright four-on-the-floor pluck — for mockups and tips."""
    m = np.zeros(N)
    place(m, 0.0, riser(2.8, 220, 3200), 0.24)
    arp = [440.00, 554.37, 659.25, 880.00, 659.25, 554.37]
    for i in range(int((DUR - 2.6) / 0.25)):
        at = 2.6 + i * 0.25
        place(m, at, pluck(arp[i % len(arp)], 0.45, (1.0, 0.55, 0.3)), 0.26)
    for bar in range(1, 8):
        b = bar * 2.0
        for beat in range(4):
            place(m, b + beat * 0.5, kick(0.36, 120, 45), 0.5)
            place(m, b + beat * 0.5 + 0.25, hat(0.05, 9000, 160), 0.26)
        place(m, b + 1.0, snare(0.24, 210), 0.26)
    for i, ch in enumerate([(110.0, 164.81), (123.47, 185.00), (146.83, 220.00), (98.00, 146.83)]):
        place(m, 2.0 + i * 3.5, pad(ch, 3.6), 0.24)
    place(m, 12.0, impact(2.2), 0.42)
    place(m, 12.0, bell(1108.73, 2.6), 0.12)
    wet = reverb(m, 0.2)
    write("uplift", wet, np.concatenate([[0, 0], wet[:-2]]))


def tense() -> None:
    """Pulsing drone and a hard pulse — for mistakes and the search scene."""
    m = np.zeros(N)
    drone = (saw(55.0, N) + saw(55.0 * 1.005, N) + saw(82.41, N) * 0.5) / 3
    drone = lowpass(drone, 420) * (0.22 + 0.06 * np.sin(2 * np.pi * 0.5 * t(N)))
    m += drone
    place(m, 0.0, riser(2.8, 90, 1800), 0.26)
    place(m, 2.8, impact(2.0), 0.6)
    for bar in range(1, 8):
        b = bar * 2.0
        place(m, b, kick(0.48, 128, 40), 0.55)
        place(m, b + 1.5, kick(0.4, 110, 38), 0.3)
        place(m, b + 1.0, rim(0.1), 0.3)
    for i in range(int(3.0 / 0.25), int(DUR / 0.25)):
        place(m, i * 0.25, hat(0.04, 8600, 200), 0.16 if i % 2 else 0.26)
    for i in range(4):
        place(m, 3.0 + i * 2.0, bell(880.0 if i % 2 else 987.77, 1.8), 0.26)
        place(m, 4.0 + i * 2.0, pluck(1318.51, 0.35, (1.0, 0.5, 0.3)), 0.20)
    place(m, 12.0, impact(2.6), 0.6)
    place(m, 12.0, pad((110.0, 164.81, 220.0), 3.8), 0.26)
    wet = reverb(m, 0.26)
    write("tense", wet, np.concatenate([[0, 0, 0], wet[:-3]]))


def minimal() -> None:
    """Sparse and clean — lets the homepage annotations breathe."""
    m = np.zeros(N)
    place(m, 0.0, riser(2.6, 150, 1200), 0.2)
    place(m, 2.6, impact(1.8), 0.4)
    for bar in range(1, 8):
        b = bar * 2.0
        place(m, b, kick(0.46, 105, 40, click=0.3), 0.45)
        place(m, b + 1.25, rim(0.1), 0.26)
    for i in range(int(3.0 / 0.25), int(DUR / 0.25)):
        place(m, i * 0.25, hat(0.045, 7400, 140), 0.14 if i % 2 else 0.22)
    notes = [329.63, 392.00, 493.88, 392.00, 329.63, 293.66, 329.63, 440.00]
    for i, f in enumerate(notes):
        place(m, 3.0 + i * 1.25, pluck(f * 2, 0.7, (1.0, 0.5, 0.25)), 0.30)
        place(m, 3.6 + i * 1.25, bell(f * 4, 0.9), 0.14)
    for i, ch in enumerate([(82.41, 123.47), (98.00, 146.83), (110.0, 164.81)]):
        place(m, 2.0 + i * 4.0, pad(ch, 4.2), 0.2)
    place(m, 12.0, bell(987.77, 2.8), 0.13)
    place(m, 12.0, pad((110.0, 164.81, 220.0), 3.8), 0.24)
    wet = reverb(m, 0.28)
    write("minimal", wet, np.concatenate([[0, 0, 0, 0, 0], wet[:-5]]))


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    cinematic()
    trap()
    lofi()
    uplift()
    tense()
    minimal()
