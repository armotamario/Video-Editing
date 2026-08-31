import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { monoFont, serifFont } from "../fonts";
import { GOLD, INK, INK_SOFT, PAGE_BG } from "./theme";
import { HOOK_BODY, HOOK_NUMBER, HOOK_UNIT } from "./brand";

export const Hook: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const numIn = spring({ frame, fps, config: { damping: 12, mass: 0.5 } });
  const unitIn = spring({ frame: frame - 10, fps, config: { damping: 200 } });
  const bodyIn = spring({ frame: frame - 20, fps, config: { damping: 200 } });
  const fadeOut = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill className="justify-center px-16" style={{ opacity: fadeOut, background: PAGE_BG }}>
      <div
        style={{
          transform: `scale(${interpolate(numIn, [0, 1], [0.7, 1])})`,
          opacity: numIn,
          fontFamily: serifFont,
          color: GOLD,
        }}
        className="text-[270px] font-bold leading-[1.25]"
      >
        {HOOK_NUMBER}
      </div>

      <div
        style={{
          transform: `translateY(${interpolate(unitIn, [0, 1], [30, 0])}px)`,
          opacity: unitIn,
          fontFamily: monoFont,
          color: INK,
        }}
        className="mt-1 text-5xl uppercase tracking-[0.3em]"
      >
        {HOOK_UNIT}
      </div>

      <div
        style={{
          transform: `translateY(${interpolate(bodyIn, [0, 1], [30, 0])}px)`,
          opacity: bodyIn,
          fontFamily: serifFont,
          color: INK_SOFT,
        }}
        className="mt-12 max-w-[900px] text-[46px] leading-[1.25]"
      >
        {HOOK_BODY}
      </div>
    </AbsoluteFill>
  );
};
