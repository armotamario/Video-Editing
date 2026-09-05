import { Sequence, interpolate, useCurrentFrame } from "remotion";
import { AbsoluteFill } from "remotion";
import { bodyFont, headlineFont, monoFont } from "../fonts";
import { OnPhoto } from "../photo";
import {
  ACCENT,
  Body,
  Film,
  Headline,
  INK,
  INK_SOFT,
  Kicker,
  Outro,
  RowList,
  Section,
  SeriesTag,
  useRise,
  useSectionFade,
} from "./kit";

const PER_BLOCK = 62;

/** Four bodyweight patterns, each as a ladder you climb one rung at a time. */
const BLOCKS = [
  {
    name: "Push",
    steps: ["Incline push-up", "Full push-up", "Diamond push-up", "Feet-elevated"],
    note: "Chest, front delts, triceps",
  },
  {
    name: "Pull",
    steps: ["Dead hang", "Negative pull-up", "Band-assisted", "Full pull-up"],
    note: "Lats, upper back, biceps",
  },
  {
    name: "Legs",
    steps: ["Bodyweight squat", "Split squat", "Bulgarian split", "Pistol progression"],
    note: "Quads, glutes, hamstrings",
  },
  {
    name: "Core",
    steps: ["Dead bug", "Hollow hold", "Hanging knee raise", "Toes to bar"],
    note: "Abs, hip flexors, grip",
  },
];

const Rung: React.FC<{ index: number; label: string; delay: number }> = ({
  index,
  label,
  delay,
}) => {
  const t = useRise(delay, 17);
  return (
    <div
      style={{
        transform: `translateX(${interpolate(t, [0, 1], [-40, 0])}px)`,
        opacity: t,
      }}
      className="flex items-center gap-6 py-3"
    >
      <div
        style={{ background: index === 3 ? ACCENT : "var(--surface)", color: index === 3 ? "var(--on-accent)" : ACCENT, fontFamily: monoFont }}
        className="flex h-[52px] w-[52px] flex-none items-center justify-center rounded-full text-[24px] font-bold"
      >
        {index + 1}
      </div>
      <div
        style={{ fontFamily: headlineFont, color: INK }}
        className="text-[62px] leading-none tracking-wide"
      >
        {label}
      </div>
    </div>
  );
};

const Block: React.FC<{ index: number }> = ({ index }) => {
  const block = BLOCKS[index];
  const headIn = useRise(0, 15);
  const fade = useSectionFade(PER_BLOCK, 8);

  return (
    <AbsoluteFill className="justify-center px-16 pb-[130px]" style={{ opacity: fade }}>
      <div
        style={{
          transform: `translateY(${interpolate(headIn, [0, 1], [40, 0])}px)`,
          opacity: headIn,
          fontFamily: headlineFont,
          color: ACCENT,
        }}
        className="text-[128px] leading-none tracking-wide"
      >
        {block.name}
      </div>
      <div
        style={{ opacity: headIn, fontFamily: bodyFont, color: INK_SOFT }}
        className="mt-2 text-[28px] font-bold uppercase tracking-[0.22em]"
      >
        {block.note}
      </div>

      <div className="mt-9">
        {block.steps.map((step, i) => (
          <Rung key={step} index={i} label={step} delay={8 + i * 9} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

const Ladders: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const active = Math.min(Math.floor(frame / PER_BLOCK), BLOCKS.length - 1);

  return (
    <Section duration={duration} className="">
      {BLOCKS.map((block, i) => (
        <Sequence key={block.name} from={i * PER_BLOCK} durationInFrames={PER_BLOCK}>
          <Block index={i} />
        </Sequence>
      ))}
      <SeriesTag episode="06" label="Calisthenics" />
      <AbsoluteFill className="items-center justify-end pb-[90px]">
        <div className="flex gap-2.5">
          {BLOCKS.map((block, i) => (
            <div
              key={block.name}
              style={{ background: i === active ? ACCENT : "var(--line)" }}
              className={`h-1.5 rounded-full ${i === active ? "w-12" : "w-5"}`}
            />
          ))}
        </div>
      </AbsoluteFill>
    </Section>
  );
};

export const Calisthenics: React.FC = () => (
  <Film
    track="bodyweight"
    palette="mfbaSteel"
    sections={[
      {
        key: "hook",
        duration: 85,
        node: (
          <OnPhoto src="gym.jpg" scrim={0.78} focus="center 45%">
            <Section duration={85}>
              <Kicker>No gym · no equipment</Kicker>
              <div className="mt-10">
                <Headline lines={["You already", "own the only", "gear you need."]} accentIndex={[2]} />
              </div>
              <div className="mt-10">
                <Body delay={22}>Four patterns. Four rungs each. Climb one at a time.</Body>
              </div>
            </Section>
          </OnPhoto>
        ),
      },
      { key: "ladders", duration: 248, node: <Ladders duration={248} /> },
      {
        key: "rules",
        duration: 62,
        node: (
          <Section duration={62}>
            <Kicker>How to climb</Kicker>
            <div className="mt-8">
              <RowList
                start={6}
                step={11}
                compact
                rows={[
                  { title: "Three sets to failure", tag: "3×" },
                  { title: "Move up at twelve clean reps", tag: "12" },
                  { title: "Three days a week", tag: "3/wk" },
                ]}
              />
            </div>
          </Section>
        ),
      },
      { key: "outro", duration: 85, node: <Outro /> },
    ]}
  />
);
