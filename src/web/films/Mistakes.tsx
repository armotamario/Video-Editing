import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
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

const MISTAKES = [
  { wrong: "No phone number\nabove the fold.", right: "Tap-to-call in the header, on every page." },
  { wrong: "A homepage that\nsays “Welcome”.", right: "Say what you do, where, and for whom." },
  { wrong: "Hours and prices\nonly on Facebook.", right: "Put them on the page people land on." },
  { wrong: "A site that only\nlooks right on a laptop.", right: "Design the phone version first." },
];

const PER_CARD = 72;

const Card: React.FC<{ index: number }> = ({ index }) => {
  const item = MISTAKES[index];
  const wrongIn = useRise(0, 16);
  const rightIn = useRise(16, 15);
  const fade = useSectionFade(PER_CARD, 8);

  return (
    <AbsoluteFill className="justify-center px-20 pb-[150px]" style={{ opacity: fade }}>
      <div
        style={{ opacity: wrongIn, fontFamily: monoFont, color: INK_SOFT }}
        className="text-[26px] font-bold uppercase tracking-[0.32em]"
      >
        Mistake {String(index + 1).padStart(2, "0")}
      </div>
      <div
        style={{
          transform: `translateY(${interpolate(wrongIn, [0, 1], [46, 0])}px)`,
          opacity: wrongIn,
          fontFamily: serifFont,
          color: INK,
          textDecoration: "line-through",
          textDecorationColor: GOLD,
          textDecorationThickness: "5px",
          whiteSpace: "pre-line",
        }}
        className="mt-7 text-[92px] font-bold leading-[1.12] tracking-[-0.02em]"
      >
        {item.wrong}
      </div>

      <div
        style={{
          transform: `translateY(${interpolate(rightIn, [0, 1], [30, 0])}px)`,
          opacity: rightIn,
          borderLeft: `5px solid ${GOLD}`,
        }}
        className="mt-14 pl-9"
      >
        <div
          style={{ fontFamily: monoFont, color: GOLD }}
          className="text-[24px] font-bold uppercase tracking-[0.3em]"
        >
          Instead
        </div>
        <div
          style={{ fontFamily: bodyFont, color: INK }}
          className="mt-4 text-[40px] font-bold leading-snug"
        >
          {item.right}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Cards: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const active = Math.min(Math.floor(frame / PER_CARD), MISTAKES.length - 1);

  return (
    <Section duration={duration} className="">
      {MISTAKES.map((item, i) => (
        <Sequence key={item.wrong} from={i * PER_CARD} durationInFrames={PER_CARD}>
          <Card index={i} />
        </Sequence>
      ))}
      <AbsoluteFill className="items-center justify-start pt-[150px]">
        <div className="flex gap-2.5">
          {MISTAKES.map((item, i) => (
            <div
              key={item.wrong}
              style={{ background: i === active ? GOLD : "var(--line)" }}
              className={`h-1.5 rounded-full ${i === active ? "w-12" : "w-5"}`}
            />
          ))}
        </div>
      </AbsoluteFill>
    </Section>
  );
};

export const Mistakes: React.FC = () => (
  <Film
    track="tense"
    palette="oxblood"
    sections={[
      {
        key: "hook",
        duration: 85,
        node: (
          <Section duration={85}>
            <Kicker>Website mistakes</Kicker>
            <div className="mt-10">
              <Headline lines={["Four things", "quietly costing", "you customers."]} goldIndex={[2]} />
            </div>
            <div className="mt-10">
              <Body delay={24}>All of them are cheap to fix.</Body>
            </div>
          </Section>
        ),
      },
      { key: "cards", duration: 288, node: <Cards duration={288} /> },
      { key: "outro", duration: 107, node: <Outro /> },
    ]}
  />
);
