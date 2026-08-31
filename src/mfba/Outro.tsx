import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { bodyFont, headlineFont } from "../fonts";
import { ACCENT, INK, INK_SOFT, PAGE_BG } from "./theme";
import { BRAND_SHORT, CTA, HANDLE, TAGLINE } from "./brand";

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const portraitIn = spring({ frame, fps, config: { damping: 14, mass: 0.6 } });
  const nameIn = spring({ frame: frame - 8, fps, config: { damping: 200 } });
  const ctaIn = spring({ frame: frame - 18, fps, config: { damping: 12, mass: 0.6 } });
  const pulse = 1 + Math.sin(frame / 8) * 0.03;
  const fadeIn = interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill className="items-center justify-center" style={{ opacity: fadeIn, background: PAGE_BG }}>
      <div
        style={{
          transform: `scale(${interpolate(portraitIn, [0, 1], [0.85, 1])})`,
          opacity: portraitIn,
          border: `6px solid ${ACCENT}`,
        }}
        className="h-[380px] w-[380px] overflow-hidden rounded-full"
      >
        <Img src={staticFile("images/mfba/coach.jpg")} className="h-full w-full object-cover" />
      </div>

      <div
        style={{
          transform: `translateY(${interpolate(nameIn, [0, 1], [24, 0])}px)`,
          opacity: nameIn,
          fontFamily: headlineFont,
          color: INK,
        }}
        className="mt-10 text-[110px] leading-none tracking-wide"
      >
        {BRAND_SHORT}
      </div>

      <div
        style={{ opacity: nameIn, fontFamily: bodyFont, color: INK_SOFT }}
        className="mt-2 text-2xl font-bold uppercase tracking-[0.3em]"
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
        className="mt-10 rounded-full px-10 py-5 text-3xl font-black uppercase tracking-wide"
      >
        {CTA}
      </div>

      <div style={{ opacity: ctaIn, fontFamily: bodyFont, color: INK }} className="mt-7 text-3xl font-bold">
        {HANDLE}
      </div>
    </AbsoluteFill>
  );
};
