import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { bodyFont, headlineFont } from "../fonts";

export const WebsiteReveal: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const kenBurns = interpolate(frame, [0, durationInFrames], [1, 1.06], {
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
      <div className="flex min-h-0 flex-1 items-center justify-center px-10 py-16">
        <div
          style={{ transform: `scale(${interpolate(imageIn, [0, 1], [0.94, 1]) * kenBurns})`, opacity: imageIn }}
          className="flex h-full w-full items-center justify-center overflow-hidden rounded-2xl shadow-[0_30px_100px_rgba(0,0,0,0.55)]"
        >
          <Img src={staticFile("images/website-full.jpg")} className="max-h-full max-w-full object-contain" />
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
