import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { bodyFont, headlineFont } from "../fonts";
import { ArrowMark } from "./ArrowMark";
import { ACCENT, INK, INK_SOFT, PAGE_BG } from "./theme";
import { BRAND_NAME, BRAND_SHORT, TAGLINE } from "./brand";

export const Intro: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const markIn = spring({ frame, fps, config: { damping: 12, mass: 0.6 } });
  const nameIn = spring({ frame: frame - 8, fps, config: { damping: 200 } });
  const tagIn = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const fadeOut = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill className="items-center justify-center" style={{ opacity: fadeOut, background: PAGE_BG }}>
      <div
        style={{ transform: `scale(${interpolate(markIn, [0, 1], [0.6, 1])})`, opacity: markIn }}
        className="mb-10"
      >
        <ArrowMark size={150} />
      </div>

      <div
        style={{
          transform: `scale(${interpolate(markIn, [0, 1], [0.75, 1])})`,
          opacity: markIn,
          fontFamily: headlineFont,
          color: INK,
        }}
        className="text-[190px] leading-none tracking-wide"
      >
        {BRAND_SHORT}
      </div>

      <div
        style={{
          transform: `translateY(${interpolate(nameIn, [0, 1], [24, 0])}px)`,
          opacity: nameIn,
          fontFamily: bodyFont,
          color: INK_SOFT,
        }}
        className="mt-4 text-2xl font-bold uppercase tracking-[0.28em]"
      >
        {BRAND_NAME}
      </div>

      <div
        style={{
          transform: `translateY(${interpolate(tagIn, [0, 1], [24, 0])}px)`,
          opacity: tagIn,
          fontFamily: bodyFont,
          color: ACCENT,
        }}
        className="mt-10 text-3xl font-black uppercase tracking-[0.2em]"
      >
        {TAGLINE}
      </div>
    </AbsoluteFill>
  );
};
