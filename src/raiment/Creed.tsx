import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { headlineFont } from "../fonts";
import { GOLD, INK, PAGE_BG } from "../theme";
import { CREED_LINES } from "./copy";

export const Creed: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeOut = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill className="justify-center px-16" style={{ opacity: fadeOut, background: PAGE_BG }}>
      {CREED_LINES.map((line, i) => {
        const lineIn = spring({ frame: frame - i * 9, fps, config: { damping: 200 } });
        return (
          <div
            key={line}
            style={{
              transform: `translateY(${interpolate(lineIn, [0, 1], [64, 0])}px)`,
              opacity: lineIn,
              fontFamily: headlineFont,
              color: i === CREED_LINES.length - 1 ? GOLD : INK,
            }}
            className="text-[124px] leading-[1.0] tracking-wide"
          >
            {line}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
