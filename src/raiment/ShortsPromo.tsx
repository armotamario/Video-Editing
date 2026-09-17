import { AbsoluteFill, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { bodyFont, monoFont } from "../fonts";

/**
 * The shorts promo: 9:16, full-bleed, and on paper the whole way through.
 *
 * Every frame is the studio white the products are shot on, so there is no
 * black ground and no letterbox anywhere — the thing he keeps getting caught
 * by is a frame that does not fill 9:16, and this one is 9:16 by construction.
 */

const PAPER = "#f7f6f3";
const INK = "#14120f";
const GOLD = "#a8761a";

export const SHORTS_BEATS = [66, 66, 66, 66, 66];
export const SHORTS_PROMO_DURATION = 60 + SHORTS_BEATS.reduce((a, b) => a + b, 0) + 78;

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
          className="w-[890px]"
        >
          <Img src={staticFile(`images/${src}`)} className="w-full object-contain" />
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

const Title: React.FC = () => (
  <AbsoluteFill style={{ background: PAPER }} className="items-center justify-center">
    <Cross size={110} delay={2} />
    <div className="mt-12 flex flex-col items-center">
      <Line text="Godly Raiment" size={104} delay={8} />
      <Line text="Shorts" size={104} delay={14} hot />
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

const BEATS: { src: string; label: string; line: string; hot?: string }[] = [
  { src: "store/shorts-1.jpg", label: "New in", line: "Godly Raiment\nShorts", hot: "Shorts" },
  { src: "store/shorts-2.jpg", label: "Front", line: "Wear what\nyou believe", hot: "you believe" },
  { src: "store/shorts-3.jpg", label: "Detail", line: "Gold cross\non the leg", hot: "Gold cross" },
  { src: "store/shorts-4.jpg", label: "Back", line: "Front and\nback", hot: "back" },
  { src: "store/shorts-5.jpg", label: "Worn", line: "One colour.\nOne cross.", hot: "One cross." },
];

export const ShortsPromo: React.FC = () => {
  let at = 60;
  return (
    <AbsoluteFill style={{ background: PAPER }}>
      <Sequence durationInFrames={60}>
        <Title />
      </Sequence>
      {BEATS.map((b, i) => {
        const from = at;
        at += SHORTS_BEATS[i];
        return (
          <Sequence key={b.src} from={from} durationInFrames={SHORTS_BEATS[i]}>
            <Beat {...b} />
          </Sequence>
        );
      })}
      <Sequence from={at} durationInFrames={78}>
        <SignOff />
      </Sequence>
    </AbsoluteFill>
  );
};
