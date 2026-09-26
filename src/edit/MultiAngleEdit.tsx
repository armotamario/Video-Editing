import {
  AbsoluteFill,
  Easing,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { bodyFont } from "../fonts";

/**
 * A one-camera talking head cut as if it had been shot on several: dead air
 * removed, and every cut lands on a different virtual framing (wide / medium /
 * close / off-axis close), each settling in with a small punch. Three styles:
 *
 *  multicam — just the reframed jump cuts
 *  broll    — the same, with faith b-roll laid over some of the jump cuts
 *  split    — the same, with some beats shown as a stacked wide/close split
 *
 * Source is the cleaned clip in public/edit (burned-in hook line removed,
 * audio loudness-normalised); the hook line is re-set here as an overlay so it
 * holds still while the "camera" moves.
 */

export type MultiAngleVariant = "multicam" | "broll" | "split";

const FPS = 30;
const SRC = "edit/hot_clean.mp4";
const FRAME_W = 1080;
const FRAME_H = 1920;
const GOLD = "#e8b23c";

/** Speech kept, in source seconds — pauses of ~0.5s+ cut down to a breath. */
const KEEP: [number, number][] = [
  [0.0, 3.27],
  [3.76, 6.02],
  [6.96, 8.22],
  [9.16, 10.63],
  [11.83, 13.33],
  [14.5, 15.11],
  [15.51, 17.47],
  [18.0, 19.11],
  [19.62, 23.49],
  [23.79, 27.75],
  [28.57, 29.82],
  [30.91, 32.49],
  [33.15, 33.72],
  [34.39, 36.2],
];

/** A virtual camera: zoom, and which source point (0-1) sits at frame centre. */
type Cam = { s: number; fx: number; fy: number };

const WIDE: Cam = { s: 1, fx: 0.5, fy: 0.5 };
const MED: Cam = { s: 1.28, fx: 0.51, fy: 0.47 };
const CLOSE: Cam = { s: 1.65, fx: 0.512, fy: 0.455 };
const CLOSE_L: Cam = { s: 1.5, fx: 0.47, fy: 0.46 };
const CLOSE_R: Cam = { s: 1.5, fx: 0.56, fy: 0.46 };

/** Never the same framing twice in a row. */
const PATTERN: Cam[] = [MED, CLOSE, WIDE, CLOSE_R, MED, CLOSE_L, WIDE, CLOSE, MED, CLOSE_R, WIDE, CLOSE_L];

/** Split beats: wide on top (face set low, clear of the title), close below. */
const SPLIT_TOP: Cam = { s: 1, fx: 0.5, fy: 0.37 };
const SPLIT_BOTTOM: Cam = { s: 1.6, fx: 0.512, fy: 0.445 };

/** Long takes get a mid-sentence camera switch, the way a multicam edit would. */
const MAX_SHOT = 72;

type Shot = {
  srcFrom: number;
  len: number;
  outFrom: number;
  /** A real jump in source time on this edge (so duck the audio), not just a camera switch. */
  cutIn: boolean;
  cutOut: boolean;
};

const SHOTS: Shot[] = (() => {
  const shots: Shot[] = [];
  let out = 0;
  for (const [s, e] of KEEP) {
    const a = Math.round(s * FPS);
    const b = Math.round(e * FPS);
    const pieces = Math.max(1, Math.round((b - a) / MAX_SHOT));
    for (let p = 0; p < pieces; p++) {
      const from = a + Math.round(((b - a) * p) / pieces);
      const to = a + Math.round(((b - a) * (p + 1)) / pieces);
      shots.push({ srcFrom: from, len: to - from, outFrom: out, cutIn: p === 0, cutOut: p === pieces - 1 });
      out += to - from;
    }
  }
  return shots;
})();

export const MULTI_ANGLE_DURATION = SHOTS.reduce((n, s) => n + s.len, 0);

/** One camera's view of the clip into a viewport of the given size. */
const Framed: React.FC<{
  cam: Cam;
  shot: Shot;
  vw: number;
  vh: number;
  muted?: boolean;
}> = ({ cam, shot, vw, vh, muted = false }) => {
  const frame = useCurrentFrame();
  const punch = interpolate(frame, [0, 7], [1.06, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const drift = 1 + 0.035 * (frame / Math.max(shot.len, 1));
  const s = cam.s * punch * drift;

  // Scale the full 1080x1920 picture by s, put (fx, fy) at viewport centre,
  // then clamp so the picture always covers the viewport.
  const w = FRAME_W * s;
  const h = FRAME_H * s;
  const tx = Math.min(0, Math.max(vw - w, vw / 2 - cam.fx * w));
  const ty = Math.min(0, Math.max(vh - h, vh / 2 - cam.fy * h));

  const fade = 2;
  const volume = (f: number) =>
    Math.min(
      shot.cutIn ? interpolate(f, [0, fade], [0, 1], { extrapolateRight: "clamp" }) : 1,
      shot.cutOut ? interpolate(f, [shot.len - fade, shot.len], [1, 0], { extrapolateLeft: "clamp" }) : 1,
    );

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          width: FRAME_W,
          height: FRAME_H,
          transformOrigin: "0 0",
          transform: `translate(${tx}px, ${ty}px) scale(${s})`,
        }}
      >
        <OffthreadVideo
          src={staticFile(SRC)}
          trimBefore={shot.srcFrom}
          muted={muted}
          volume={muted ? 0 : volume}
          style={{ width: FRAME_W, height: FRAME_H }}
        />
      </div>
    </div>
  );
};

