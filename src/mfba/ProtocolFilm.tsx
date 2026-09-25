import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { bodyFont, headlineFont } from "../fonts";
import { ArrowMark } from "./ArrowMark";
import { Outro } from "./Outro";
import { ACCENT, INK, INK_SOFT, PAGE_BG } from "./theme";
import { CARDIO, DIET, EVERYDAY, IF_CANT_BE_BOTHERED, LIFESTYLE, WORKOUT } from "./plan";

/**
 * The full training + diet protocol, straight from plan.ts, as a run of
 * typographic stat cards — no b-roll, just the numbers he gave. Silent,
 * same as the two reels it follows.
 */

const TITLE_DURATION = 60;
const TRAINING_A_DURATION = 90;
const TRAINING_B_DURATION = 90;
const EVERYDAY_DURATION = 75;
const CARDIO_DURATION = 70;
const FALLBACK_DURATION = 65;
const DIET_TOTALS_DURATION = 75;
const PROTEIN_DURATION = 70;
const CARBS_DURATION = 70;
const COFFEE_DURATION = 70;
const LIFESTYLE_DURATION = 75;
const SIGNOFF_DURATION = 105;

export const PROTOCOL_DURATION =
  TITLE_DURATION +
  TRAINING_A_DURATION +
  TRAINING_B_DURATION +
  EVERYDAY_DURATION +
  CARDIO_DURATION +
  FALLBACK_DURATION +
  DIET_TOTALS_DURATION +
  PROTEIN_DURATION +
  CARBS_DURATION +
  COFFEE_DURATION +
  LIFESTYLE_DURATION +
  SIGNOFF_DURATION;

