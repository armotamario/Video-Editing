import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { bodyFont, headlineFont } from "../fonts";
import { Marquee } from "./Marquee";

export const WebsiteReveal: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const kenBurns = interpolate(frame, [0, durationInFrames], [1, 1.05], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const imageIn = spring({ frame, fps, config: { damping: 200 } });
  const textIn = spring({ frame: frame - 4, fps, config: { damping: 200 } });
  const fadeOut = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill className="flex flex-col bg-black" style={{ opacity: fadeOut }}>
      <div className="flex h-[300px] items-center">
        <Marquee />
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center px-10 pb-8">
        <div style={{ transform: `scale(${interpolate(imageIn, [0, 1], [0.94, 1]) * kenBurns})`, opacity: imageIn }}>
          <Img src={staticFile("images/store-section.jpg")} className="max-h-full max-w-full object-contain" />
        </div>
      </div>

      <div className="px-14 pb-16 pt-2">
        <div
          style={{
            transform: `translateY(${interpolate(textIn, [0, 1], [40, 0])}px)`,
            opacity: textIn,
            fontFamily: bodyFont,
          }}
          className="mb-3 text-2xl font-bold uppercase tracking-[0.3em] text-amber-400"
        >
          The Website
        </div>
        <div
          style={{
            transform: `translateY(${interpolate(textIn, [0, 1], [50, 0])}px)`,
            opacity: textIn,
            fontFamily: headlineFont,
          }}
          className="text-6xl leading-[1.05] text-white"
        >
          Shop The Drop
        </div>
      </div>
    </AbsoluteFill>
  );
};
