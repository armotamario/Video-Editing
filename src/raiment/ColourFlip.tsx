import { AbsoluteFill, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { bodyFont, monoFont } from "../fonts";
import { GOLD, INK, PAGE_BG } from "../theme";
import { hatColors } from "../hatColors";
import { FLIP_KICKER } from "./copy";

const PER_COLOUR = 13;
export const FLIP_DURATION = hatColors.length * PER_COLOUR;

const Frame: React.FC<{ src: string; label: string }> = ({ src, label }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 18, mass: 0.4 } });

  return (
    <AbsoluteFill className="items-center justify-center px-24 pb-40 pt-56">
      <div style={{ transform: `scale(${interpolate(pop, [0, 1], [0.97, 1])})` }} className="flex h-full w-full items-center justify-center">
        <Img src={staticFile(`images/${src}`)} className="h-full w-full object-contain" />
      </div>
      <AbsoluteFill className="items-center justify-end pb-24">
        <div style={{ fontFamily: bodyFont, color: INK }} className="text-3xl font-bold uppercase tracking-[0.25em]">
          {label}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const ColourFlip: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const kickerIn = spring({ frame, fps, config: { damping: 200 } });
  const fadeOut = interpolate(frame, [FLIP_DURATION - 10, FLIP_DURATION], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: fadeOut, background: PAGE_BG }}>
      {hatColors.map((colour, i) => (
        <Sequence key={colour.src} from={i * PER_COLOUR} durationInFrames={PER_COLOUR}>
          <Frame src={colour.src} label={colour.label} />
        </Sequence>
      ))}

      <AbsoluteFill className="items-center justify-start pt-24" style={{ opacity: kickerIn }}>
        <div style={{ fontFamily: monoFont, color: GOLD }} className="text-xl uppercase tracking-[0.4em]">
          {FLIP_KICKER}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