/** A label + a short stack of lines, centred, same fade-in/out every card. */
const Card: React.FC<{
  duration: number;
  label?: string;
  lines: string[];
  size?: number;
}> = ({ duration, label, lines, size = 84 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const labelIn = spring({ frame, fps, config: { damping: 200 } });
  const fadeOut = interpolate(frame, [duration - 12, duration], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill className="items-center justify-center px-16" style={{ opacity: fadeOut, background: PAGE_BG }}>
      {label ? (
        <div
          style={{ opacity: labelIn, fontFamily: bodyFont, color: ACCENT }}
          className="mb-8 text-2xl font-bold uppercase tracking-[0.32em]"
        >
          {label}
        </div>
      ) : null}
      <div className="flex flex-col items-center gap-3">
        {lines.map((line, i) => {
          const lineIn = spring({ frame: frame - 6 - i * 6, fps, config: { damping: 200 } });
          return (
            <div
              key={line}
              style={{
                transform: `translateY(${interpolate(lineIn, [0, 1], [26, 0])}px)`,
                opacity: lineIn,
                fontFamily: headlineFont,
                fontSize: size,
                lineHeight: 1.02,
                color: INK,
              }}
              className="text-center tracking-wide"
            >
              {line}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const TitleCard: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const markIn = spring({ frame, fps, config: { damping: 12, mass: 0.6 } });
  const subIn = spring({ frame: frame - 14, fps, config: { damping: 200 } });
  const fadeOut = interpolate(frame, [duration - 12, duration], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill className="items-center justify-center" style={{ opacity: fadeOut, background: PAGE_BG }}>
      <div style={{ transform: `scale(${interpolate(markIn, [0, 1], [0.6, 1])})`, opacity: markIn }} className="mb-8">
        <ArrowMark size={110} />
      </div>
      <div
        style={{ opacity: markIn, fontFamily: headlineFont, color: INK }}
        className="text-[92px] leading-none tracking-wide"
      >
        The Protocol
      </div>
      <div
        style={{ opacity: subIn, fontFamily: bodyFont, color: INK_SOFT }}
        className="mt-5 text-2xl font-bold uppercase tracking-[0.28em]"
      >
        Training + Diet
      </div>
    </AbsoluteFill>
  );
};

export const ProtocolFilm: React.FC = () => {
  let at = 0;
  const from = (d: number) => {
    const start = at;
    at += d;
    return start;
  };

  const titleFrom = from(TITLE_DURATION);
  const trainingAFrom = from(TRAINING_A_DURATION);
  const trainingBFrom = from(TRAINING_B_DURATION);
  const everydayFrom = from(EVERYDAY_DURATION);
  const cardioFrom = from(CARDIO_DURATION);
  const fallbackFrom = from(FALLBACK_DURATION);
  const dietFrom = from(DIET_TOTALS_DURATION);
  const proteinFrom = from(PROTEIN_DURATION);
  const carbsFrom = from(CARBS_DURATION);
  const coffeeFrom = from(COFFEE_DURATION);
  const lifestyleFrom = from(LIFESTYLE_DURATION);
  const outroFrom = at;

  return (
    <AbsoluteFill style={{ background: PAGE_BG }}>
      <Sequence from={titleFrom} durationInFrames={TITLE_DURATION}>
        <TitleCard duration={TITLE_DURATION} />
      </Sequence>

      <Sequence from={trainingAFrom} durationInFrames={TRAINING_A_DURATION}>
        <Card
          duration={TRAINING_A_DURATION}
          label="Training — Day A"
          size={68}
          lines={WORKOUT.slice(0, 4).map((w) => `${w.move} — ${w.load}`)}
        />
      </Sequence>

      <Sequence from={trainingBFrom} durationInFrames={TRAINING_B_DURATION}>
        <Card
          duration={TRAINING_B_DURATION}
          label="Training — Day B"
          size={68}
          lines={WORKOUT.slice(4, 8).map((w) => `${w.move} — ${w.load}`)}
        />
      </Sequence>

      <Sequence from={everydayFrom} durationInFrames={EVERYDAY_DURATION}>
        <Card
          duration={EVERYDAY_DURATION}
          label="Every single day"
          lines={EVERYDAY.map((e) => `${e.reps} ${e.move}`)}
        />
      </Sequence>

      <Sequence from={cardioFrom} durationInFrames={CARDIO_DURATION}>
        <Card duration={CARDIO_DURATION} label="Cardio" lines={[CARDIO, "No days off."]} />
      </Sequence>

      <Sequence from={fallbackFrom} durationInFrames={FALLBACK_DURATION}>
        <Card
          duration={FALLBACK_DURATION}
          label="Can't be bothered?"
          size={70}
          lines={[IF_CANT_BE_BOTHERED]}
        />
      </Sequence>

      <Sequence from={dietFrom} durationInFrames={DIET_TOTALS_DURATION}>
        <Card
          duration={DIET_TOTALS_DURATION}
          label="Diet — every day"
          lines={[
            `${DIET.dailyCalories} calories`,
            `${DIET.dailyProteinG}g protein`,
            `${DIET.dailyCarbsG}g carbs`,
          ]}
        />
      </Sequence>

      <Sequence from={proteinFrom} durationInFrames={PROTEIN_DURATION}>
        <Card duration={PROTEIN_DURATION} label="Protein" lines={[DIET.protein.source]} size={66} />
      </Sequence>

      <Sequence from={carbsFrom} durationInFrames={CARBS_DURATION}>
        <Card duration={CARBS_DURATION} label="Carbs" lines={[DIET.carbs.source]} size={66} />
      </Sequence>

      <Sequence from={coffeeFrom} durationInFrames={COFFEE_DURATION}>
        <Card
          duration={COFFEE_DURATION}
          label="Coffee"
          lines={[`${DIET.coffee.timesPerDay}x a day.`, "Extra foam.", "Zero sugar."]}
        />
      </Sequence>

      <Sequence from={lifestyleFrom} durationInFrames={LIFESTYLE_DURATION}>
        <Card duration={LIFESTYLE_DURATION} label="Non-negotiable" lines={[...LIFESTYLE]} size={72} />
      </Sequence>

      <Sequence from={outroFrom} durationInFrames={SIGNOFF_DURATION}>
        <Outro />
      </Sequence>
    </AbsoluteFill>
  );
};
