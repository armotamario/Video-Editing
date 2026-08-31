import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { bodyFont } from "../fonts";
import { GOLD, PAGE_BG } from "../theme";
import type { HatColor } from "../hatColors";

export const HatFlash: React.FC<{ color: HatColor; durationInFrames: number }> = ({ color, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = spring({ frame, fps, config: { damping: 14, mass: 0.5 } });
  const scale = interpolate(pop, [0, 1], [0.94, 1]);
  const labelIn = spring({ frame: frame - 2, fps, config: { damping: 200 } });
  const fadeOut = interpolate(frame, [durationInFrames - 6, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill className="items-center justify-center px-20 py-52" style={{ opacity: fadeOut, background: PAGE_BG }}>
      <div style={{ transform: `scale(${scale})`, opacity: pop }} className="flex h-full w-full items-center justify-center">
        <Img src={staticFile(`images/${color.src}`)} className="h-full w-full object-contain" />
      </div>

      <AbsoluteFill className="items-center justify-end pb-16">
        <div
          style={{ opacity: labelIn, fontFamily: bodyFont, color: GOLD, border: `1px solid ${GOLD}66` }}
          className="rounded-full px-6 py-2 text-xl font-bold uppercase tracking-[0.2em]"
        >
          {color.label}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
