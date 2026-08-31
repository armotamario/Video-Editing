import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { bodyFont, headlineFont } from "../fonts";
import type { Slide } from "../slides";

export const SlidePanel: React.FC<{ slide: Slide; durationInFrames: number; index: number; total: number }> = ({
  slide,
  durationInFrames,
  index,
  total,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const kenBurns = interpolate(frame, [0, durationInFrames], [1, 1.05], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const imageIn = spring({ frame, fps, config: { damping: 200 } });
  const textIn = spring({ frame: frame - 6, fps, config: { damping: 200 } });
  const fadeOut = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const src = staticFile(`images/${slide.src}`);

  return (
    <AbsoluteFill className="flex flex-col bg-black" style={{ opacity: fadeOut }}>
      <div className="flex items-center justify-center gap-3 pt-16">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className={`h-2 rounded-full ${i === index ? "w-10 bg-amber-400" : "w-2 bg-white/30"}`} />
        ))}
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center px-12 py-8">
        <div
          style={{
            transform: `scale(${interpolate(imageIn, [0, 1], [0.92, 1]) * kenBurns})`,
            opacity: imageIn,
          }}
          className="flex h-full w-full items-center justify-center overflow-hidden rounded-2xl shadow-[0_30px_100px_rgba(0,0,0,0.55)]"
        >
          <Img src={src} className="max-h-full max-w-full object-contain" />
        </div>
      </div>

      <div className="px-14 pb-20 pt-4">
        <div
          style={{
            transform: `translateY(${interpolate(textIn, [0, 1], [40, 0])}px)`,
            opacity: textIn,
            fontFamily: bodyFont,
          }}
          className="mb-3 text-2xl font-bold uppercase tracking-[0.3em] text-amber-400"
        >
          {slide.kicker}
        </div>
        <div
          style={{
            transform: `translateY(${interpolate(textIn, [0, 1], [50, 0])}px)`,
            opacity: textIn,
            fontFamily: headlineFont,
          }}
          className="text-6xl leading-[1.05] text-white"
        >
          {slide.caption}
        </div>
      </div>
    </AbsoluteFill>
  );
};
