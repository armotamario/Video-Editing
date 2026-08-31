import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { bodyFont, headlineFont } from "../fonts";
import { ACCENT, INK, INK_SOFT, PAGE_BG } from "./theme";
import { HEADLINE, SUBLINE } from "./brand";

export const Statement: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lines = HEADLINE.split("\n");
  const subIn = spring({ frame: frame - 22, fps, config: { damping: 200 } });
  const kenBurns = interpolate(frame, [0, durationInFrames], [1.04, 1.12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: fadeOut, background: PAGE_BG }}>
      <AbsoluteFill style={{ transform: `scale(${kenBurns})` }}>
        <Img src={staticFile("images/mfba/gym.jpg")} className="h-full w-full object-cover" />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to top, rgba(10,9,8,0.94) 0%, rgba(10,9,8,0.75) 32%, rgba(10,9,8,0.15) 62%, rgba(10,9,8,0.45) 100%)",
        }}
      />

      <AbsoluteFill className="justify-end px-16 pb-40">
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
              className="text-[128px] leading-[0.95] tracking-wide"
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
          className="mt-8 text-3xl font-medium"
        >
          {SUBLINE}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
