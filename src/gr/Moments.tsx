import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { bodyFont, monoFont, serifFont } from "../fonts";
import { ACCENT_LINE, INK, INK_SOFT, PAGE_BG } from "../palettes";
import { Cross, Film, GOLD, Headline, Kicker, Outro, Proof, Section, useRise } from "./kit";

/** The five beats of the list, in the order they build. */
const MOMENTS: { label: string; answer: string }[] = [
  { label: "Happy moments", answer: "Praise God" },
  { label: "Difficult moments", answer: "Seek God" },
  { label: "Quiet moments", answer: "Worship God" },
  { label: "Painful moments", answer: "Trust God" },
  { label: "Every moment", answer: "Thank God" },
];

const BEAT = 46;

/** The progress rail — five marks, the live one long and gold. */
const Rail: React.FC<{ active: number }> = ({ active }) => (
  <div className="flex gap-4">
    {MOMENTS.map((moment, i) => (
      <div
        key={moment.label}
        style={{ background: i === active ? GOLD : `${GOLD}55` }}
        className={`h-[7px] rounded-full ${i === active ? "w-[86px]" : "w-[34px]"}`}
      />
    ))}
  </div>
);

/** One beat: the moment above, the answer below, cut hard to the next. */
const Beat: React.FC<{ index: number }> = ({ index }) => {
  const { label, answer } = MOMENTS[index];
  const last = index === MOMENTS.length - 1;
  const labelIn = useRise(0, 16);
  const answerIn = useRise(4, 15);
  const frame = useCurrentFrame();
  const out = interpolate(frame, [BEAT - 6, BEAT], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: PAGE_BG, opacity: out }}>
      <AbsoluteFill className="items-center justify-center px-16">
        <div
          style={{
            opacity: labelIn,
            transform: `translateY(${interpolate(labelIn, [0, 1], [18, 0])}px)`,
            fontFamily: monoFont,
            color: last ? GOLD : INK_SOFT,
          }}
          className="text-[34px] font-bold uppercase tracking-[0.32em]"
        >
          {label}
        </div>

        <div
          style={{ opacity: labelIn, background: ACCENT_LINE }}
          className="mt-10 h-[1px] w-[220px]"
        />

        <div
          style={{
            opacity: answerIn,
            transform: `translateY(${interpolate(answerIn, [0, 1], [40, 0])}px) scale(${interpolate(
              answerIn,
              [0, 1],
              [0.94, 1],
            )})`,
            fontFamily: serifFont,
            color: last ? GOLD : INK,
          }}
          className="mt-12 text-[136px] font-bold leading-none tracking-[-0.02em]"
        >
          {answer}
        </div>
      </AbsoluteFill>

      <AbsoluteFill className="items-center justify-end pb-[190px]">
        <Rail active={index} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Hook: React.FC<{ duration: number }> = ({ duration }) => {
  const markIn = useRise(0, 14);
  return (
    <Section duration={duration} className="items-center justify-center px-16 text-center">
      <div style={{ transform: `scale(${markIn})`, opacity: markIn }}>
        <Cross size={74} />
      </div>
      <div className="mt-12">
        <Kicker delay={4}>Five moments</Kicker>
      </div>
      <div className="mt-8">
        <Headline lines={["One answer", "for each."]} goldIndex={[1]} size={104} delay={8} align="center" />
      </div>
    </Section>
  );
};

const Close: React.FC<{ duration: number }> = ({ duration }) => (
  <Section duration={duration} className="items-center justify-center px-20 text-center">
    <div
      style={{ fontFamily: bodyFont, color: INK_SOFT }}
      className="text-[38px] font-medium leading-snug"
    >
      Save it. Read it on the day you need it.
    </div>
  </Section>
);

export const Moments: React.FC = () => (
  <Film
    track="hymn"
    palette="oxblood"
    sections={[
      { key: "hook", duration: 66, node: <Hook duration={66} /> },
      ...MOMENTS.map((moment, i) => ({
        key: moment.label,
        duration: BEAT,
        node: <Beat index={i} />,
      })),
      { key: "close", duration: 44, node: <Close duration={44} /> },
      {
        key: "proof",
        duration: 66,
        node: (
          <Proof
            quote="Give thanks in all circumstances."
            cite="1 Thessalonians 5:18"
            duration={66}
            size={64}
          />
        ),
      },
      { key: "outro", duration: 74, node: <Outro cta="Wear what you believe" /> },
    ]}
  />
);
