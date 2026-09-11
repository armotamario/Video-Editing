import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { bodyFont, headlineFont, monoFont } from "../fonts";

/**
 * MFBA's own look: left-aligned condensed caps anchored low, an orange
 * keyline, and a gradient up from the bottom instead of an outline. Quieter
 * and more athletic than Godly Raiment's centred, outlined gold.
 */

const ORANGE = "#ff6a1f";

/** A wash up from the base so type reads without ringing every letter. */
const Wash: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "linear-gradient(to top, rgba(6,6,7,0.92) 0%, rgba(6,6,7,0.78) 22%," +
        " rgba(6,6,7,0.34) 46%, rgba(6,6,7,0) 66%)",
    }}
  />
);

const BLOCK_BOTTOM = 430; // clear of Instagram's caption bar

const Row: React.FC<{ text: string; hot?: string; size: number; delay: number }> = ({
  text,
  hot,
  size,
  delay,
}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [delay, delay + 7], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        opacity: t,
        transform: `translateX(${interpolate(t, [0, 1], [-26, 0])}px)`,
        fontFamily: headlineFont,
        fontSize: size,
        lineHeight: 0.92,
        letterSpacing: "0.012em",
        color: "#ffffff",
      }}
      className="uppercase"
    >
      {text.split(" ").map((w, i, arr) => {
        const bare = w.replace(/[^A-Za-z0-9'$]/g, "").toLowerCase();
        const isHot = hot ? bare === hot.replace(/[^A-Za-z0-9'$]/g, "").toLowerCase() : false;
        return (
          <span key={`${w}-${i}`} style={{ color: isHot ? ORANGE : "#ffffff" }}>
            {w}
            {i < arr.length - 1 ? " " : ""}
          </span>
        );
      })}
    </div>
  );
};

/** The caption block: label, keyline, lines. */
export const AthleticBeat: React.FC<{
  label?: string;
  lines: string[];
  hot?: string;
  size?: number;
}> = ({ label, lines, hot, size = 112 }) => {
  const frame = useCurrentFrame();
  const rule = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill>
      <Wash />
      <AbsoluteFill
        style={{ paddingLeft: 78, paddingRight: 96, paddingBottom: BLOCK_BOTTOM }}
        className="justify-end"
      >
        <div className="flex gap-7">
          <div
            style={{ background: ORANGE, transformOrigin: "bottom", transform: `scaleY(${rule})` }}
            className="w-[7px] flex-none rounded-full"
          />
          <div className="flex flex-col gap-3">
            {label ? (
              <div
                style={{
                  opacity: rule,
                  fontFamily: monoFont,
                  color: ORANGE,
                  letterSpacing: "0.28em",
                }}
                className="mb-2 text-[27px] font-bold uppercase"
              >
                {label}
              </div>
            ) : null}
            {lines.map((l, i) => (
              <Row key={l} text={l} hot={hot} size={size} delay={6 + i * 5} />
            ))}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** The proof beat: set plainly, not shouted. */
export const AthleticQuote: React.FC<{ text: string; cite: string }> = ({ text, cite }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const c = interpolate(frame, [14, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "rgba(6,6,7,0.66)" }} />
      <AbsoluteFill
        style={{ paddingLeft: 78, paddingRight: 110, paddingBottom: BLOCK_BOTTOM }}
        className="justify-end"
      >
        <div style={{ opacity: c, background: ORANGE }} className="mb-9 h-[7px] w-[92px] rounded-full" />
        <div
          style={{
            opacity: t,
            transform: `translateY(${interpolate(t, [0, 1], [18, 0])}px)`,
            fontFamily: bodyFont,
            fontWeight: 500,
            fontSize: 58,
            lineHeight: 1.26,
            color: "#f7f5f2",
          }}
        >
          {text}
        </div>
        <div
          style={{ opacity: c, fontFamily: monoFont, color: ORANGE, letterSpacing: "0.24em" }}
          className="mt-9 text-[26px] font-bold uppercase"
        >
          {cite}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** The sign-off, same anchor as everything else. */
export const AthleticSignOff: React.FC<{ line: string; sub: string }> = ({ line, sub }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill>
      <Wash />
      <AbsoluteFill
        style={{ paddingLeft: 78, paddingRight: 96, paddingBottom: BLOCK_BOTTOM }}
        className="justify-end"
      >
        <div className="flex gap-7">
          <div
            style={{ background: ORANGE, transformOrigin: "bottom", transform: `scaleY(${t})` }}
            className="w-[7px] flex-none rounded-full"
          />
          <div>
            <div
              style={{
                opacity: t,
                fontFamily: headlineFont,
                fontSize: 104,
                lineHeight: 0.94,
                color: "#ffffff",
                whiteSpace: "pre-line",
              }}
              className="uppercase"
            >
              {line}
            </div>
            <div
              style={{ opacity: t, fontFamily: monoFont, color: ORANGE, letterSpacing: "0.24em" }}
              className="mt-6 text-[28px] font-bold uppercase"
            >
              {sub}
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
