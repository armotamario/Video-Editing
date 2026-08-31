import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { headlineFont, bodyFont } from "../fonts";
import { BRAND_NAME, TAGLINE } from "../slides";

export const Intro: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoIn = spring({ frame, fps, config: { damping: 12, mass: 0.6 } });
  const taglineIn = spring({ frame: frame - 14, fps, config: { damping: 200 } });
  const glow = interpolate(frame % 60, [0, 30, 60], [0.35, 0.65, 0.35]);
  const fadeOut = interpolate(frame, [durationInFrames - 15, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill className="items-center justify-center bg-black" style={{ opacity: fadeOut }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 45%, rgba(251,191,36,${glow}) 0%, rgba(0,0,0,0) 60%)`,
        }}
      />

      <div
        style={{
          transform: `scale(${interpolate(logoIn, [0, 1], [0.7, 1])})`,
          opacity: logoIn,
          fontFamily: headlineFont,
        }}
        className="px-10 text-center text-7xl tracking-wide text-white"
      >
        {BRAND_NAME}
      </div>

      <div
        style={{
          transform: `translateY(${interpolate(taglineIn, [0, 1], [30, 0])}px)`,
          opacity: taglineIn,
          fontFamily: bodyFont,
        }}
        className="mt-6 text-3xl font-medium uppercase tracking-[0.4em] text-amber-400"
      >
        {TAGLINE}
      </div>
    </AbsoluteFill>
  );
};
