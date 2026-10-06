import { AbsoluteFill, Easing, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { bodyFont, monoFont } from "../fonts";
import { ArrowMark } from "./ArrowMark";
import { DAILY_TARGETS } from "./plan";
import { ACCENT, PAGE_BG } from "./theme";

/**
 * "Simple, sustainable fat loss" — Mario's framework and daily targets.
 *
 * Editorial look: graphite page, only his strongest photos, each set as an
 * inset framed card in one warm black-and-white grade (phone snaps fall apart
 * full-bleed), clean type for everything else. Soft zoom-blur dissolves on a
 * 15-frame grid so a 120bpm sound added in the app lands on the cuts. Silent.
 */

const BEAT = 15;
const XFADE = 9;
const HANDLE = "@movinforwardbyarm";
const { diet, lifting, cardio } = DAILY_TARGETS;

type Stat = { value: string; label: string };
type Framed = {
  kind: "framed";
  src: string;
  focus: string;
  kicker?: string;
  lines?: string[];
  stats?: Stat[];
  hot?: string;
  beats: number;
};
type Card = { kind: "card"; kicker?: string; lines: string[]; hot?: string; size?: number; beats: number };
type List = { kind: "list"; kicker: string; items: string[]; beats: number };
type Shot = Framed | Card | List | { kind: "formula"; beats: number } | { kind: "outro"; beats: number };

const SHOTS: Shot[] = [
  { kind: "framed", src: "mfba/coach.jpg", focus: "center 35%", kicker: "Weight-loss coaching", lines: ["Simple,", "sustainable", "fat loss."], hot: "sustainable", beats: 6 },
  { kind: "card", kicker: "The goal", lines: ["Lose fat.", "Get fitter.", "Build a life you", "can actually keep."], hot: "keep.", size: 88, beats: 6 },
  { kind: "card", kicker: "What I do every day", lines: ["Daily", "targets."], hot: "targets.", size: 150, beats: 4 },

  {
    kind: "framed",
    src: "mfba/bowl.jpg",
    focus: "center 62%",
    kicker: "01 — Diet",
    stats: [
      { value: "Deficit", label: "calories, every day" },
      { value: diet.protein, label: "protein a day" },
      { value: diet.carbs, label: "carbs a day" },
    ],
    beats: 8,
  },
  {
    kind: "framed",
    src: "mfba/lunge-a.jpg",
    focus: "center 22%",
    kicker: "02 — Heavy lifting",
    stats: [
      { value: "Heavy", label: "once a day" },
      { value: lifting.frequency.replace(" per week", ""), label: "a week" },
    ],
    beats: 7,
  },
  {
    kind: "framed",
    src: "mfba/cardio-walk.jpg",
    focus: "center 50%",
    kicker: "03 — Cardio",
    stats: [{ value: cardio.walk.replace("-minute walk", " min"), label: "walk, every day" }],
    beats: 6,
  },

  { kind: "list", kicker: "Keep the diet simple", items: ["Whole foods", "Controlled portions", "Protein first", "2–3L of water a day"], beats: 7 },
  { kind: "card", lines: ["You don't need", "a perfect diet.", "You need one", "you can keep."], hot: "keep.", beats: 6 },

  { kind: "framed", src: "mfba/gym-selfie.jpg", focus: "center 55%", kicker: "04 — Recovery", lines: ["Sleep. Stress.", "Water. Protein."], beats: 5 },
  { kind: "card", lines: ["More isn't", "always better.", "Consistency", "beats burnout."], hot: "Consistency", beats: 6 },

  { kind: "framed", src: "gr/church-hall.jpg", focus: "center 45%", kicker: "05 — Lifestyle", lines: ["Make fat loss", "fit your life."], hot: "your", beats: 5 },
  { kind: "card", lines: ["Don't isolate", "yourself.", "Actually enjoy", "your life."], hot: "enjoy", beats: 5 },

  { kind: "framed", src: "gr/bible-highlighted.jpg", focus: "center 45%", kicker: "06 — Faith & mindset", lines: ["15–20 minutes", "of quiet prayer."], hot: "prayer.", beats: 5 },
  { kind: "framed", src: "gr/altar-portrait.jpg", focus: "center 50%", kicker: "06 — Faith & mindset", lines: ["Work on your body.", "Look after your", "mind and spirit too."], hot: "spirit", beats: 6 },

  { kind: "formula", beats: 12 },
  { kind: "outro", beats: 8 },
];

const TIMELINE = (() => {
  let at = 0;
  return SHOTS.map((shot, i) => {
    const len = shot.beats * BEAT;
    const first = i === 0;
    const from = first ? 0 : at - XFADE;
    at += len;
    return { shot, from, len: len + (first ? 0 : XFADE), first, last: i === SHOTS.length - 1 };
  });
})();

export const FAT_LOSS_DURATION = SHOTS.reduce((n, s) => n + s.beats * BEAT, 0);

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = { ...clamp, easing: Easing.out(Easing.cubic) } as const;

/** Soft zoom-blur dissolve in. */
const useEnter = (on: boolean) => {
  const frame = useCurrentFrame();
  if (!on) return { opacity: 1, blur: 0, scale: 1 };
  const t = interpolate(frame, [0, XFADE], [0, 1], easeOut);
  return { opacity: t, blur: (1 - t) * 12, scale: 1 + (1 - t) * 0.04 };
};

/** Text clears just before the next shot dissolves in, so two never overlap. */
const useTextOut = (len: number, last: boolean) => {
  const frame = useCurrentFrame();
  return last ? 1 : interpolate(frame, [len - XFADE - 4, len - XFADE + 1], [1, 0], clamp);
};

const rise = (frame: number, at: number, len = 12) => interpolate(frame, [at, at + len], [0, 1], easeOut);

const Words: React.FC<{ line: string; hot?: string }> = ({ line, hot }) => (
  <>
    {line.split(" ").map((w, k) => (
      <span key={k} style={{ color: hot && w === hot ? ACCENT : undefined }}>
        {k > 0 ? " " : ""}
        {w}
      </span>
    ))}
  </>
);

const Lines: React.FC<{ lines: string[]; hot?: string; size: number; delay: number; weight?: number }> = ({
  lines,
  hot,
  size,
  delay,
  weight = 800,
}) => {
  const frame = useCurrentFrame();
  return (
    <>
      {lines.map((line, i) => {
        const t = rise(frame, delay + i * 4);
        return (
          <div
            key={i}
            style={{
              fontFamily: bodyFont,
              fontWeight: weight,
              fontSize: size,
              lineHeight: 1.06,
              letterSpacing: "-0.025em",
              color: "#fff",
              opacity: t,
              filter: `blur(${(1 - t) * 5}px)`,
              transform: `translateY(${(1 - t) * 14}px)`,
            }}
          >
            <Words line={line} hot={hot} />
          </div>
        );
      })}
    </>
  );
};

const Kicker: React.FC<{ text: string; delay: number }> = ({ text, delay }) => {
  const frame = useCurrentFrame();
  const t = rise(frame, delay, 10);
  return (
    <div className="flex items-center" style={{ gap: 16, opacity: t }}>
      <div style={{ width: 40 * t, height: 3, background: ACCENT }} />
      <div
        style={{
          fontFamily: monoFont,
          fontWeight: 700,
          fontSize: 28,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.86)",
        }}
      >
        {text}
      </div>
    </div>
  );
};

