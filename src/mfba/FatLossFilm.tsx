import { AbsoluteFill, Easing, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { bodyFont, monoFont } from "../fonts";
import { ArrowMark } from "./ArrowMark";
import { ACCENT, PAGE_BG } from "./theme";

/**
 * "Simple, sustainable fat loss" — Mario's six-part coaching framework as a
 * premium photo reel: full-bleed stills with slow push-ins and a slight tilt,
 * soft zoom-blur cuts on a steady 15-frame grid (so any 120bpm sound added in
 * the app lands on the cuts), short captions, and a few graphite punch cards.
 * Silent on purpose.
 */

const BEAT = 15;
const XFADE = 8;
const HANDLE = "@movinforwardbyarm";

type Photo = {
  kind: "photo";
  src: string;
  focus: string;
  kicker?: string;
  lines: string[];
  hot?: string;
  beats: number;
  tilt?: number;
};
type Card = { kind: "card"; kicker?: string; lines: string[]; hot?: string; beats: number };
type Shot = Photo | Card | { kind: "formula"; beats: number } | { kind: "outro"; beats: number };

const ch = (n: number, name: string) => `0${n} — ${name}`;

const SHOTS: Shot[] = [
  { kind: "photo", src: "mfba/coach.jpg", focus: "center 30%", kicker: "Weight-loss coaching", lines: ["Simple,", "sustainable", "fat loss."], hot: "sustainable", beats: 5, tilt: -1 },
  { kind: "photo", src: "mfba/outdoor-cap.jpg", focus: "center 30%", kicker: "The goal", lines: ["Lose fat. Get fitter.", "Build a life you", "can actually keep."], hot: "keep.", beats: 5, tilt: 1 },

  { kind: "photo", src: "mfba/selfie.jpg", focus: "center 40%", kicker: ch(1, "Calorie deficit"), lines: ["Eat a little less", "than you burn."], beats: 4, tilt: -1.2 },
  { kind: "photo", src: "mfba/bowl.jpg", focus: "center 55%", kicker: ch(1, "Calorie deficit"), lines: ["Whole foods.", "Controlled portions.", "Protein first."], hot: "Protein", beats: 4, tilt: 1 },
  { kind: "photo", src: "mfba/coffee.jpg", focus: "center 45%", kicker: ch(1, "Calorie deficit"), lines: ["2–3L of water a day.", "Coffee, in moderation."], beats: 4, tilt: -0.8 },
  { kind: "photo", src: "mfba/dinner.jpg", focus: "center 78%", kicker: ch(1, "Calorie deficit"), lines: ["One bad meal", "isn't a bad day."], hot: "isn't", beats: 4, tilt: 1.2 },
  { kind: "card", lines: ["You don't need", "a perfect diet.", "You need one", "you can keep."], hot: "keep.", beats: 6 },

  { kind: "photo", src: "mfba/walk-path.jpg", focus: "center 60%", kicker: ch(2, "Cardio"), lines: ["10,000 steps", "a day."], hot: "10,000", beats: 4, tilt: -1 },
  { kind: "photo", src: "mfba/cardio-walk.jpg", focus: "center 55%", kicker: ch(2, "Cardio"), lines: ["I worked up to an", "hour on the treadmill."], hot: "hour", beats: 4, tilt: 1 },
  { kind: "photo", src: "mfba/cardio-walk.jpg", focus: "center 80%", kicker: ch(2, "Cardio"), lines: ["Start where you're at.", "Build from there."], beats: 4, tilt: -1.4 },

  { kind: "photo", src: "mfba/lunge-a.jpg", focus: "center 50%", kicker: ch(3, "Weight training"), lines: ["Lift to keep", "your muscle."], hot: "muscle.", beats: 4, tilt: 1.2 },
  { kind: "photo", src: "mfba/gym-selfie.jpg", focus: "center 60%", kicker: ch(3, "Weight training"), lines: ["Push / Pull / Legs."], beats: 3, tilt: -1 },
  { kind: "photo", src: "mfba/lunge-b.jpg", focus: "center 45%", kicker: ch(3, "Weight training"), lines: ["You don't need to", "train everything,", "every day."], beats: 4, tilt: 0.8 },

  { kind: "photo", src: "mfba/mirror-night.jpg", focus: "center 50%", kicker: ch(4, "Recovery"), lines: ["Sleep. Stress.", "Water. Protein."], beats: 4, tilt: -1 },
  { kind: "card", lines: ["More isn't", "always better.", "Consistency", "beats burnout."], hot: "Consistency", beats: 6 },

  { kind: "photo", src: "mfba/dinner.jpg", focus: "center 70%", kicker: ch(5, "Lifestyle"), lines: ["Make fat loss", "fit your life."], hot: "your", beats: 4, tilt: 1 },
  { kind: "photo", src: "mfba/laptop.jpg", focus: "center 55%", kicker: ch(5, "Lifestyle"), lines: ["Less screen time.", "Read. Learn."], beats: 4, tilt: -1.2 },
  { kind: "photo", src: "gr/church-hall.jpg", focus: "center 45%", kicker: ch(5, "Lifestyle"), lines: ["Friends. Family.", "Community."], beats: 4, tilt: 1 },
  { kind: "card", lines: ["Don't isolate", "yourself.", "Actually enjoy", "your life."], hot: "enjoy", beats: 6 },

  { kind: "photo", src: "gr/bible-highlighted.jpg", focus: "center 45%", kicker: ch(6, "Faith & mindset"), lines: ["15–20 minutes", "of quiet prayer."], hot: "prayer.", beats: 4, tilt: -1 },
  { kind: "photo", src: "gr/altar-portrait.jpg", focus: "center 40%", kicker: ch(6, "Faith & mindset"), lines: ["Work on your body.", "Look after your", "mind and spirit too."], hot: "spirit", beats: 5, tilt: 1 },

  { kind: "formula", beats: 12 },
  { kind: "outro", beats: 8 },
];

const TIMELINE = (() => {
  let at = 0;
  return SHOTS.map((shot, i) => {
    const len = shot.beats * BEAT;
    const from = Math.max(0, at - (i === 0 ? 0 : XFADE));
    at += len;
    return { shot, from, len: len + (i === 0 ? 0 : XFADE) };
  });
})();

export const FAT_LOSS_DURATION = SHOTS.reduce((n, s) => n + s.beats * BEAT, 0);

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = { ...clamp, easing: Easing.out(Easing.cubic) } as const;

/** Soft zoom-blur in: the incoming shot resolves out of a slight blur and scale. */
const useEnter = (on: boolean) => {
  const frame = useCurrentFrame();
  if (!on) return { opacity: 1, blur: 0, scale: 1 };
  const t = interpolate(frame, [0, XFADE], [0, 1], easeOut);
  return { opacity: t, blur: (1 - t) * 14, scale: 1 + (1 - t) * 0.06 };
};

/** Captions clear just before the next shot dissolves in, so two never overlap. */
const useTextOut = (len: number, last = false) => {
  const frame = useCurrentFrame();
  return last ? 1 : interpolate(frame, [len - XFADE - 4, len - XFADE + 1], [1, 0], clamp);
};

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
        const t = interpolate(frame, [delay + i * 4, delay + i * 4 + 12], [0, 1], easeOut);
        return (
          <div
            key={i}
            style={{
              fontFamily: bodyFont,
              fontWeight: weight,
              fontSize: size,
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              color: "#fff",
              opacity: t,
              filter: `blur(${(1 - t) * 6}px)`,
              transform: `translateY(${(1 - t) * 16}px)`,
              textShadow: "0 2px 18px rgba(0,0,0,0.45)",
            }}
          >
            {line.split(" ").map((w, k) => (
              <span key={k} style={{ color: hot && w === hot ? ACCENT : undefined }}>
                {k > 0 ? " " : ""}
                {w}
              </span>
            ))}
          </div>
        );
      })}
    </>
  );
};

