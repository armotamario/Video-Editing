import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { headlineFont, bodyFont } from "../fonts";
import { BRAND_NAME, BRAND_URL } from "../slides";

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const ctaIn = spring({ frame, fps, config: { damping: 200 } });
  const urlIn = spring({ frame: frame - 10, fps, config: { damping: 12, mass: 0.6 } });
  const pulse = 1 + Math.sin(frame / 8) * 0.03;
  const fadeIn = interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill className="items-center justify-center bg-black" style={{ opacity: fadeIn }}>
      <div
        style={{
          transform: `translateY(${interpolate(ctaIn, [0, 1], [-30, 0])}px)`,
          opacity: ctaIn,
          fontFamily: bodyFont,
        }}
        className="mb-8 text-2xl font-bold uppercase tracking-[0.35em] text-neutral-400"
      >
        {BRAND_NAME}
      </div>

      <div style={{ fontFamily: headlineFont }} className="px-10 text-center text-6xl leading-tight text-white">
        Tap the link
        <br />
        in bio
      </div>

      <div
        style={{
          transform: `scale(${pulse})`,
          opacity: urlIn,
          fontFamily: bodyFont,
        }}
        className="mt-10 rounded-full border-2 border-amber-400 px-8 py-4 text-2xl font-bold tracking-wide text-amber-400"
      >
        {BRAND_URL}
      </div>
    </AbsoluteFill>
  );
};