const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 0.055, mixBlendMode: "overlay" }}>
      <filter id="fl-grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={frame % 10} />
      </filter>
      <rect width="100%" height="100%" filter="url(#fl-grain)" />
    </svg>
  );
};

/** One of his photos as an inset print: warm monochrome, slow push inside the frame. */
const Print: React.FC<{ src: string; focus: string; height: number; len: number; delay: number }> = ({
  src,
  focus,
  height,
  len,
  delay,
}) => {
  const frame = useCurrentFrame();
  const t = rise(frame, delay - 6, 16);
  const push = 1.03 + 0.06 * (frame / len);
  return (
    <div
      style={{
        width: 920,
        height,
        borderRadius: 30,
        overflow: "hidden",
        position: "relative",
        boxShadow: "0 40px 90px rgba(0,0,0,0.55)",
        outline: "1px solid rgba(255,255,255,0.07)",
        opacity: t,
        transform: `translateY(${(1 - t) * 24}px)`,
      }}
    >
      <Img
        src={staticFile(`images/${src}`)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: focus,
          transform: `scale(${push})`,
          filter: "grayscale(1) sepia(0.14) contrast(1.12) brightness(0.95)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 85% 75% at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.32) 100%)",
        }}
      />
    </div>
  );
};

const StatRow: React.FC<{ stat: Stat; at: number }> = ({ stat, at }) => {
  const frame = useCurrentFrame();
  const t = rise(frame, at, 12);
  return (
    <div
      className="flex items-baseline"
      style={{
        gap: 26,
        opacity: t,
        transform: `translateX(${(1 - t) * 24}px)`,
        borderTop: "1px solid rgba(255,255,255,0.1)",
        padding: "22px 0 8px",
      }}
    >
      <div style={{ fontFamily: bodyFont, fontWeight: 900, fontSize: 92, letterSpacing: "-0.035em", color: ACCENT }}>
        {stat.value}
      </div>
      <div style={{ fontFamily: monoFont, fontSize: 32, letterSpacing: "0.06em", color: "rgba(255,255,255,0.82)" }}>
        {stat.label}
      </div>
    </div>
  );
};

