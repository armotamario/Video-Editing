import { AbsoluteFill, Sequence } from "remotion";
import { Intro } from "./components/Intro";
import { Outro } from "./components/Outro";
import { SlidePanel } from "./components/SlidePanel";
import { slides } from "./slides";

export const INTRO_DURATION = 75;
export const SLIDE_DURATION = 90;
export const OUTRO_DURATION = 105;

export const TOTAL_DURATION = INTRO_DURATION + slides.length * SLIDE_DURATION + OUTRO_DURATION;

export const PromoVideo: React.FC = () => {
  return (
    <AbsoluteFill className="bg-black">
      <Sequence durationInFrames={INTRO_DURATION}>
        <Intro durationInFrames={INTRO_DURATION} />
      </Sequence>

      {slides.map((slide, index) => (
        <Sequence key={slide.src} from={INTRO_DURATION + index * SLIDE_DURATION} durationInFrames={SLIDE_DURATION}>
          <SlidePanel slide={slide} durationInFrames={SLIDE_DURATION} index={index} total={slides.length} />
        </Sequence>
      ))}

      <Sequence from={INTRO_DURATION + slides.length * SLIDE_DURATION} durationInFrames={OUTRO_DURATION}>
        <Outro />
      </Sequence>
    </AbsoluteFill>
  );
};
