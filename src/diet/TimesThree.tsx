import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { bodyFont, headlineFont } from "../fonts";
import { ACCENT, INK, INK_SOFT, PAGE_BG } from "../mfba/theme";
import {
  MEAL_TOTAL,
  REPEAT_KICKER,
  REPEAT_TOTAL,
  SITTINGS,
  SNACKS,
  SNACKS_TOTAL,
} from "./copy";

export const TimesThree: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const kickerIn = spring({ frame, fps, config: { damping: 200 } });
  const subtotalIn = spring({
    frame: frame - 44,
    fps,
    config: { damping: 12, mass: 0.6 },
  });
  const snacksIn = spring({ frame: frame - 58, fps, config: { damping: 200 } });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 12, durationInFrames],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  return (
    <AbsoluteFill
      className="justify-center px-20"
      style={{ opacity: fadeOut, background: PAGE_BG }}
    >
      <div
        style={{ opacity: kickerIn, fontFamily: bodyFont, color: INK_SOFT }}
        className="text-[24px] font-bold uppercase tracking-[0.35em]"
      >
        {REPEAT_KICKER}
      </div>

      <div className="mt-10 flex flex-col gap-5">
        {SITTINGS.map((sitting, i) => {
          const stamp = spring({
            frame: frame - 6 - i * 11,
            fps,
            config: { damping: 13, mass: 0.5 },
          });
          return (
            <div
              key={sitting}
              style={{
                transform: `scale(${interpolate(stamp, [0, 1], [1.12, 1])})`,
                opacity: stamp,
                background: "#1b1815",
              }}
              className="flex items-stretch overflow-hidden rounded-[26px]"
            >
              <div
                style={{ background: ACCENT }}
                className="w-[10px] flex-none"
              />
              <div className="flex flex-1 items-center justify-between px-11 py-9">
                <div
                  style={{ fontFamily: headlineFont, color: INK }}
                  className="text-[70px] leading-none tracking-wide"
                >
                  {sitting}
                </div>
                <div
                  style={{ fontFamily: bodyFont, color: INK_SOFT }}
                  className="text-[30px] font-bold"
                >
                  Chicken · rice · broccoli
                </div>
                <div
                  style={{ fontFamily: headlineFont, color: ACCENT }}
                  className="text-[62px] leading-none"
                >
                  {MEAL_TOTAL.kcal}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          transform: `scale(${interpolate(subtotalIn, [0, 1], [0.84, 1])})`,
          opacity: subtotalIn,
        }}
        className="mt-14 flex items-end justify-between"
      >
        <div
          style={{ fontFamily: bodyFont, color: INK_SOFT }}
          className="pb-5 text-[26px] font-bold uppercase tracking-[0.3em]"
        >
          Meals
        </div>
        <div
          style={{ fontFamily: headlineFont, color: INK }}
          className="text-[150px] leading-[0.8]"
        >
          {REPEAT_TOTAL}
          <span
            style={{ fontFamily: bodyFont, color: INK_SOFT }}
            className="ml-4 text-[34px] font-bold"
          >
            kcal
          </span>
        </div>
      </div>

      <div style={{ opacity: snacksIn }} className="mt-14">
        <div
          style={{ fontFamily: bodyFont, color: INK_SOFT }}
          className="text-[24px] font-bold uppercase tracking-[0.35em]"
        >
          Plus snacks
        </div>
        <div className="mt-6 flex items-center justify-between">
          <div className="flex flex-wrap gap-4">
            {SNACKS.map((snack) => (
              <div
                key={snack.name}
                style={{
                  background: "#1b1815",
                  fontFamily: bodyFont,
                  color: INK,
                }}
                className="rounded-full px-8 py-4 text-[28px] font-bold"
              >
                {snack.name}
                <span style={{ color: INK_SOFT }} className="ml-3">
                  {snack.kcal}
                </span>
              </div>
            ))}
          </div>
          <div
            style={{ fontFamily: headlineFont, color: ACCENT }}
            className="text-[70px] leading-none"
          >
            {SNACKS_TOTAL}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
