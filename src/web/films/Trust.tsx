import { interpolate } from "remotion";
import { SiteCard } from "../Frames";
import { SITES } from "../sites";
import {
  Body,
  Film,
  GOLD,
  INK_SOFT,
  Headline,
  Kicker,
  Outro,
  PointList,
  Section,
  monoFont,
  serifFont,
  useRise,
} from "../kit";

const CARD_W = 470;
const CARD_H = 780;

/** The five-second glance test: two versions of the same business, side by side. */
const GlanceTest: React.FC<{ duration: number }> = ({ duration }) => {
  const leftIn = useRise(0, 16);
  const rightIn = useRise(10, 16);
  const askIn = useRise(46);

  return (
    <Section duration={duration} className="items-center justify-center">
      <div
        style={{ opacity: leftIn, fontFamily: monoFont, color: INK_SOFT }}
        className="mb-10 text-[27px] font-bold uppercase tracking-[0.32em]"
      >
        Same plumber · same prices
      </div>

      <div className="flex items-start gap-6">
        <div
          style={{
            transform: `translateY(${interpolate(leftIn, [0, 1], [60, 0])}px)`,
            opacity: leftIn,
          }}
        >
          <SiteCard site={SITES.trade} width={CARD_W} height={CARD_H} dated />
        </div>
        <div
          style={{
            transform: `translateY(${interpolate(rightIn, [0, 1], [60, 0])}px)`,
            opacity: rightIn,
          }}
        >
          <SiteCard site={SITES.trade} width={CARD_W} height={CARD_H} />
        </div>
      </div>

      <div
        style={{
          transform: `translateY(${interpolate(askIn, [0, 1], [30, 0])}px)`,
          opacity: askIn,
          fontFamily: serifFont,
          color: GOLD,
        }}
        className="mt-14 px-16 text-center text-[64px] font-bold leading-tight tracking-[-0.02em]"
      >
        Which one gets the $2,000 job?
      </div>
    </Section>
  );
};

export const Trust: React.FC = () => (
  <Film
    track="cinematic"
    palette="forest"
    sections={[
      {
        key: "hook",
        duration: 95,
        node: (
          <Section duration={95}>
            <Kicker>Trust</Kicker>
            <div className="mt-10">
              <Headline lines={["People decide", "you're legit", "in five seconds."]} goldIndex={[2]} />
            </div>
            <div className="mt-10">
              <Body delay={24}>Long before they read a word about your work.</Body>
            </div>
          </Section>
        ),
      },
      { key: "glance", duration: 165, node: <GlanceTest duration={165} /> },
      {
        key: "how",
        duration: 125,
        node: (
          <Section duration={125}>
            <Kicker>Trust is a design decision</Kicker>
            <div className="mt-10">
              <PointList
                start={12}
                step={16}
                points={[
                  { title: "Real photos", note: "Your shop, your team, your actual work." },
                  { title: "Prices in writing", note: "Nothing signals confidence faster." },
                  { title: "Fast and current", note: "A slow, dated site reads as a closed business." },
                ]}
              />
            </div>
          </Section>
        ),
      },
      { key: "outro", duration: 95, node: <Outro /> },
    ]}
  />
);
