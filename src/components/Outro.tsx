import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { headlineFont, bodyFont } from "../fonts";
import { CREAM, GOLD, INK, INK_SOFT, PAGE_BG } from "../theme";
import { LogoMark } from "./LogoMark";
import { BRAND_NAME, BRAND_URL } from "../brand";

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const ctaIn = spring({ frame, fps, config: { damping: 200 } });
  const urlIn = spring({ frame: frame - 10, fps, config: { damping: 12, mass: 0.6 } });
  const pulse = 1 + Math.sin(frame / 8) * 0.03;
  const fadeIn = interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill className="items-center justify-center" style={{ opacity: fadeIn, background: PAGE_BG }}>
      <div
        style={{
          transform: `translateY(${interpolate(ctaIn, [0, 1], [-30, 0])}px)`,
          opacity: ctaIn,
        }}
        className="mb-4"
      >
        <LogoMark size={50} color={GOLD} />
      </div>

      <div
        style={{
          transform: `translateY(${interpolate(ctaIn, [0, 1], [-30, 0])}px)`,
          opacity: ctaIn,
          fontFamily: bodyFont,
          color: INK_SOFT,
        }}
        className="mb-8 text-2xl font-bold uppercase tracking-[0.35em]"
      >
        {BRAND_NAME}
      </div>

      <div style={{ fontFamily: headlineFont, color: INK }} className="px-10 text-center text-6xl leading-tight">
        Tap the link
        <br />
        in bio
      </div>

      <div
        style={{
          transform: `scale(${pulse})`,
          opacity: urlIn,
          fontFamily: bodyFont,
          background: INK,
          color: CREAM,
        }}
        className="mt-10 rounded-full px-8 py-4 text-2xl font-bold tracking-wide"
      >
        {BRAND_URL}
      </div>
    </AbsoluteFill>
  );
};
