import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { bodyFont, headlineFont } from "../fonts";

// Source composite is 1280x1092. We show a left-aligned 560px-wide slice full-bleed
// (crops the ticker text / right edge of the product card) and slowly pan down to
// reveal STORE + the product card, since the underlying screenshot isn't tall enough
// to fill a 9:16 frame without either cropping or letterboxing — this trades a modest,
// consistent horizontal crop for zero black bars and a "scrolling the real site" reveal.
const SOURCE_W = 1280;
const SOURCE_H = 1092;
const CROP_W = 460;
const SCALE = 1080 / CROP_W;
const DISPLAY_W = SOURCE_W * SCALE;
const DISPLAY_H = SOURCE_H * SCALE;
const PAN_RANGE = DISPLAY_H - 1920;

export const WebsiteReveal: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pan = interpolate(frame, [20, durationInFrames - 20], [0, PAN_RANGE], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const textIn = spring({ frame: frame - 4, fps, config: { damping: 200 } });
  const fadeOut = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill className="overflow-hidden bg-black" style={{ opacity: fadeOut }}>
      <Img
        src={staticFile("images/website-full.jpg")}
        style={{ position: "absolute", top: -pan, left: 0, width: DISPLAY_W, height: DISPLAY_H }}
      />

      <AbsoluteFill className="bg-gradient-to-t from-black/80 via-transparent to-black/50" />

      <AbsoluteFill className="items-start justify-end px-14 pb-20">
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
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
