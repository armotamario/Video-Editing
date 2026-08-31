import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { monoFont, serifFont } from "../fonts";
import { MonogramMark } from "./MonogramMark";
import { GOLD, INK, PAGE_BG } from "./theme";
import { KICKER, NAME, ROLE } from "./brand";

export const Intro: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const markIn = spring({ frame, fps, config: { damping: 14, mass: 0.6 } });
  const nameIn = spring({ frame: frame - 10, fps, config: { damping: 200 } });
  const roleIn = spring({ frame: frame - 20, fps, config: { damping: 200 } });
  const fadeOut = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill className="items-center justify-center" style={{ opacity: fadeOut, background: PAGE_BG }}>
      <div style={{ transform: `scale(${interpolate(markIn, [0, 1], [0.7, 1])})`, opacity: markIn }}>
        <MonogramMark size={240} />
      </div>

      <div
        style={{
          transform: `translateY(${interpolate(nameIn, [0, 1], [26, 0])}px)`,
          opacity: nameIn,
          fontFamily: serifFont,
          color: INK,
        }}
        className="mt-14 text-[96px] font-bold leading-none tracking-tight"
      >
        {NAME}
      </div>

      <div
        style={{ opacity: nameIn, fontFamily: monoFont, color: GOLD }}
        className="mt-6 text-2xl uppercase tracking-[0.45em]"
      >
        {KICKER}
      </div>

      <div
        style={{
          transform: `translateY(${interpolate(roleIn, [0, 1], [26, 0])}px)`,
          opacity: roleIn,
          fontFamily: monoFont,
          color: INK,
        }}
        className="mt-12 text-3xl"
      >
        {ROLE}
      </div>
    </AbsoluteFill>
  );
};
