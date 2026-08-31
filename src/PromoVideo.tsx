import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { PAGE_BG } from "./theme";
import { HatShowcase, HAT_SHOWCASE_DURATION } from "./components/HatShowcase";
import { Intro } from "./components/Intro";
import { Outro } from "./components/Outro";
import { WebsiteReveal } from "./components/WebsiteReveal";

export const INTRO_DURATION = 75;
export const WEBSITE_DURATION = 120;
export const OUTRO_DURATION = 105;

export const TOTAL_DURATION = INTRO_DURATION + WEBSITE_DURATION + HAT_SHOWCASE_DURATION + OUTRO_DURATION;

const HAT_SHOWCASE_START = INTRO_DURATION + WEBSITE_DURATION;
const OUTRO_START = HAT_SHOWCASE_START + HAT_SHOWCASE_DURATION;

export const PromoVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: PAGE_BG }}>
      <Audio src={staticFile("audio/promo-theme.wav")} />

      <Sequence durationInFrames={INTRO_DURATION}>
        <Intro durationInFrames={INTRO_DURATION} />
      </Sequence>

      <Sequence from={INTRO_DURATION} durationInFrames={WEBSITE_DURATION}>
        <WebsiteReveal durationInFrames={WEBSITE_DURATION} />
      </Sequence>

      <Sequence from={HAT_SHOWCASE_START} durationInFrames={HAT_SHOWCASE_DURATION}>
        <HatShowcase />
      </Sequence>

      <Sequence from={OUTRO_START} durationInFrames={OUTRO_DURATION}>
        <Outro />
      </Sequence>
    </AbsoluteFill>
  );
};
