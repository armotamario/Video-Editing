import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { bodyFont, headlineFont } from "../fonts";
import { ACCENT, INK, INK_SOFT, PAGE_BG } from "./theme";
import { HEADLINE, SUBLINE } from "./brand";

export const Statement: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lines = HEADLINE.split("\n");
  const subIn = spring({ frame: frame - 22, fps, config: { damping: 200 } });
  const fadeOut = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill className="justify-center px-16" style={{ opacity: fadeOut, background: PAGE_BG }}>
      {lines.map((line, i) => {
        const lineIn = spring({ frame: frame - i * 8, fps, config: { damping: 200 } });
        return (
          <div
            key={line}
            style={{
              transform: `translateY(${interpolate(lineIn, [0, 1], [70, 0])}px)`,
              opacity: lineIn,
              fontFamily: headlineFont,
              color: i === 0 ? INK : ACCENT,
            }}
            className="text-[135px] leading-[0.95] tracking-wide"
          >
            {line}
          </div>
        );
      })}

      <div
        style={{
          transform: `translateY(${interpolate(subIn, [0, 1], [30, 0])}px)`,
          opacity: subIn,
          fontFamily: bodyFont,
          color: INK_SOFT,
        }}
        className="mt-10 text-3xl font-medium"
      >
        {SUBLINE}
      </div>
    </AbsoluteFill>
  );
};
