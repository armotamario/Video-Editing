import { getInputProps, interpolate } from "remotion";
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

type QuoteProps = { quote?: string; client?: string; business?: string; result?: string };

/**
 * Layout only — the words come from --props so a real client's quote can be
 * dropped in without touching the design:
 *   npx remotion render WebTestimonial out.mp4 --props='{"quote":"…","client":"…"}'
 */
const props = getInputProps() as QuoteProps;
const QUOTE = props.quote ?? "Add your client's own words here — one or two sentences about what changed after launch.";
const CLIENT = props.client ?? "Client name";
const BUSINESS = props.business ?? "Business, suburb";
const RESULT = props.result ?? "What the site changed for them";

const QuoteCard: React.FC<{ duration: number }> = ({ duration }) => {
  const markIn = useRise(0, 15);
  const quoteIn = useRise(8);
  const nameIn = useRise(30);

  return (
    <Section duration={duration} className="justify-center px-20">
      <div
        style={{ opacity: markIn, fontFamily: serifFont, color: GOLD }}
        className="text-[180px] leading-[0.4]"
      >
        “
      </div>
      <div
        style={{
          transform: `translateY(${interpolate(quoteIn, [0, 1], [40, 0])}px)`,
          opacity: quoteIn,
          fontFamily: serifFont,
          color: INK,
        }}
        className="mt-16 text-[68px] font-bold leading-[1.24] tracking-[-0.02em]"
      >
        {QUOTE}
      </div>

      <div
        style={{
          transform: `translateY(${interpolate(nameIn, [0, 1], [26, 0])}px)`,
          opacity: nameIn,
          borderLeft: `5px solid ${GOLD}`,
        }}
        className="mt-16 pl-9"
      >
        <div style={{ fontFamily: bodyFont, color: INK }} className="text-[38px] font-bold">
          {CLIENT}
        </div>
        <div style={{ fontFamily: monoFont, color: INK_SOFT }} className="mt-3 text-[27px]">
          {BUSINESS}
        </div>
      </div>
    </Section>
  );
};

export const Testimonial: React.FC = () => (
  <Film
    sections={[
      {
        key: "hook",
        duration: 90,
        node: (
          <Section duration={90}>
            <Kicker>Client feedback</Kicker>
            <div className="mt-10">
              <Headline lines={["The part that", "matters is what", "happens after."]} goldIndex={[2]} />
            </div>
            <div className="mt-10">
              <Body delay={24}>Not the design awards. The phone ringing.</Body>
            </div>
          </Section>
        ),
      },
      { key: "quote", duration: 190, node: <QuoteCard duration={190} /> },
      {
        key: "result",
        duration: 105,
        node: (
          <Section duration={105} className="items-center justify-center px-20">
            <Kicker>The result</Kicker>
            <div className="mt-10">
              <Headline lines={[RESULT]} align="center" size={84} goldIndex={[0]} />
            </div>
          </Section>
        ),
      },
      { key: "outro", duration: 95, node: <Outro /> },
    ]}
  />
);
