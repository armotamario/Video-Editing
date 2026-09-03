import { AbsoluteFill, Sequence, interpolate } from "remotion";
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
  useSectionFade,
} from "../kit";

/**
 * Real client words, quoted verbatim and only trimmed — the first from an
 * Instagram business chat, the second from LinkedIn.
 */
const SOCHIC = [
  "Professional, responsive, and clearly passionate about helping businesses strengthen their online presence.",
  "His attention to detail and willingness to go the extra mile were evident.",
  "I would recommend him to businesses looking for website support and optimisation.",
];
const SOCHIC_BY = "@thesochiclite";
const SOCHIC_NOTE = "Website review & improvements";

const AYAH =
  "Thank you so much for the pointers and advice regarding my LinkedIn profile. I really appreciate your guidance and the time you took to help me.";
const AYAH_BY = "Ayah";
const AYAH_NOTE = "LinkedIn profile guidance";

const PER_BEAT = 70;

const QuoteCard: React.FC<{
  text: string;
  by: string;
  note: string;
  duration: number;
  size?: number;
}> = ({ text, by, note, duration, size = 66 }) => {
  const markIn = useRise(0, 15);
  const textIn = useRise(6);
  const byIn = useRise(18);
  const fade = useSectionFade(duration, 8);

  return (
    <AbsoluteFill className="justify-center px-20 pb-[120px]" style={{ opacity: fade }}>
      <div
        style={{ opacity: markIn, fontFamily: serifFont, color: GOLD }}
        className="text-[170px] leading-[0.4]"
      >
        “
      </div>
      <div
        style={{
          transform: `translateY(${interpolate(textIn, [0, 1], [38, 0])}px)`,
          opacity: textIn,
          fontFamily: serifFont,
          color: INK,
          fontSize: size,
        }}
        className="mt-16 font-bold leading-[1.26] tracking-[-0.02em]"
      >
        {text}
      </div>

      <div
        style={{
          transform: `translateY(${interpolate(byIn, [0, 1], [24, 0])}px)`,
          opacity: byIn,
          borderLeft: `5px solid ${GOLD}`,
        }}
        className="mt-14 pl-9"
      >
        <div style={{ fontFamily: bodyFont, color: INK }} className="text-[38px] font-bold">
          {by}
        </div>
        <div style={{ fontFamily: monoFont, color: INK_SOFT }} className="mt-3 text-[26px]">
          {note}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const SoChic: React.FC<{ duration: number }> = ({ duration }) => (
  <Section duration={duration} className="">
    {SOCHIC.map((text, i) => (
      <Sequence key={text} from={i * PER_BEAT} durationInFrames={PER_BEAT}>
        <QuoteCard text={text} by={SOCHIC_BY} note={SOCHIC_NOTE} duration={PER_BEAT} />
      </Sequence>
    ))}
  </Section>
);

export const Testimonial: React.FC = () => (
  <Film
    track="cinematic"
    sections={[
      {
        key: "hook",
        duration: 75,
        node: (
          <Section duration={75}>
            <Kicker>In their words</Kicker>
            <div className="mt-10">
              <Headline lines={["What clients", "say after", "we're done."]} goldIndex={[2]} />
            </div>
            <div className="mt-10">
              <Body delay={22}>Straight from the messages.</Body>
            </div>
          </Section>
        ),
      },
      { key: "sochic", duration: 210, node: <SoChic duration={210} /> },
      {
        key: "ayah",
        duration: 100,
        node: (
          <Section duration={100} className="">
            <QuoteCard text={AYAH} by={AYAH_BY} note={AYAH_NOTE} duration={100} size={60} />
          </Section>
        ),
      },
      { key: "outro", duration: 95, node: <Outro /> },
    ]}
  />
);