const SplitShot: React.FC<{ shot: Shot }> = ({ shot }) => (
  <AbsoluteFill>
    <div style={{ position: "absolute", left: 0, top: 0, width: FRAME_W, height: FRAME_H / 2 }}>
      <Framed cam={SPLIT_TOP} shot={shot} vw={FRAME_W} vh={FRAME_H / 2} />
    </div>
    <div style={{ position: "absolute", left: 0, top: FRAME_H / 2, width: FRAME_W, height: FRAME_H / 2 }}>
      <Framed cam={SPLIT_BOTTOM} shot={shot} vw={FRAME_W} vh={FRAME_H / 2} muted />
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: FRAME_H / 2 - 3, height: 6, background: GOLD }} />
  </AbsoluteFill>
);

/** A b-roll still laid over the talk track, pushing in slowly. */
const Cutaway: React.FC<{ src: string; len: number; focus: string }> = ({ src, len, focus }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 4, len - 4, len], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = interpolate(frame, [0, len], [1.04, 1.14]);
  return (
    <AbsoluteFill style={{ opacity, background: "#0b0a09" }}>
      <AbsoluteFill style={{ transform: `scale(${scale})` }}>
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: focus }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "rgba(8,7,6,0.18)" }} />
    </AbsoluteFill>
  );
};

/** Laid over jump cuts so the cut itself is never seen. */
const BROLL = [
  { src: "images/gr/bible-highlighted.jpg", focus: "center 45%" },
  { src: "images/gr/bookmark-seek-god.jpg", focus: "center 35%" },
  { src: "images/gr/church-hall.jpg", focus: "center 40%" },
  { src: "images/gr/altar-portrait.jpg", focus: "center 38%" },
];
const CUTAWAY_LEN = 40;

const cutawayStarts = (): number[] => {
  // real jump cuts only, spread through the piece, first one after the hook lands
  const edges = SHOTS.filter((s, i) => i > 0 && s.cutIn).map((s) => s.outFrom);
  const picks: number[] = [];
  const gap = MULTI_ANGLE_DURATION / (BROLL.length + 1);
  for (let k = 1; k <= BROLL.length; k++) {
    const target = gap * k;
    const best = edges.reduce((a, b) => (Math.abs(b - target) < Math.abs(a - target) ? b : a));
    if (!picks.includes(best)) picks.push(best);
  }
  return picks.map((edge) => edge - 12);
};

const OUTLINE =
  "-3px -3px 0 #0a0908, 3px -3px 0 #0a0908, -3px 3px 0 #0a0908, 3px 3px 0 #0a0908," +
  "-4px 0 0 #0a0908, 4px 0 0 #0a0908, 0 -4px 0 #0a0908, 0 4px 0 #0a0908, 0 8px 24px rgba(0,0,0,0.7)";

/** His hook line, re-set so it stays put while the camera moves. */
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lead = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const pop = spring({ frame: frame - 5, fps, config: { damping: 11, stiffness: 170, mass: 0.7 } });
  const base = { fontFamily: bodyFont, fontWeight: 900, textShadow: OUTLINE, textAlign: "center" as const };
  return (
    <AbsoluteFill className="items-center" style={{ paddingTop: 190 }}>
      <div
        className="uppercase"
        style={{
          ...base,
          fontSize: 50,
          lineHeight: 1.1,
          letterSpacing: "0.01em",
          color: "#ffffff",
          opacity: lead,
          transform: `translateY(${(1 - lead) * -18}px)`,
        }}
      >
        Work smarter, not harder
      </div>
      <div
        className="uppercase"
        style={{
          ...base,
          fontSize: 88,
          lineHeight: 1.02,
          letterSpacing: "-0.01em",
          color: "#ffffff",
          marginTop: 4,
          opacity: Math.min(1, pop * 1.4),
          transform: `scale(${interpolate(pop, [0, 1], [0.7, 1])})`,
        }}
      >
        with <span style={{ color: GOLD }}>temptation</span>
      </div>
    </AbsoluteFill>
  );
};

/** A touch of contrast, a vignette, and moving grain so it doesn't read as a phone clip. */
const Finish: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill
        style={{ background: "radial-gradient(ellipse 85% 70% at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.38) 100%)" }}
      />
      <svg width={FRAME_W} height={FRAME_H} style={{ position: "absolute", inset: 0, opacity: 0.07, mixBlendMode: "overlay" }}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={frame % 12} />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
};

export const MultiAngleEdit: React.FC<{ variant: MultiAngleVariant }> = ({ variant }) => {
  const frame = useCurrentFrame();
  const end = interpolate(frame, [MULTI_ANGLE_DURATION - 8, MULTI_ANGLE_DURATION], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#0b0a09" }}>
      <AbsoluteFill style={{ opacity: end, filter: "contrast(1.07) saturate(1.1) brightness(1.02)" }}>
        {SHOTS.map((shot, i) => (
          <Sequence key={i} from={shot.outFrom} durationInFrames={shot.len}>
            {variant === "split" && i % 3 === 1 ? (
              <SplitShot shot={shot} />
            ) : (
              <Framed cam={PATTERN[i % PATTERN.length]} shot={shot} vw={FRAME_W} vh={FRAME_H} />
            )}
          </Sequence>
        ))}

        {variant === "broll"
          ? cutawayStarts().map((at, k) => (
              <Sequence key={`b${k}`} from={at} durationInFrames={CUTAWAY_LEN}>
                <Cutaway src={BROLL[k].src} focus={BROLL[k].focus} len={CUTAWAY_LEN} />
              </Sequence>
            ))
          : null}
      </AbsoluteFill>

      <Finish />
      <AbsoluteFill style={{ opacity: end }}>
        <Hook />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
