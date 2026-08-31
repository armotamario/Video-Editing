import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Includes, INCLUDES_DURATION } from "./Includes";
import { Intro } from "./Intro";
import { Offer } from "./Offer";
import { Outro } from "./Outro";
import { Statement } from "./Statement";
import { PAGE_BG } from "./theme";

export const INTRO_DURATION = 75;
export const STATEMENT_DURATION = 90;
export const OFFER_DURATION = 90;
export const OUTRO_DURATION = 105;

export const MFBA_TOTAL_DURATION =
  INTRO_DURATION + STATEMENT_DURATION + INCLUDES_DURATION + OFFER_DURATION + OUTRO_DURATION;

const STATEMENT_START = INTRO_DURATION;
const INCLUDES_START = STATEMENT_START + STATEMENT_DURATION;
const OFFER_START = INCLUDES_START + INCLUDES_DURATION;
const OUTRO_START = OFFER_START + OFFER_DURATION;

export const MfbaPromo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: PAGE_BG }}>
      <Audio src={staticFile("audio/mfba-theme.wav")} />

      <Sequence durationInFrames={INTRO_DURATION}>
        <Intro durationInFrames={INTRO_DURATION} />
      </Sequence>

      <Sequence from={STATEMENT_START} durationInFrames={STATEMENT_DURATION}>
        <Statement durationInFrames={STATEMENT_DURATION} />
      </Sequence>

      <Sequence from={INCLUDES_START} durationInFrames={INCLUDES_DURATION}>
        <Includes />
      </Sequence>

      <Sequence from={OFFER_START} durationInFrames={OFFER_DURATION}>
        <Offer durationInFrames={OFFER_DURATION} />
      </Sequence>

      <Sequence from={OUTRO_START} durationInFrames={OUTRO_DURATION}>
        <Outro />
      </Sequence>
    </AbsoluteFill>
  );
};
