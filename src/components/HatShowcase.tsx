import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { bodyFont, headlineFont } from "../fonts";
import { GOLD, INK } from "../theme";
import { hatColors } from "../hatColors";
import { HatFlash } from "./HatFlash";

const PER_COLOR = 24;

export const HAT_SHOWCASE_DURATION = hatColors.length * PER_COLOR;

export const HatShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerIn = spring({ frame, fps, config: { damping: 200 } });
  const fadeOut = interpolate(frame, [HAT_SHOWCASE_DURATION - 12, HAT_SHOWCASE_DURATION], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const activeIndex = Math.min(Math.floor(frame / PER_COLOR), hatColors.length - 1);

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      {hatColors.map((color, index) => (
        <Sequence key={color.src} from={index * PER_COLOR} durationInFrames={PER_COLOR}>
          <HatFlash color={color} durationInFrames={PER_COLOR} />
        </Sequence>
      ))}

      <AbsoluteFill className="items-center justify-start pt-16" style={{ opacity: headerIn }}>
        <div style={{ fontFamily: bodyFont, color: GOLD }} className="mb-2 text-xl font-bold uppercase tracking-[0.3em]">
          Every Colorway
        </div>
        <div style={{ fontFamily: headlineFont, color: INK }} className="text-4xl">
          Crafted With Purpose
        </div>
        <div className="mt-6 flex gap-2">
          {hatColors.map((color, i) => (
            <div
              key={color.src}
              style={{ background: i === activeIndex ? GOLD : `${INK}33` }}
              className={`h-1.5 rounded-full ${i === activeIndex ? "w-8" : "w-1.5"}`}
            />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
