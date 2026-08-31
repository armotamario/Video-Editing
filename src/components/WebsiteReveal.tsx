import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { bodyFont } from "../fonts";
import { Marquee } from "./Marquee";

// The store page itself is white, and dropping a white screenshot onto the black
// canvas reads as a floating box — so the store row is rebuilt natively in the
// video's dark theme instead: the real scrolling hero, the STORE heading, and the
// product with its real name and price, on the cut-out product shot.
export const WebsiteReveal: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const kenBurns = interpolate(frame, [0, durationInFrames], [1, 1.05], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const headingIn = spring({ frame: frame - 2, fps, config: { damping: 200 } });
  const productIn = spring({ frame: frame - 8, fps, config: { damping: 200 } });
  const priceIn = spring({ frame: frame - 16, fps, config: { damping: 200 } });
  const fadeOut = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill className="flex flex-col bg-black" style={{ opacity: fadeOut }}>
      <div className="flex h-[280px] items-center">
        <Marquee />
      </div>

      <div
        style={{
          transform: `translateY(${interpolate(headingIn, [0, 1], [30, 0])}px)`,
          opacity: headingIn,
          fontFamily: bodyFont,
        }}
        className="px-14 text-6xl font-black tracking-tight text-white"
      >
        STORE
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center px-24 py-6">
        <Img
          src={staticFile("images/hat-black.png")}
          style={{ transform: `scale(${interpolate(productIn, [0, 1], [0.94, 1]) * kenBurns})`, opacity: productIn }}
          className="h-full w-full object-contain"
        />
      </div>

      <div className="px-14 pb-24 text-center" style={{ opacity: priceIn }}>
        <div style={{ fontFamily: bodyFont }} className="text-4xl font-bold tracking-tight text-white">
          GODLY RAIMENT HAT
        </div>
        <div style={{ fontFamily: bodyFont }} className="mt-4 text-3xl font-bold text-amber-400">
          $28.95
        </div>
      </div>
    </AbsoluteFill>
  );
};
