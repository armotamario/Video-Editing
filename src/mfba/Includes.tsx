import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { bodyFont, headlineFont } from "../fonts";
import { ACCENT, ACCENT_SOFT, INK, INK_SOFT, PAGE_BG } from "./theme";
import { INCLUDES } from "./brand";

const PER_ITEM = 30;
export const INCLUDES_DURATION = INCLUDES.length * PER_ITEM;

const IncludeCard: React.FC<{ index: number; label: string }> = ({ index, label }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cardIn = spring({ frame, fps, config: { damping: 16, mass: 0.5 } });
  const fadeOut = interpolate(frame, [PER_ITEM - 8, PER_ITEM], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill className="items-center justify-center px-16" style={{ opacity: fadeOut }}>
      <div
        style={{
          transform: `translateY(${interpolate(cardIn, [0, 1], [50, 0])}px)`,
          opacity: cardIn,
          fontFamily: headlineFont,
          color: ACCENT,
        }}
        className="text-[110px] leading-none"
      >
        {String(index + 1).padStart(2, "0")}
      </div>
      <div
        style={{
          transform: `translateY(${interpolate(cardIn, [0, 1], [70, 0])}px)`,
          opacity: cardIn,
          fontFamily: headlineFont,
          color: INK,
        }}
        className="mt-6 text-center text-[92px] leading-[1.0] tracking-wide"
      >
        {label}
      </div>
    </AbsoluteFill>
  );
};

export const Includes: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headerIn = spring({ frame, fps, config: { damping: 200 } });
  const activeIndex = Math.min(Math.floor(frame / PER_ITEM), INCLUDES.length - 1);
  const fadeOut = interpolate(frame, [INCLUDES_DURATION - 12, INCLUDES_DURATION], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: fadeOut, background: PAGE_BG }}>
      {INCLUDES.map((label, index) => (
        <Sequence key={label} from={index * PER_ITEM} durationInFrames={PER_ITEM}>
          <IncludeCard index={index} label={label} />
        </Sequence>
      ))}

      <AbsoluteFill className="items-center justify-start pt-24" style={{ opacity: headerIn }}>
        <div style={{ fontFamily: bodyFont, color: INK_SOFT }} className="text-xl font-bold uppercase tracking-[0.35em]">
          What you get
        </div>
        <div className="mt-6 flex gap-2">
          {INCLUDES.map((label, i) => (
            <div
              key={label}
              style={{ background: i === activeIndex ? ACCENT : ACCENT_SOFT }}
              className={`h-1.5 rounded-full ${i === activeIndex ? "w-10" : "w-4"}`}
            />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
