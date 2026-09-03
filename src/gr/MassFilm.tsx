import { AbsoluteFill, interpolate } from "remotion";
import { bodyFont, monoFont, serifFont } from "../fonts";
import {
  Benefits,
  GOLD,
  INK,
  INK_SOFT,
  Body,
  Cross,
  Film,
  Headline,
  Kicker,
  Outro,
  Proof,
  Section,
  useRise,
  useSectionFade,
} from "./kit";

const CODES = [
  {
    quote: "On Sundays and other holy days of obligation, the faithful are obliged to participate in the Mass.",
    cite: "Latin Code · CIC c. 1247",
  },
  {
    quote: "…are bound to participate in the Divine Liturgy on Sundays and feast days.",
    cite: "Eastern Code · CCEO c. 881 §1",
  },
];

const CodeBlock: React.FC<{ quote: string; cite: string; delay: number }> = ({
  quote,
  cite,
  delay,
}) => {
  const t = useRise(delay, 18);
  return (
    <div
      style={{
        transform: `translateY(${interpolate(t, [0, 1], [34, 0])}px)`,
        opacity: t,
        borderLeft: `5px solid ${GOLD}`,
      }}
      className="mt-10 pl-9"
    >
      <div style={{ fontFamily: bodyFont, color: INK }} className="text-[38px] font-medium leading-snug">
        {quote}
      </div>
      <div
        style={{ fontFamily: monoFont, color: GOLD }}
        className="mt-4 text-[24px] font-bold uppercase tracking-[0.18em]"
      >
        {cite}
      </div>
    </div>
  );
};

/** Both codes of canon law, one after the other, saying the same thing. */
const BothCodes: React.FC<{ duration: number }> = ({ duration }) => {
  const markIn = useRise(0, 15);
  const headIn = useRise(6);
  const fade = useSectionFade(duration, 8);

  return (
    <AbsoluteFill className="justify-center px-20 pb-[60px]" style={{ opacity: fade }}>
      <div style={{ opacity: markIn }} className="flex justify-center">
        <Cross size={46} />
      </div>
      <div
        style={{
          transform: `translateY(${interpolate(headIn, [0, 1], [30, 0])}px)`,
          opacity: headIn,
          fontFamily: serifFont,
          color: INK,
        }}
        className="mt-12 text-center text-[64px] font-bold leading-tight tracking-[-0.02em]"
      >
        Both codes. One obligation.
      </div>

      <div className="mt-14">
        {CODES.map((code, i) => (
          <CodeBlock key={code.cite} quote={code.quote} cite={code.cite} delay={18 + i * 16} />
        ))}
      </div>

      <div
        style={{ opacity: useRise(52), fontFamily: bodyFont, color: INK_SOFT }}
        className="mt-14 text-center text-[28px] font-medium"
      >
        East or West — the Church asks for the same hour.
      </div>
    </AbsoluteFill>
  );
};

export const MassFilm: React.FC = () => (
  <Film
    track="procession"
    palette="graphite"
    sections={[
      {
        key: "hook",
        duration: 85,
        node: (
          <Section duration={85}>
            <Kicker>Sunday</Kicker>
            <div className="mt-10">
              <Headline lines={["One hour.", "Once a week.", "Nothing comes close."]} goldIndex={[2]} />
            </div>
            <div className="mt-10">
              <Body delay={22}>You will not get a better return on sixty minutes.</Body>
            </div>
          </Section>
        ),
      },
      {
        key: "proof-1",
        duration: 80,
        node: (
          <Proof
            duration={80}
            size={64}
            quote="The Eucharist is the source and summit of the Christian life."
            cite="Catechism 1324 · Lumen Gentium 11"
          />
        ),
      },
      { key: "codes", duration: 100, node: <BothCodes duration={100} /> },
      {
        key: "benefits",
        duration: 120,
        node: (
          <Section duration={120}>
            <Kicker>If it's been a while</Kicker>
            <div className="mt-8">
              <Benefits
                start={10}
                step={15}
                points={[
                  { title: "Saturday counts", note: "The vigil Mass fulfils the Sunday obligation." },
                  { title: "Get there early", note: "Five quiet minutes before it starts." },
                  { title: "Confession first", note: "Usually before Mass. You only have to ask." },
                  { title: "Bring one person", note: "The invitation is the hard part, not the hour." },
                ]}
              />
            </div>
          </Section>
        ),
      },
      { key: "outro", duration: 95, node: <Outro cta="Go this Sunday" /> },
    ]}
  />
);
