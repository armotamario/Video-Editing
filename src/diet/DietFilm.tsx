import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Hook } from "./Hook";
import { MealCard } from "./MealCard";
import { Outro } from "./Outro";
import { TimesThree } from "./TimesThree";
import { Totals } from "./Totals";
import { PAGE_BG } from "../mfba/theme";

export const HOOK_DURATION = 75;
export const MEAL_DURATION = 105;
export const REPEAT_DURATION = 105;
export const TOTALS_DURATION = 90;
export const OUTRO_DURATION = 105;

export const DIET_TOTAL_DURATION =
  HOOK_DURATION + MEAL_DURATION + REPEAT_DURATION + TOTALS_DURATION + OUTRO_DURATION;

const MEAL_START = HOOK_DURATION;
const REPEAT_START = MEAL_START + MEAL_DURATION;
const TOTALS_START = REPEAT_START + REPEAT_DURATION;
const OUTRO_START = TOTALS_START + TOTALS_DURATION;

export const DietFilm: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: PAGE_BG }}>
      <Audio src={staticFile("audio/mfba-theme.wav")} />

      <Sequence durationInFrames={HOOK_DURATION}>
        <Hook durationInFrames={HOOK_DURATION} />
      </Sequence>

      <Sequence from={MEAL_START} durationInFrames={MEAL_DURATION}>
        <MealCard durationInFrames={MEAL_DURATION} />
      </Sequence>

      <Sequence from={REPEAT_START} durationInFrames={REPEAT_DURATION}>
        <TimesThree durationInFrames={REPEAT_DURATION} />
      </Sequence>

      <Sequence from={TOTALS_START} durationInFrames={TOTALS_DURATION}>
        <Totals durationInFrames={TOTALS_DURATION} />
      </Sequence>

      <Sequence from={OUTRO_START} durationInFrames={OUTRO_DURATION}>
        <Outro />
      </Sequence>
    </AbsoluteFill>
  );
};
