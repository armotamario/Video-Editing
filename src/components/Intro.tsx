import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { headlineFont, bodyFont } from "../fonts";
import { LogoMark } from "./LogoMark";
import { BRAND_NAME, TAGLINE } from "../brand";

export const Intro: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoIn = spring({ frame, fps, config: { damping: 12, mass: 0.6 } });
  const taglineIn = spring({ frame: frame - 14, fps, config: { damping: 200 } });
  const fadeOut = interpolate(frame, [durationInFrames - 15, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill className="items-center justify-center bg-black" style={{ opacity: fadeOut }}>
      <div
        style={{
          transform: `scale(${interpolate(logoIn, [0, 1], [0.7, 1])})`,
          opacity: logoIn,
        }}
        className="mb-8"
      >
        <LogoMark size={140} />
      </div>

      <div
        style={{
          transform: `scale(${interpolate(logoIn, [0, 1], [0.7, 1])})`,
          opacity: logoIn,
          fontFamily: headlineFont,
        }}
        className="px-8 text-center text-9xl leading-none tracking-wide text-white"
      >
        {BRAND_NAME}
      </div>

      <div
        style={{
          transform: `translateY(${interpolate(taglineIn, [0, 1], [30, 0])}px)`,
          opacity: taglineIn,
          fontFamily: bodyFont,
        }}
        className="mt-8 text-4xl font-medium uppercase tracking-[0.4em] text-amber-400"
      >
        {TAGLINE}
      </div>
    </AbsoluteFill>
  );
};
