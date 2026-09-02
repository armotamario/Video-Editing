import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { bodyFont, headlineFont } from "../fonts";
import { ArrowMark } from "../mfba/ArrowMark";
import { ACCENT, INK, INK_SOFT, PAGE_BG } from "../mfba/theme";
import { BRAND_SHORT } from "../mfba/brand";
import { CTA, HANDLE, PUNCHLINE } from "./copy";

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const markIn = spring({ frame, fps, config: { damping: 14, mass: 0.6 } });
  const ctaIn = spring({ frame: frame - 44, fps, config: { damping: 12, mass: 0.6 } });
  const pulse = 1 + Math.sin(frame / 8) * 0.03;
  const fadeIn = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      className="items-center justify-center px-16"
      style={{ opacity: fadeIn, background: PAGE_BG }}
    >
      <div style={{ transform: `scale(${markIn})`, opacity: markIn }}>
        <ArrowMark size={150} />
      </div>

      <div className="mt-16 text-center">
        {PUNCHLINE.map((line, i) => {
          const lineIn = spring({ frame: frame - 10 - i * 8, fps, config: { damping: 16, mass: 0.5 } });
          return (
            <div
              key={line}
              style={{
                transform: `translateY(${interpolate(lineIn, [0, 1], [50, 0])}px)`,
                opacity: lineIn,
                fontFamily: headlineFont,
                color: i === 1 ? INK_SOFT : INK,
              }}
              className="text-[152px] leading-[0.94] tracking-wide"
            >
              {line}
            </div>
          );
        })}
      </div>

      <div
        style={{
          transform: `scale(${pulse})`,
          opacity: ctaIn,
          fontFamily: bodyFont,
          background: ACCENT,
          color: "#141210",
        }}
        className="mt-16 rounded-full px-12 py-6 text-[34px] font-black uppercase tracking-wide"
      >
        {CTA}
      </div>

      <div
        style={{ opacity: ctaIn, fontFamily: headlineFont, color: INK }}
        className="mt-10 text-[74px] leading-none tracking-wide"
      >
        {BRAND_SHORT}
      </div>
      <div
        style={{ opacity: ctaIn, fontFamily: bodyFont, color: INK_SOFT }}
        className="mt-2 text-[30px] font-bold"
      >
        {HANDLE}
      </div>
    </AbsoluteFill>
  );
};
