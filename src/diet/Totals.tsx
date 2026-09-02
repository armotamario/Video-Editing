import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { bodyFont, headlineFont } from "../fonts";
import { ACCENT, INK, INK_SOFT, PAGE_BG } from "../mfba/theme";
import { DAY, DAY_GOAL_KCAL, DAY_KCAL, TOTALS_KICKER } from "./copy";

const Chip: React.FC<{ value: string; label: string; delay: number }> = ({
  value,
  label,
  delay,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chipIn = spring({ frame: frame - delay, fps, config: { damping: 16, mass: 0.5 } });

  return (
    <div
      style={{
        transform: `translateY(${interpolate(chipIn, [0, 1], [40, 0])}px)`,
        opacity: chipIn,
        background: "#1b1815",
      }}
      className="flex-1 rounded-[28px] px-2 py-9 text-center"
    >
      <div style={{ fontFamily: headlineFont, color: ACCENT }} className="text-[76px] leading-none">
        {value}
      </div>
      <div
        style={{ fontFamily: bodyFont, color: INK_SOFT }}
        className="mt-3 text-[24px] font-bold uppercase tracking-[0.22em]"
      >
        {label}
      </div>
    </div>
  );
};

export const Totals: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const kickerIn = spring({ frame, fps, config: { damping: 200 } });
  const count = Math.round(
    interpolate(frame, [6, 42], [0, DAY_KCAL], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const barIn = interpolate(frame, [6, 42], [0, DAY_KCAL / DAY_GOAL_KCAL], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const goalIn = spring({ frame: frame - 40, fps, config: { damping: 200 } });
  const fadeOut = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      className="items-center justify-center px-20"
      style={{ opacity: fadeOut, background: PAGE_BG }}
    >
      <div
        style={{ opacity: kickerIn, fontFamily: bodyFont, color: INK_SOFT }}
        className="text-[24px] font-bold uppercase tracking-[0.35em]"
      >
        {TOTALS_KICKER}
      </div>

      <div
        style={{ fontFamily: headlineFont, color: INK }}
        className="mt-10 text-[280px] leading-[0.78]"
      >
        {count.toLocaleString("en-US")}
      </div>
      <div
        style={{ fontFamily: bodyFont, color: INK_SOFT }}
        className="mt-6 text-[34px] font-bold uppercase tracking-[0.3em]"
      >
        Calories
      </div>

      <div
        style={{ background: "#221f1c" }}
        className="mt-14 h-4 w-full overflow-hidden rounded-full"
      >
        <div
          style={{ width: `${barIn * 100}%`, background: ACCENT }}
          className="h-full rounded-full"
        />
      </div>
      <div
        style={{ opacity: goalIn, fontFamily: bodyFont, color: INK_SOFT }}
        className="mt-6 self-end text-[28px] font-bold"
      >
        {DAY.goal} goal
      </div>

      <div className="mt-16 flex w-full gap-5">
        <Chip value={DAY.p} label="Protein" delay={44} />
        <Chip value={DAY.c} label="Carbs" delay={50} />
        <Chip value={DAY.f} label="Fat" delay={56} />
      </div>
    </AbsoluteFill>
  );
};
