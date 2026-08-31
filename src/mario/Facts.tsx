import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { monoFont, serifFont } from "../fonts";
import { GOLD, GOLD_SOFT, INK, INK_SOFT, PAGE_BG } from "./theme";
import { FACTS } from "./brand";

export const FACTS_DURATION = 120;

export const Facts: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerIn = spring({ frame, fps, config: { damping: 200 } });
  const fadeOut = interpolate(frame, [FACTS_DURATION - 12, FACTS_DURATION], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill className="justify-center px-16" style={{ opacity: fadeOut, background: PAGE_BG }}>
      <div
        style={{ opacity: headerIn, fontFamily: monoFont, color: GOLD }}
        className="mb-16 text-xl uppercase tracking-[0.45em]"
      >
        How I work
      </div>

      {FACTS.map((fact, i) => {
        const rowIn = spring({ frame: frame - 8 - i * 16, fps, config: { damping: 200 } });
        return (
          <div
            key={fact}
            style={{
              transform: `translateY(${interpolate(rowIn, [0, 1], [40, 0])}px)`,
              opacity: rowIn,
              borderBottom: `1px solid ${GOLD_SOFT}`,
            }}
            className="flex items-baseline gap-8 py-8"
          >
            <span style={{ fontFamily: monoFont, color: GOLD }} className="text-3xl">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span style={{ fontFamily: serifFont, color: INK }} className="text-[62px] leading-none">
              {fact}
            </span>
          </div>
        );
      })}

      <div
        style={{ opacity: headerIn, fontFamily: monoFont, color: INK_SOFT }}
        className="mt-14 text-2xl"
      >
        marioarmota.com.au
      </div>
    </AbsoluteFill>
  );
};
