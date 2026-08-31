import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { monoFont, serifFont } from "../fonts";
import { GOLD, INK, INK_SOFT, ON_GOLD, PAGE_BG } from "./theme";
import { CTA, HANDLE, NAME, ROLE, SITE } from "./brand";

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const portraitIn = spring({ frame, fps, config: { damping: 14, mass: 0.6 } });
  const nameIn = spring({ frame: frame - 10, fps, config: { damping: 200 } });
  const ctaIn = spring({ frame: frame - 20, fps, config: { damping: 12, mass: 0.6 } });
  const pulse = 1 + Math.sin(frame / 8) * 0.025;
  const fadeIn = interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill className="items-center justify-center" style={{ opacity: fadeIn, background: PAGE_BG }}>
      <div
        style={{
          transform: `scale(${interpolate(portraitIn, [0, 1], [0.86, 1])})`,
          opacity: portraitIn,
          border: `5px solid ${GOLD}`,
        }}
        className="h-[360px] w-[360px] overflow-hidden rounded-full"
      >
        <Img src={staticFile("images/mario/portrait.jpg")} className="h-full w-full object-cover" />
      </div>

      <div
        style={{
          transform: `translateY(${interpolate(nameIn, [0, 1], [24, 0])}px)`,
          opacity: nameIn,
          fontFamily: serifFont,
          color: INK,
        }}
        className="mt-10 text-[78px] font-bold leading-none tracking-tight"
      >
        {NAME}
      </div>

      <div
        style={{ opacity: nameIn, fontFamily: monoFont, color: INK_SOFT }}
        className="mt-4 text-2xl"
      >
        {ROLE}
      </div>

      <div
        style={{
          transform: `scale(${pulse})`,
          opacity: ctaIn,
          fontFamily: monoFont,
          background: GOLD,
          color: ON_GOLD,
        }}
        className="mt-12 rounded-full px-10 py-5 text-2xl font-bold uppercase tracking-[0.15em]"
      >
        {CTA}
      </div>

      <div style={{ opacity: ctaIn, fontFamily: monoFont, color: GOLD }} className="mt-8 text-3xl">
        {SITE}
      </div>

      <div style={{ opacity: ctaIn, fontFamily: monoFont, color: INK_SOFT }} className="mt-3 text-xl">
        {HANDLE}
      </div>
    </AbsoluteFill>
  );
};
