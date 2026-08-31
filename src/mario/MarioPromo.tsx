import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Facts, FACTS_DURATION } from "./Facts";
import { Hook } from "./Hook";
import { Intro } from "./Intro";
import { Outro } from "./Outro";
import { Pitch } from "./Pitch";
import { PAGE_BG } from "./theme";

export const INTRO_DURATION = 75;
export const HOOK_DURATION = 90;
export const PITCH_DURATION = 90;
export const OUTRO_DURATION = 105;

export const MARIO_TOTAL_DURATION =
  INTRO_DURATION + HOOK_DURATION + FACTS_DURATION + PITCH_DURATION + OUTRO_DURATION;

const HOOK_START = INTRO_DURATION;
const FACTS_START = HOOK_START + HOOK_DURATION;
const PITCH_START = FACTS_START + FACTS_DURATION;
const OUTRO_START = PITCH_START + PITCH_DURATION;

export const MarioPromo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: PAGE_BG }}>
      <Audio src={staticFile("audio/mario-theme.wav")} />

      <Sequence durationInFrames={INTRO_DURATION}>
        <Intro durationInFrames={INTRO_DURATION} />
      </Sequence>

      <Sequence from={HOOK_START} durationInFrames={HOOK_DURATION}>
        <Hook durationInFrames={HOOK_DURATION} />
      </Sequence>

      <Sequence from={FACTS_START} durationInFrames={FACTS_DURATION}>
        <Facts />
      </Sequence>

      <Sequence from={PITCH_START} durationInFrames={PITCH_DURATION}>
        <Pitch durationInFrames={PITCH_DURATION} />
      </Sequence>

      <Sequence from={OUTRO_START} durationInFrames={OUTRO_DURATION}>
        <Outro />
      </Sequence>
    </AbsoluteFill>
  );
};
