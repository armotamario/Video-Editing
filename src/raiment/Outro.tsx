import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { bodyFont, headlineFont } from "../fonts";
import { LogoMark } from "../components/LogoMark";
import { CREAM, CTA_FILLED, GOLD, INK, INK_SOFT, PAGE_BG } from "../theme";
import { BRAND_NAME, BRAND_URL } from "../brand";
import { PRICE } from "./copy";

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const markIn = spring({ frame, fps, config: { damping: 200 } });
  const priceIn = spring({ frame: frame - 10, fps, config: { damping: 200 } });
  const urlIn = spring({ frame: frame - 18, fps, config: { damping: 12, mass: 0.6 } });
  const pulse = 1 + Math.sin(frame / 8) * 0.03;
  const fadeIn = interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill className="items-center justify-center" style={{ opacity: fadeIn, background: PAGE_BG }}>
      <div style={{ transform: `translateY(${interpolate(markIn, [0, 1], [-22, 0])}px)`, opacity: markIn }} className="mb-8">
        <LogoMark size={90} color={GOLD} />
      </div>

      <div style={{ fontFamily: headlineFont, color: INK }} className="text-8xl leading-none tracking-wide">
        {BRAND_NAME}
      </div>

      <div
        style={{ opacity: priceIn, fontFamily: bodyFont, color: INK_SOFT }}
        className="mt-6 text-3xl font-bold"
      >
        The Godly Raiment Hat · {PRICE}
      </div>

      <div
        style={{
          transform: `scale(${pulse})`,
          opacity: urlIn,
          fontFamily: bodyFont,
          background: CTA_FILLED ? INK : "transparent",
          color: CTA_FILLED ? CREAM : GOLD,
          border: CTA_FILLED ? "none" : `2px solid ${GOLD}`,
        }}
        className="mt-12 rounded-full px-8 py-4 text-2xl font-bold tracking-wide"
      >
        {BRAND_URL}
      </div>
    </AbsoluteFill>
  );
};
