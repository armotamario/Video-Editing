import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { bodyFont, headlineFont } from "../fonts";
import { ACCENT, INK, INK_SOFT, PAGE_BG } from "../mfba/theme";
import { MEAL_ITEMS, MEAL_KICKER, MEAL_TOTAL } from "./copy";

const Chip: React.FC<{ value: string; label: string; opacity: number }> = ({
  value,
  label,
  opacity,
}) => (
  <div
    style={{ opacity, background: "#1b1815" }}
    className="flex-1 rounded-[26px] px-2 py-7 text-center"
  >
    <div style={{ fontFamily: headlineFont, color: ACCENT }} className="text-[64px] leading-none">
      {value}
    </div>
    <div
      style={{ fontFamily: bodyFont, color: INK_SOFT }}
      className="mt-3 text-[22px] font-bold uppercase tracking-[0.22em]"
    >
      {label}
    </div>
  </div>
);

export const MealCard: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const kickerIn = spring({ frame, fps, config: { damping: 200 } });
  const totalIn = spring({ frame: frame - 46, fps, config: { damping: 12, mass: 0.6 } });
  const chipsIn = spring({ frame: frame - 58, fps, config: { damping: 200 } });
  const fadeOut = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      className="justify-center px-20"
      style={{ opacity: fadeOut, background: PAGE_BG }}
    >
      <div
        style={{ opacity: kickerIn, fontFamily: bodyFont, color: INK_SOFT }}
        className="text-[24px] font-bold uppercase tracking-[0.35em]"
      >
        {MEAL_KICKER}
      </div>

      <div className="mt-12">
        {MEAL_ITEMS.map((item, i) => {
          const rowIn = spring({ frame: frame - 8 - i * 10, fps, config: { damping: 18, mass: 0.5 } });
          return (
            <div
              key={item.name}
              style={{
                transform: `translateX(${interpolate(rowIn, [0, 1], [-60, 0])}px)`,
                opacity: rowIn,
                borderBottom: "1px solid #2b2723",
              }}
              className="flex items-center justify-between py-8"
            >
              <div>
                <div
                  style={{ fontFamily: headlineFont, color: INK }}
                  className="text-[62px] leading-none tracking-wide"
                >
                  {item.name}
                </div>
                <div
                  style={{ fontFamily: bodyFont, color: INK_SOFT }}
                  className="mt-3 text-[26px] font-medium"
                >
                  {item.detail}
                </div>
              </div>
              <div
                style={{ fontFamily: headlineFont, color: ACCENT }}
                className="text-[58px] leading-none"
              >
                {item.kcal}
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          transform: `scale(${interpolate(totalIn, [0, 1], [0.82, 1])})`,
          opacity: totalIn,
        }}
        className="mt-14 flex items-end justify-between"
      >
        <div
          style={{ fontFamily: bodyFont, color: INK_SOFT }}
          className="pb-5 text-[26px] font-bold uppercase tracking-[0.3em]"
        >
          Per meal
        </div>
        <div style={{ fontFamily: headlineFont, color: INK }} className="text-[168px] leading-[0.8]">
          {MEAL_TOTAL.kcal}
          <span
            style={{ fontFamily: bodyFont, color: INK_SOFT }}
            className="ml-4 text-[34px] font-bold"
          >
            kcal
          </span>
        </div>
      </div>

      <div className="mt-12 flex gap-5">
        <Chip value={MEAL_TOTAL.p} label="Protein" opacity={chipsIn} />
        <Chip value={MEAL_TOTAL.c} label="Carbs" opacity={chipsIn} />
        <Chip value={MEAL_TOTAL.f} label="Fat" opacity={chipsIn} />
      </div>
    </AbsoluteFill>
  );
};
