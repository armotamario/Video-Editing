import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { monoFont, serifFont } from "../fonts";
import { GOLD, INK, PAGE_BG } from "./theme";
import { PITCH_LINES } from "./brand";

export const Pitch: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tagIn = spring({ frame, fps, config: { damping: 200 } });
  const fadeOut = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill className="justify-center px-16" style={{ opacity: fadeOut, background: PAGE_BG }}>
      <div
        style={{ opacity: tagIn, fontFamily: monoFont, color: GOLD }}
        className="mb-12 text-xl uppercase tracking-[0.45em]"
      >
        What you get
      </div>

      {PITCH_LINES.map((line, i) => {
        const lineIn = spring({ frame: frame - i * 10, fps, config: { damping: 200 } });
        return (
          <div
            key={line}
            style={{
              transform: `translateY(${interpolate(lineIn, [0, 1], [60, 0])}px)`,
              opacity: lineIn,
              fontFamily: serifFont,
              color: i === 0 ? INK : GOLD,
            }}
            className="text-[104px] font-bold leading-[1.06] tracking-tight"
          >
            {line}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
