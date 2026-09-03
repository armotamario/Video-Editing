import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SiteCard } from "../Frames";
import { SITES } from "../sites";
import {
  Body,
  Film,
  GOLD,
  INK,
  INK_SOFT,
  Headline,
  Kicker,
  Outro,
  Section,
  bodyFont,
  monoFont,
  serifFont,
  useRise,
} from "../kit";

const CARD_W = 880;
const CARD_H = 1100;
const CARD_TOP = 500;
const CARD_LEFT = (1080 - CARD_W) / 2;
/** The site is laid out at 1200px and scaled into the card. */
const S = CARD_W / 1200;

/** Regions of the homepage, in the site's own design pixels. */
const STEPS = [
  { top: 0, height: 105, title: "Who you are", note: "Your name, and the way to book, always in reach." },
  { top: 190, height: 400, title: "One promise", note: "A headline a stranger understands instantly." },
  { top: 735, height: 100, title: "One action", note: "The button you actually want pressed." },
  { top: 1255, height: 115, title: "What it costs", note: "Prices up front build trust before contact." },
];

const STEP_FRAMES = 48;

const Spotlight: React.FC<{ index: number }> = ({ index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const step = STEPS[index];
  const prev = STEPS[Math.max(0, index - 1)];
  const move = spring({ frame, fps, config: { damping: 200 } });
  const top = interpolate(move, [0, 1], [prev.top, step.top]) * S;
  const height = interpolate(move, [0, 1], [prev.height, step.height]) * S;
  const textIn = spring({ frame: frame - 6, fps, config: { damping: 18, mass: 0.5 } });

  return (
    <>
      <div
        style={{ left: CARD_LEFT, top: CARD_TOP, width: CARD_W, height: CARD_H }}
        className="absolute overflow-hidden rounded-[28px]"
      >
        <div
          style={{
            top,
            height,
            border: `3px solid ${GOLD}`,
            boxShadow: "0 0 0 9999px rgba(6,5,4,0.8)",
          }}
          className="absolute inset-x-3 rounded-[14px]"
        />
      </div>

      <div
        style={{
          top: 190,
          transform: `translateY(${interpolate(textIn, [0, 1], [26, 0])}px)`,
          opacity: textIn,
        }}
        className="absolute inset-x-0 px-20"
      >
        <div
          style={{ fontFamily: monoFont, color: GOLD }}
          className="text-[24px] font-bold uppercase tracking-[0.32em]"
        >
          {String(index + 1).padStart(2, "0")} · Above the fold
        </div>
        <div
          style={{ fontFamily: serifFont, color: INK }}
          className="mt-5 text-[80px] font-bold leading-none tracking-[-0.02em]"
        >
          {step.title}
        </div>
        <div style={{ fontFamily: bodyFont, color: INK_SOFT }} className="mt-5 text-[31px] font-medium">
          {step.note}
        </div>
      </div>
    </>
  );
};

const Anatomy: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const cardIn = useRise(0, 16);
  const index = Math.min(Math.floor(frame / STEP_FRAMES), STEPS.length - 1);

  return (
    <Section duration={duration} className="">
      <div
        style={{
          left: CARD_LEFT,
          top: CARD_TOP,
          transform: `translateY(${interpolate(cardIn, [0, 1], [70, 0])}px)`,
          opacity: cardIn,
        }}
        className="absolute"
      >
        <SiteCard site={SITES.trade} width={CARD_W} height={CARD_H} />
      </div>
      <AbsoluteFill>
        <Spotlight index={index} />
      </AbsoluteFill>
    </Section>
  );
};

export const Homepage: React.FC = () => (
  <Film
    track="minimal"
    palette="graphite"
    sections={[
      {
        key: "hook",
        duration: 90,
        node: (
          <Section duration={90}>
            <Kicker>Homepage design</Kicker>
            <div className="mt-10">
              <Headline lines={["Four things", "have to land", "above the fold."]} goldIndex={[1]} />
            </div>
            <div className="mt-10">
              <Body delay={24}>Everything below is a bonus. This is the part that decides.</Body>
            </div>
          </Section>
        ),
      },
      { key: "anatomy", duration: 200, node: <Anatomy duration={200} /> },
      {
        key: "payoff",
        duration: 95,
        node: (
          <Section duration={95} className="items-center justify-center px-20">
            <Headline
              lines={["If a stranger can't", "tell what you do,", "the homepage failed."]}
              goldIndex={[2]}
              align="center"
              size={92}
            />
          </Section>
        ),
      },
      { key: "outro", duration: 95, node: <Outro /> },
    ]}
  />
);
