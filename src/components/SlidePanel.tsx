import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { headlineFont, bodyFont } from "../fonts";
import type { Slide } from "../slides";

export const SlidePanel: React.FC<{ slide: Slide; durationInFrames: number; index: number; total: number }> = ({
  slide,
  durationInFrames,
  index,
  total,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const kenBurns = interpolate(frame, [0, durationInFrames], [1, 1.18], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const drift = interpolate(frame, [0, durationInFrames], [0, index % 2 === 0 ? -24 : 24], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const textIn = spring({ frame: frame - 6, fps, config: { damping: 200 } });
  const fadeOut = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill className="bg-black" style={{ opacity: fadeOut }}>
      <AbsoluteFill style={{ transform: `scale(${kenBurns}) translateY(${drift}px)` }}>
        {slide.hasImage ? (
          <Img src={staticFile(`images/${slide.src}`)} className="h-full w-full object-cover" />
        ) : (
          <AbsoluteFill className="items-center justify-center bg-gradient-to-br from-neutral-900 via-neutral-800 to-black">
            <div className="mx-16 flex flex-col items-center gap-6 rounded-3xl border-2 border-dashed border-amber-400/40 px-10 py-16 text-center">
              <div className="text-7xl">📸</div>
              <div style={{ fontFamily: bodyFont }} className="text-2xl font-semibold uppercase tracking-wide text-amber-300">
                Add screenshot
              </div>
              <div style={{ fontFamily: bodyFont }} className="text-xl text-neutral-300">
                {slide.label}
              </div>
              <div style={{ fontFamily: bodyFont }} className="text-base text-neutral-500">
                public/images/{slide.src}
              </div>
            </div>
          </AbsoluteFill>
        )}
      </AbsoluteFill>

      <AbsoluteFill className="bg-gradient-to-t from-black/85 via-black/10 to-black/40" />

      <AbsoluteFill className="items-start justify-end px-14 pb-28">
        <div
          style={{
            transform: `translateY(${interpolate(textIn, [0, 1], [60, 0])}px)`,
            opacity: textIn,
            fontFamily: bodyFont,
          }}
          className="mb-3 text-2xl font-bold uppercase tracking-[0.3em] text-amber-400"
        >
          {slide.kicker}
        </div>
        <div
          style={{
            transform: `translateY(${interpolate(textIn, [0, 1], [80, 0])}px)`,
            opacity: textIn,
            fontFamily: headlineFont,
          }}
          className="text-6xl leading-[1.05] text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]"
        >
          {slide.caption}
        </div>
      </AbsoluteFill>

      <AbsoluteFill className="items-center justify-start pt-16">
        <div className="flex gap-3">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full ${i === index ? "w-10 bg-amber-400" : "w-2 bg-white/40"}`}
            />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
