import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { bodyFont, headlineFont, monoFont } from "../fonts";
import { LogoMark } from "../components/LogoMark";
import { GOLD, INK, INK_SOFT, PAGE_BG } from "../theme";
import { DEFINITION, PHONETIC, WORD } from "./copy";

export const Definition: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const markIn = spring({ frame, fps, config: { damping: 200 } });
  const wordIn = spring({ frame: frame - 6, fps, config: { damping: 14, mass: 0.6 } });
  const phoneticIn = spring({ frame: frame - 20, fps, config: { damping: 200 } });
  const defIn = spring({ frame: frame - 32, fps, config: { damping: 200 } });
  const fadeOut = interpolate(frame, [durationInFrames - 14, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill className="items-center justify-center px-14" style={{ opacity: fadeOut, background: PAGE_BG }}>
      <div style={{ opacity: markIn }} className="mb-12">
        <LogoMark size={70} color={GOLD} />
      </div>

      <div
        style={{
          transform: `scale(${interpolate(wordIn, [0, 1], [0.82, 1])})`,
          opacity: wordIn,
          fontFamily: headlineFont,
          color: INK,
        }}
        className="text-[150px] leading-none tracking-wide"
      >
        {WORD}
      </div>

      <div
        style={{ opacity: phoneticIn, fontFamily: monoFont, color: GOLD }}
        className="mt-6 text-2xl tracking-[0.15em]"
      >
        {PHONETIC}
      </div>

      <div
        style={{
          transform: `translateY(${interpolate(defIn, [0, 1], [26, 0])}px)`,
          opacity: defIn,
          fontFamily: bodyFont,
          color: INK_SOFT,
        }}
        className="mt-12 max-w-[820px] text-center text-[42px] font-medium leading-[1.3]"
      >
        {DEFINITION}
      </div>
    </AbsoluteFill>
  );
};
