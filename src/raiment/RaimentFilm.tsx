import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { ColourFlip, FLIP_DURATION } from "./ColourFlip";
import { Craft } from "./Craft";
import { Creed } from "./Creed";
import { Definition } from "./Definition";
import { Outro } from "./Outro";
import { PAGE_BG } from "../theme";

export const DEFINITION_DURATION = 100;
export const CREED_DURATION = 75;
export const CRAFT_DURATION = 150;
export const OUTRO_DURATION = 75;

export const RAIMENT_TOTAL_DURATION =
  DEFINITION_DURATION + CREED_DURATION + CRAFT_DURATION + FLIP_DURATION + OUTRO_DURATION;

const CREED_START = DEFINITION_DURATION;
const CRAFT_START = CREED_START + CREED_DURATION;
const FLIP_START = CRAFT_START + CRAFT_DURATION;
const OUTRO_START = FLIP_START + FLIP_DURATION;

export const RaimentFilm: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: PAGE_BG }}>
      <Audio src={staticFile("audio/raiment-theme.wav")} />

      <Sequence durationInFrames={DEFINITION_DURATION}>
        <Definition durationInFrames={DEFINITION_DURATION} />
      </Sequence>

      <Sequence from={CREED_START} durationInFrames={CREED_DURATION}>
        <Creed durationInFrames={CREED_DURATION} />
      </Sequence>

      <Sequence from={CRAFT_START} durationInFrames={CRAFT_DURATION}>
        <Craft durationInFrames={CRAFT_DURATION} />
      </Sequence>

      <Sequence from={FLIP_START} durationInFrames={FLIP_DURATION}>
        <ColourFlip />
      </Sequence>

      <Sequence from={OUTRO_START} durationInFrames={OUTRO_DURATION}>
        <Outro />
      </Sequence>
    </AbsoluteFill>
  );
};
