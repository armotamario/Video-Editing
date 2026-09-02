import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { bodyFont, headlineFont } from "../fonts";
import { ACCENT, INK, INK_SOFT, PAGE_BG } from "../mfba/theme";
import { HOOK, HOOK_SUB } from "./copy";

export const Hook: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const subIn = spring({ frame: frame - 26, fps, config: { damping: 200 } });
  const fadeOut = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill className="justify-center px-16" style={{ opacity: fadeOut, background: PAGE_BG }}>
      {HOOK.map((line, i) => {
        const lineIn = spring({ frame: frame - i * 7, fps, config: { damping: 200 } });
        return (
          <div
            key={line}
            style={{
              transform: `translateY(${interpolate(lineIn, [0, 1], [72, 0])}px)`,
              opacity: lineIn,
              fontFamily: headlineFont,
              color: i === 1 ? ACCENT : INK,
            }}
            className="text-[150px] leading-[0.94] tracking-wide"
          >
            {line}
          </div>
        );
      })}

      <div
        style={{
          transform: `translateY(${interpolate(subIn, [0, 1], [28, 0])}px)`,
          opacity: subIn,
          fontFamily: bodyFont,
          color: INK_SOFT,
        }}
        className="mt-10 text-[38px] font-medium"
      >
        {HOOK_SUB}
      </div>
    </AbsoluteFill>
  );
};
