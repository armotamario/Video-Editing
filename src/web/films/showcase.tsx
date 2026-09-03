import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { SiteCard } from "../Frames";
import type { Site } from "../sites";
import { GOLD, INK_SOFT, Section, monoFont, useRise } from "../kit";

/** One site presented on the canvas: label above, card easing in and scrolling. */
export const SiteShowcase: React.FC<{
  site: Site;
  duration: number;
  label: string;
  scrollTo?: number;
}> = ({ site, duration, label, scrollTo = 0.55 }) => {
  const frame = useCurrentFrame();
  const cardIn = useRise(0, 16);
  const scroll = interpolate(frame, [12, duration - 6], [0, scrollTo], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Section duration={duration} className="items-center justify-center">
      <AbsoluteFill className="items-center justify-start pt-[190px]">
        <div
          style={{ opacity: cardIn, fontFamily: monoFont, color: GOLD }}
          className="text-[27px] font-bold uppercase tracking-[0.34em]"
        >
          {label}
        </div>
        <div
          style={{ opacity: cardIn, fontFamily: monoFont, color: INK_SOFT }}
          className="mt-4 text-[24px] font-bold tracking-[0.1em]"
        >
          {site.name.toLowerCase().replace(/[^a-z]/g, "")}.com.au
        </div>
      </AbsoluteFill>

      <AbsoluteFill className="items-center justify-center pt-[120px]">
        <div
          style={{
            transform: `translateY(${interpolate(cardIn, [0, 1], [90, 0])}px) scale(${interpolate(
              cardIn,
              [0, 1],
              [0.92, 1],
            )})`,
            opacity: cardIn,
          }}
        >
          <SiteCard site={site} width={880} height={1180} scroll={scroll} />
        </div>
      </AbsoluteFill>
    </Section>
  );
};
