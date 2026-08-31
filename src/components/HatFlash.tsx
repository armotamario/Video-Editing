import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { bodyFont } from "../fonts";
import type { HatColor } from "../hatColors";

export const HatFlash: React.FC<{ color: HatColor; durationInFrames: number }> = ({ color, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = spring({ frame, fps, config: { damping: 14, mass: 0.5 } });
  const scale = interpolate(pop, [0, 1], [1.08, 1]);
  const labelIn = spring({ frame: frame - 2, fps, config: { damping: 200 } });
  const fadeOut = interpolate(frame, [durationInFrames - 6, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill className="bg-black" style={{ opacity: fadeOut }}>
      <AbsoluteFill style={{ transform: `scale(${scale})`, opacity: pop }}>
        <Img src={staticFile(`images/${color.src}`)} className="h-full w-full object-cover" />
      </AbsoluteFill>

      <AbsoluteFill className="bg-gradient-to-t from-black/70 via-transparent to-transparent" />

      <AbsoluteFill className="items-start justify-end px-14 pb-16">
        <div
          style={{ opacity: labelIn, fontFamily: bodyFont }}
          className="rounded-full border border-amber-400/60 px-6 py-2 text-xl font-bold uppercase tracking-[0.2em] text-amber-400"
        >
          {color.label}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
