import { AbsoluteFill, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { bodyFont, monoFont } from "../fonts";

/**
 * The shared product-promo film: 9:16, full-bleed, on paper the whole way.
 *
 * Every frame is the studio white the products are shot on, so there is no
 * black ground and no letterbox anywhere — the thing that keeps catching these
 * out is a frame that does not fill 9:16, and this one is 9:16 by
 * construction. A drop supplies its own title, beats and sign-off line.
 */

export type PromoBeat = { src: string; label: string; line: string; hot?: string };

const PAPER = "#f7f6f3";
const INK = "#14120f";
const GOLD = "#a8761a";

const BEAT = 66;
const TITLE = 60;
const SIGN_OFF = 78;
const FADE = 14;

export const promoDuration = (beats: number) => TITLE + BEAT * beats + SIGN_OFF;

const Rule: React.FC<{ delay?: number; width?: number }> = ({ delay = 0, width = 150 }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [delay, delay + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{ width, height: 5, background: GOLD, transform: `scaleX(${t})`, transformOrigin: "left" }}
    />
  );
};

/** The mark: a drawn cross, so it scales without a bitmap behind it. */
const Cross: React.FC<{ size?: number; delay?: number }> = ({ size = 96, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  return (
    <svg width={size} height={size * 1.4} viewBox="0 0 40 56" style={{ transform: `scale(${s})` }}>
      <path
        d="M17 2h6v12h12v6H23v34h-6V20H5v-6h12V2z"
        fill={GOLD}
      />
    </svg>
  );
};

const Line: React.FC<{ text: string; size: number; delay: number; hot?: boolean }> = ({
  text,
  size,
  delay,
  hot,
}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [delay, delay + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        opacity: t,
        transform: `translateY(${interpolate(t, [0, 1], [16, 0])}px)`,
        fontFamily: bodyFont,
        fontWeight: 900,
        fontSize: size,
        lineHeight: 1.04,
        letterSpacing: "-0.02em",
        color: hot ? GOLD : INK,
      }}
      className="uppercase"
    >
      {text}
    </div>
  );
};

/** One product beat: the shot held large, with a label above it. */
const Beat: React.FC<{ src: string; label: string; line: string; hot?: string }> = ({
  src,
  label,
  line,
  hot,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = frame / Math.max(durationInFrames, 1);
  return (
    <AbsoluteFill style={{ background: PAPER }}>
      <AbsoluteFill
        className="items-center"
        style={{ justifyContent: "flex-end", paddingBottom: 260 }}
      >
        <div
          style={{
            transform: `translateY(${interpolate(t, [0, 1], [14, -14])}px) scale(${interpolate(
              t,
              [0, 1],
              [1.0, 1.05],
            )})`,
            mixBlendMode: "multiply",
          }}
          className="flex items-end justify-center"
        >
          <Img
            src={staticFile(`images/${src}`)}
            className="object-contain"
            style={{ maxWidth: 890, maxHeight: 1010 }}
          />
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ paddingTop: 300, paddingLeft: 86 }}>
        <div
          style={{
            fontFamily: monoFont,
            fontSize: 26,
            letterSpacing: "0.3em",
            color: GOLD,
            opacity: interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" }),
          }}
          className="uppercase"
        >
          {label}
        </div>
        <div className="mt-6">
          <Rule delay={4} />
        </div>
        <div className="mt-8 flex flex-col">
          {line.split("\n").map((l, i) => (
            <Line key={l} text={l} size={92} delay={8 + i * 5} hot={hot === l} />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Title: React.FC<{ name: string }> = ({ name }) => (
  <AbsoluteFill style={{ background: PAPER }} className="items-center justify-center">
    <Cross size={110} delay={2} />
    <div className="mt-12 flex flex-col items-center">
      <Line text="Godly Raiment" size={104} delay={8} />
      <Line text={name} size={104} delay={14} hot />
    </div>
    <div className="mt-12">
      <Rule delay={20} width={260} />
    </div>
  </AbsoluteFill>
);

const SignOff: React.FC = () => (
  <AbsoluteFill style={{ background: PAPER }} className="items-center justify-center">
    <Cross size={84} delay={2} />
    <div className="mt-10 flex flex-col items-center">
      <Line text="Out now" size={116} delay={8} />
    </div>
    <div
      style={{
        fontFamily: monoFont,
        fontSize: 32,
        letterSpacing: "0.26em",
        color: GOLD,
      }}
      className="mt-12 uppercase"
    >
      godlyraiment.com.au
    </div>
  </AbsoluteFill>
);

/** A slow dip to paper at each end, so nothing starts or stops hard. */
const Fade: React.FC<{ total: number; children: React.ReactNode }> = ({ total, children }) => {
  const frame = useCurrentFrame();
  const t = Math.min(
    interpolate(frame, [0, FADE], [0, 1], { extrapolateRight: "clamp" }),
    interpolate(frame, [total - FADE, total], [1, 0], { extrapolateLeft: "clamp" }),
  );
  return (
    <AbsoluteFill style={{ background: PAPER }}>
      <AbsoluteFill style={{ opacity: t }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Promo: React.FC<{ name: string; beats: PromoBeat[] }> = ({ name, beats }) => {
  const total = promoDuration(beats.length);
  let at = TITLE;
  return (
    <Fade total={total}>
      <AbsoluteFill style={{ background: PAPER }}>
        <Sequence durationInFrames={TITLE}>
          <Title name={name} />
        </Sequence>
        {beats.map((b) => {
          const from = at;
          at += BEAT;
          return (
            <Sequence key={b.src} from={from} durationInFrames={BEAT}>
              <Beat {...b} />
            </Sequence>
          );
        })}
        <Sequence from={at} durationInFrames={SIGN_OFF}>
          <SignOff />
        </Sequence>
      </AbsoluteFill>
    </Fade>
  );
};
