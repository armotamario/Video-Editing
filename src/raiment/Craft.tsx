import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { bodyFont, monoFont } from "../fonts";
import { GOLD, INK, PAGE_BG } from "../theme";
import { SPECS, SPECS_KICKER } from "./copy";

export const Craft: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const hatIn = spring({ frame, fps, config: { damping: 200 } });
  const kenBurns = interpolate(frame, [0, durationInFrames], [1, 1.05], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const kickerIn = spring({ frame: frame - 4, fps, config: { damping: 200 } });
  const fadeOut = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill className="flex flex-col" style={{ opacity: fadeOut, background: PAGE_BG }}>
      <div
        style={{ opacity: kickerIn, fontFamily: monoFont, color: GOLD }}
        className="pt-24 text-center text-xl uppercase tracking-[0.4em]"
      >
        {SPECS_KICKER}
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center px-24 pt-6">
        <Img
          src={staticFile("images/hat-black.png")}
          style={{ transform: `scale(${interpolate(hatIn, [0, 1], [0.94, 1]) * kenBurns})`, opacity: hatIn }}
          className="h-full w-full object-contain"
        />
      </div>

      <div className="px-16 pb-24">
        {SPECS.map((spec, i) => {
          const rowIn = spring({ frame: frame - 14 - i * 14, fps, config: { damping: 200 } });
          return (
            <div
              key={spec}
              style={{
                transform: `translateY(${interpolate(rowIn, [0, 1], [26, 0])}px)`,
                opacity: rowIn,
              }}
              className="flex items-baseline gap-6 py-2"
            >
              <span style={{ fontFamily: monoFont, color: GOLD }} className="text-xl">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span style={{ fontFamily: bodyFont, color: INK }} className="text-[38px] font-bold">
                {spec}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