const FramedShot: React.FC<{ shot: Framed; len: number; first: boolean; last: boolean }> = ({ shot, len, first, last }) => {
  const enter = useEnter(!first);
  const textOut = useTextOut(len, last);
  const delay = first ? 6 : XFADE;
  const stats = shot.stats ?? [];
  const printH = stats.length >= 3 ? 640 : stats.length ? 760 : 960;
  return (
    <AbsoluteFill style={{ opacity: enter.opacity, background: PAGE_BG, filter: `blur(${enter.blur}px)` }}>
      <AbsoluteFill className="items-center" style={{ paddingTop: 210, transform: `scale(${enter.scale})` }}>
        <div style={{ width: 920, marginBottom: 34, opacity: textOut }}>
          {shot.kicker ? <Kicker text={shot.kicker} delay={delay} /> : null}
        </div>
        <Print src={shot.src} focus={shot.focus} height={printH} len={len} delay={delay} />
        <div style={{ width: 920, marginTop: 44, opacity: textOut }}>
          {shot.lines ? <Lines lines={shot.lines} hot={shot.hot} size={78} delay={delay + 6} /> : null}
          {stats.map((s, i) => (
            <StatRow key={s.label} stat={s} at={delay + 8 + i * 10} />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const CardShot: React.FC<{ shot: Card; len: number; last: boolean }> = ({ shot, len, last }) => {
  const enter = useEnter(true);
  const textOut = useTextOut(len, last);
  return (
    <AbsoluteFill style={{ opacity: enter.opacity, background: PAGE_BG, filter: `blur(${enter.blur}px)` }}>
      <AbsoluteFill className="justify-center" style={{ padding: "0 96px 140px", opacity: textOut }}>
        <div style={{ marginBottom: 40 }}>
          {shot.kicker ? <Kicker text={shot.kicker} delay={XFADE} /> : <ArrowMark size={64} />}
        </div>
        <Lines lines={shot.lines} hot={shot.hot} size={shot.size ?? 98} delay={XFADE + 3} weight={900} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const ListShot: React.FC<{ shot: List; len: number }> = ({ shot, len }) => {
  const frame = useCurrentFrame();
  const enter = useEnter(true);
  const textOut = useTextOut(len, false);
  return (
    <AbsoluteFill style={{ opacity: enter.opacity, background: PAGE_BG, filter: `blur(${enter.blur}px)` }}>
      <AbsoluteFill className="justify-center" style={{ padding: "0 96px 140px", opacity: textOut }}>
        <div style={{ marginBottom: 30 }}>
          <Kicker text={shot.kicker} delay={XFADE} />
        </div>
        {shot.items.map((item, i) => {
          const t = rise(frame, XFADE + 8 + i * 8);
          return (
            <div
              key={item}
              className="flex items-baseline"
              style={{
                gap: 28,
                opacity: t,
                transform: `translateX(${(1 - t) * 24}px)`,
                borderTop: "1px solid rgba(255,255,255,0.1)",
                padding: "26px 0",
              }}
            >
              <div style={{ fontFamily: monoFont, fontSize: 30, color: ACCENT, width: 56 }}>{`0${i + 1}`}</div>
              <div style={{ fontFamily: bodyFont, fontWeight: 800, fontSize: 64, letterSpacing: "-0.025em", color: "#fff" }}>
                {item}
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const FORMULA = [
  "Calorie deficit",
  "Nutrition",
  "Daily movement",
  "Cardio",
  "Strength training",
  "Recovery",
  "Healthy lifestyle",
  "Consistency",
];

const FormulaShot: React.FC<{ len: number }> = ({ len }) => {
  const frame = useCurrentFrame();
  const enter = useEnter(true);
  const textOut = useTextOut(len, false);
  return (
    <AbsoluteFill style={{ opacity: enter.opacity, background: PAGE_BG, filter: `blur(${enter.blur}px)` }}>
      <AbsoluteFill className="justify-center" style={{ padding: "0 96px 120px", opacity: textOut }}>
        <div style={{ marginBottom: 26 }}>
          <Kicker text="The MovinForward formula" delay={XFADE} />
        </div>
        {FORMULA.map((item, i) => {
          const at = XFADE + 14 + i * 9;
          const t = rise(frame, at, 10);
          const final = i === FORMULA.length - 1;
          return (
            <div key={item} className="flex items-baseline" style={{ opacity: t, transform: `translateX(${(1 - t) * 30}px)`, marginTop: 12 }}>
              <div style={{ width: 70, fontFamily: bodyFont, fontWeight: 900, fontSize: 58, color: ACCENT }}>{i === 0 ? "" : "+"}</div>
              <div
                style={{
                  fontFamily: bodyFont,
                  fontWeight: final ? 900 : 700,
                  fontSize: final ? 78 : 62,
                  letterSpacing: "-0.025em",
                  color: final ? ACCENT : "#fff",
                }}
              >
                {item}
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const OutroShot: React.FC<{ len: number }> = ({ len }) => {
  const frame = useCurrentFrame();
  const enter = useEnter(true);
  const out = interpolate(frame, [len - 10, len], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ opacity: enter.opacity * out, background: PAGE_BG, filter: `blur(${enter.blur}px)` }}>
      <AbsoluteFill className="items-center" style={{ paddingTop: 170 }}>
        <Print src="mfba/coach.jpg" focus="center 35%" height={700} len={len} delay={XFADE} />
        <div className="flex flex-col items-center text-center" style={{ marginTop: 60 }}>
          <div style={{ fontFamily: bodyFont, fontWeight: 600, fontSize: 46, color: "rgba(255,255,255,0.9)", opacity: rise(frame, XFADE + 4) }}>
            Start small. Stay consistent.
          </div>
          <div style={{ marginTop: 36, opacity: rise(frame, XFADE + 16) }}>
            <ArrowMark size={70} />
          </div>
          <div
            style={{
              fontFamily: bodyFont,
              fontWeight: 900,
              fontSize: 96,
              lineHeight: 1,
              letterSpacing: "-0.035em",
              color: ACCENT,
              marginTop: 24,
              opacity: rise(frame, XFADE + 20),
            }}
          >
            Keep moving
            <br />
            forward.
          </div>
          <div style={{ fontFamily: monoFont, fontSize: 28, letterSpacing: "0.14em", color: "rgba(255,255,255,0.75)", marginTop: 40, opacity: rise(frame, XFADE + 34) }}>
            {HANDLE}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const FatLossFilm: React.FC = () => (
  <AbsoluteFill style={{ background: PAGE_BG }}>
    {TIMELINE.map(({ shot, from, len, first, last }, i) => (
      <Sequence key={i} from={from} durationInFrames={len}>
        {shot.kind === "framed" ? (
          <FramedShot shot={shot} len={len} first={first} last={last} />
        ) : shot.kind === "card" ? (
          <CardShot shot={shot} len={len} last={last} />
        ) : shot.kind === "list" ? (
          <ListShot shot={shot} len={len} />
        ) : shot.kind === "formula" ? (
          <FormulaShot len={len} />
        ) : (
          <OutroShot len={len} />
        )}
      </Sequence>
    ))}
    <Grain />
  </AbsoluteFill>
);
