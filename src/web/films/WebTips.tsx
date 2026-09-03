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

const TIPS = [
  { title: "Say what you do\nin the first line.", note: "Not your slogan. What a stranger would type to find you." },
  { title: "One button,\nrepeated.", note: "Book, call or order. The same action, all the way down." },
  { title: "Put your prices\nup front.", note: "Hiding them costs you the customers who were ready." },
  { title: "Show the real\nplace and people.", note: "Stock photos read as 'this could be anyone'." },
];

const PER_TIP = 70;

const Tip: React.FC<{ index: number }> = ({ index }) => {
  const tip = TIPS[index];
  const t = useRise(0, 16);
  const noteIn = useRise(10);
  const fade = useSectionFade(PER_TIP, 8);

  return (
    <AbsoluteFill className="justify-center px-20 pb-[150px]" style={{ opacity: fade }}>
      <div
        style={{ opacity: t, fontFamily: monoFont, color: GOLD }}
        className="text-[34px] font-bold tracking-[0.3em]"
      >
        {String(index + 1).padStart(2, "0")}
      </div>
      <div
        style={{
          transform: `translateY(${interpolate(t, [0, 1], [50, 0])}px)`,
          opacity: t,
          fontFamily: serifFont,
          color: INK,
          whiteSpace: "pre-line",
        }}
        className="mt-8 text-[104px] font-bold leading-[1.1] tracking-[-0.02em]"
      >
        {tip.title}
      </div>
      <div
        style={{
          transform: `translateY(${interpolate(noteIn, [0, 1], [24, 0])}px)`,
          opacity: noteIn,
          fontFamily: bodyFont,
          color: INK_SOFT,
        }}
        className="mt-10 text-[34px] font-medium leading-snug"
      >
        {tip.note}
      </div>
    </AbsoluteFill>
  );
};

const Tips: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const active = Math.min(Math.floor(frame / PER_TIP), TIPS.length - 1);

  return (
    <Section duration={duration} className="">
      {TIPS.map((tip, i) => (
        <Sequence key={tip.title} from={i * PER_TIP} durationInFrames={PER_TIP}>
          <Tip index={i} />
        </Sequence>
      ))}
      <AbsoluteFill className="items-center justify-start pt-[150px]">
        <div className="flex gap-2.5">
          {TIPS.map((tip, i) => (
            <div
              key={tip.title}
              style={{ background: i === active ? GOLD : "var(--line)" }}
              className={`h-1.5 rounded-full ${i === active ? "w-12" : "w-5"}`}
            />
          ))}
        </div>
      </AbsoluteFill>
    </Section>
  );
};

export const WebTips: React.FC = () => (
  <Film
    track="lofi"
    palette="midnight"
    sections={[
      {
        key: "hook",
        duration: 85,
        node: (
          <Section duration={85}>
            <Kicker>Website tips</Kicker>
            <div className="mt-10">
              <Headline lines={["Four fixes", "worth more than", "a redesign."]} goldIndex={[1]} />
            </div>
            <div className="mt-10">
              <Body delay={24}>You can do every one of these today.</Body>
            </div>
          </Section>
        ),
      },
      { key: "tips", duration: 280, node: <Tips duration={280} /> },
      { key: "outro", duration: 115, node: <Outro /> },
    ]}
  />
);
