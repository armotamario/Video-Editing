import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { bodyFont, headlineFont } from "../fonts";
import { ACCENT, INK, INK_SOFT, PAGE_BG } from "./theme";
import { OFFER, OFFER_SUB } from "./brand";

export const Offer: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const hit = spring({ frame, fps, config: { damping: 11, mass: 0.5 } });
  const subIn = spring({ frame: frame - 14, fps, config: { damping: 200 } });
  const fadeOut = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill className="items-center justify-center px-14" style={{ opacity: fadeOut, background: PAGE_BG }}>
      <div
        style={{ opacity: subIn, fontFamily: bodyFont, color: INK_SOFT }}
        className="mb-8 text-xl font-bold uppercase tracking-[0.35em]"
      >
        Start here
      </div>

      <div
        style={{
          transform: `scale(${interpolate(hit, [0, 1], [0.72, 1])})`,
          opacity: hit,
          fontFamily: headlineFont,
          color: ACCENT,
        }}
        className="text-center text-[150px] leading-[0.92] tracking-wide"
      >
        {OFFER}
      </div>

      <div
        style={{
          transform: `translateY(${interpolate(subIn, [0, 1], [30, 0])}px)`,
          opacity: subIn,
          fontFamily: bodyFont,
          color: INK,
        }}
        className="mt-10 text-4xl font-bold"
      >
        {OFFER_SUB}
      </div>
    </AbsoluteFill>
  );
};
