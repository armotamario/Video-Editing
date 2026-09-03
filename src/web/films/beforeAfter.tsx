import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { BeforeAfter } from "../Frames";
import type { Site } from "../sites";
import { GOLD, INK_SOFT, Section, monoFont, useRise } from "../kit";

/**
 * A single old-site-to-new-site wipe, with the label swapping as the seam
 * crosses the middle of the card.
 */
export const BeforeAfterScene: React.FC<{
  site: Site;
  duration: number;
  wipeStart?: number;
  wipeEnd?: number;
  caption?: string;
  width?: number;
  height?: number;
}> = ({ site, duration, wipeStart = 18, wipeEnd, caption, width = 880, height = 1180 }) => {
  const frame = useCurrentFrame();
  const cardIn = useRise(0, 16);
  const end = wipeEnd ?? duration - 22;
  const progress = interpolate(frame, [wipeStart, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const isAfter = progress > 0.5;

  return (
    <Section duration={duration} className="items-center justify-center">
      <AbsoluteFill className="items-center justify-start pt-[190px]">
        <div
          style={{ opacity: cardIn, fontFamily: monoFont, color: isAfter ? GOLD : INK_SOFT }}
          className="text-[30px] font-bold uppercase tracking-[0.34em]"
        >
          {isAfter ? "After" : "Before"}
        </div>
        {caption ? (
          <div
            style={{ opacity: cardIn, fontFamily: monoFont, color: INK_SOFT }}
            className="mt-4 text-[24px] font-bold tracking-[0.1em]"
          >
            {caption}
          </div>
        ) : null}
      </AbsoluteFill>

      <AbsoluteFill className="items-center justify-center pt-[120px]">
        <div
          style={{
            transform: `translateY(${interpolate(cardIn, [0, 1], [80, 0])}px)`,
            opacity: cardIn,
          }}
        >
          <BeforeAfter site={site} width={width} height={height} progress={progress} />
        </div>
      </AbsoluteFill>
    </Section>
  );
};