const Kicker: React.FC<{ text: string; delay: number }> = ({ text, delay }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [delay, delay + 10], [0, 1], easeOut);
  return (
    <div
      className="flex items-center"
      style={{ gap: 14, marginBottom: 22, opacity: t, transform: `translateX(${(1 - t) * -12}px)` }}
    >
      <div style={{ width: 34 * t, height: 3, background: ACCENT }} />
      <div
        style={{
          fontFamily: monoFont,
          fontWeight: 700,
          fontSize: 28,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#fff",
          textShadow: "0 1px 10px rgba(0,0,0,0.5)",
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
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 0.06, mixBlendMode: "overlay" }}>
      <filter id="fl-grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={frame % 10} />
      </filter>
      <rect width="100%" height="100%" filter="url(#fl-grain)" />
    </svg>
  );
};

const PhotoShot: React.FC<{ shot: Photo; len: number; first: boolean }> = ({ shot, len, first }) => {
  const frame = useCurrentFrame();
  const enter = useEnter(!first);
  const p = frame / len;
  const scale = 1.08 + 0.08 * p;
  const tilt = (shot.tilt ?? 0) * (0.6 + 0.4 * p);
  const delay = first ? 6 : XFADE;
  const textOut = useTextOut(len);
  return (
    <AbsoluteFill style={{ opacity: enter.opacity, background: "#0a0908" }}>
      <AbsoluteFill
        style={{
          transform: `scale(${scale * enter.scale}) rotate(${tilt}deg)`,
          filter: `blur(${enter.blur}px) contrast(1.06) saturate(0.9) sepia(0.08) brightness(0.97)`,
        }}
      >
        <Img src={staticFile(`images/${shot.src}`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: shot.focus }} />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 42%, rgba(0,0,0,0.62) 72%, rgba(0,0,0,0.7) 100%)",
        }}
      />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 90% 70% at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.35) 100%)" }} />
      <AbsoluteFill className="justify-end" style={{ padding: "0 84px 470px", opacity: textOut }}>
        {shot.kicker ? <Kicker text={shot.kicker} delay={delay} /> : null}
        <Lines lines={shot.lines} hot={shot.hot} size={74} delay={delay + 3} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const CardShot: React.FC<{ shot: Card; len: number }> = ({ shot, len }) => {
  const enter = useEnter(true);
  const textOut = useTextOut(len);
  return (
    <AbsoluteFill style={{ opacity: enter.opacity, background: PAGE_BG, transform: `scale(${enter.scale})` }}>
      <AbsoluteFill className="justify-center" style={{ padding: "0 90px 120px", opacity: textOut }}>
        <div style={{ marginBottom: 40 }}>
          <ArrowMark size={64} />
        </div>
        <Lines lines={shot.lines} hot={shot.hot} size={96} delay={XFADE} weight={900} />
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
  const textOut = useTextOut(len);
  const enter = useEnter(true);
  const head = interpolate(frame, [XFADE, XFADE + 12], [0, 1], easeOut);
  return (
    <AbsoluteFill style={{ opacity: enter.opacity, background: PAGE_BG }}>
      <AbsoluteFill className="justify-center" style={{ padding: "0 96px 80px", opacity: textOut }}>
        <div style={{ opacity: head }}>
          <Kicker text="The MovinForward formula" delay={XFADE} />
        </div>
        {FORMULA.map((item, i) => {
          const at = XFADE + 14 + i * 9;
          const t = interpolate(frame, [at, at + 10], [0, 1], easeOut);
          const last = i === FORMULA.length - 1;
          return (
            <div
              key={item}
              className="flex items-baseline"
              style={{ opacity: t, transform: `translateX(${(1 - t) * 30}px)`, marginTop: 10 }}
            >
              <div style={{ width: 70, fontFamily: bodyFont, fontWeight: 900, fontSize: 58, color: ACCENT }}>
                {i === 0 ? "" : "+"}
              </div>
              <div
                style={{
                  fontFamily: bodyFont,
                  fontWeight: last ? 900 : 700,
                  fontSize: last ? 76 : 62,
                  letterSpacing: "-0.02em",
                  color: last ? ACCENT : "#fff",
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
  const t = (a: number) => interpolate(frame, [a, a + 12], [0, 1], easeOut);
  const fadeOut = interpolate(frame, [len - 10, len], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ opacity: enter.opacity * fadeOut, background: "#0a0908" }}>
      <AbsoluteFill style={{ transform: `scale(${1.1 + 0.05 * (frame / len)})`, filter: "brightness(0.5) saturate(0.85) contrast(1.05)" }}>
        <Img src={staticFile("images/mfba/coach.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.75) 100%)" }} />
      <AbsoluteFill className="items-center justify-end text-center" style={{ paddingBottom: 430 }}>
        <div style={{ fontFamily: bodyFont, fontWeight: 700, fontSize: 52, color: "#fff", opacity: t(XFADE) }}>Start small.</div>
        <div style={{ fontFamily: bodyFont, fontWeight: 700, fontSize: 52, color: "#fff", opacity: t(XFADE + 10), marginTop: 6 }}>
          Stay consistent.
        </div>
        <div style={{ marginTop: 44, opacity: t(XFADE + 26), transform: `scale(${interpolate(t(XFADE + 26), [0, 1], [0.92, 1])})` }}>
          <ArrowMark size={78} />
        </div>
        <div
          style={{
            fontFamily: bodyFont,
            fontWeight: 900,
            fontSize: 92,
            lineHeight: 1,
            letterSpacing: "-0.03em",
            color: ACCENT,
            marginTop: 26,
            opacity: t(XFADE + 30),
          }}
        >
          Keep moving
          <br />
          forward.
        </div>
        <div
          style={{
            fontFamily: monoFont,
            fontSize: 28,
            letterSpacing: "0.14em",
            color: "#fff",
            marginTop: 40,
            opacity: t(XFADE + 44) * 0.85,
          }}
        >
          {HANDLE}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const FatLossFilm: React.FC = () => (
  <AbsoluteFill style={{ background: "#0a0908" }}>
    {TIMELINE.map(({ shot, from, len }, i) => (
      <Sequence key={i} from={from} durationInFrames={len}>
        {shot.kind === "photo" ? (
          <PhotoShot shot={shot} len={len} first={i === 0} />
        ) : shot.kind === "card" ? (
          <CardShot shot={shot} len={len} />
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
