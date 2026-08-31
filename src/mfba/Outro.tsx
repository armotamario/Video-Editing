import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { bodyFont, headlineFont } from "../fonts";
import { ArrowMark } from "./ArrowMark";
import { ACCENT, INK, INK_SOFT, PAGE_BG } from "./theme";
import { BRAND_SHORT, CTA, HANDLE, TAGLINE } from "./brand";

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const markIn = spring({ frame, fps, config: { damping: 200 } });
  const ctaIn = spring({ frame: frame - 12, fps, config: { damping: 12, mass: 0.6 } });
  const pulse = 1 + Math.sin(frame / 8) * 0.03;
  const fadeIn = interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill className="items-center justify-center" style={{ opacity: fadeIn, background: PAGE_BG }}>
      <div
        style={{ transform: `translateY(${interpolate(markIn, [0, 1], [-24, 0])}px)`, opacity: markIn }}
        className="mb-8"
      >
        <ArrowMark size={90} />
      </div>

      <div style={{ fontFamily: headlineFont, color: INK }} className="text-[120px] leading-none tracking-wide">
        {BRAND_SHORT}
      </div>

      <div
        style={{ opacity: markIn, fontFamily: bodyFont, color: INK_SOFT }}
        className="mt-4 text-2xl font-bold uppercase tracking-[0.3em]"
      >
        {TAGLINE}
      </div>

      <div
        style={{
          transform: `scale(${pulse})`,
          opacity: ctaIn,
          fontFamily: bodyFont,
          background: ACCENT,
          color: "#141210",
        }}
        className="mt-12 rounded-full px-10 py-5 text-3xl font-black uppercase tracking-wide"
      >
        {CTA}
      </div>

      <div
        style={{ opacity: ctaIn, fontFamily: bodyFont, color: INK }}
        className="mt-8 text-3xl font-bold"
      >
        {HANDLE}
      </div>
    </AbsoluteFill>
  );
};
