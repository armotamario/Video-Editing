import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { bodyFont, monoFont, serifFont } from "../fonts";
import { BRAND_SHORT, HANDLE, OFFER } from "../mfba/brand";

/**
 * The full protocol, cut as an editorial piece: off-white pages, hairline
 * rules, one accent, and full-bleed photographs between the data. Silent by
 * design — a trending sound gets added on upload.
 */
export const PROTOCOL_DURATION = 1000;

const PAPER = "#f6f3ec";
const INK = "#12100d";
const INK_SOFT = "#6d675d";
const RULE = "#d8d2c5";
const ACCENT = "#e35c12";

const useRise = (delay = 0, damping = 200) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping } });
};

const useFade = (duration: number, frames = 10) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [duration - frames, duration], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

/** Small mono label with a rule beside it — the header on every page. */
const Label: React.FC<{ children: React.ReactNode; delay?: number }> = ({
  children,
  delay = 0,
}) => {
  const t = useRise(delay);
  return (
    <div style={{ opacity: t }} className="flex items-center gap-5">
      <div style={{ background: ACCENT }} className="h-[3px] w-10" />
      <div
        style={{ fontFamily: monoFont, color: ACCENT }}
        className="text-[23px] font-bold uppercase tracking-[0.32em]"
      >
        {children}
      </div>
    </div>
  );
};

const Title: React.FC<{ children: React.ReactNode; delay?: number; size?: number }> = ({
  children,
  delay = 0,
  size = 96,
}) => {
  const t = useRise(delay);
  return (
    <div
      style={{
        transform: `translateY(${interpolate(t, [0, 1], [34, 0])}px)`,
        opacity: t,
        fontFamily: serifFont,
        color: INK,
        fontSize: size,
        whiteSpace: "pre-line",
      }}
      className="font-bold leading-[1.06] tracking-[-0.03em]"
    >
      {children}
    </div>
  );
};

const Row: React.FC<{ left: string; right?: string; note?: string; delay: number }> = ({
  left,
  right,
  note,
  delay,
}) => {
  const t = useRise(delay, 18);
  return (
    <div
      style={{ opacity: t, borderBottom: `1px solid ${RULE}` }}
      className="flex items-baseline justify-between gap-6 py-6"
    >
      <div className="flex-1">
        <div style={{ fontFamily: serifFont, color: INK }} className="text-[44px] font-bold tracking-[-0.01em]">
          {left}
        </div>
        {note ? (
          <div style={{ fontFamily: bodyFont, color: INK_SOFT }} className="mt-1.5 text-[25px] font-medium">
            {note}
          </div>
        ) : null}
      </div>
      {right ? (
        <div
          style={{ fontFamily: monoFont, color: ACCENT }}
          className="flex-none text-[26px] font-bold uppercase tracking-[0.08em]"
        >
          {right}
        </div>
      ) : null}
    </div>
  );
};

const Page: React.FC<{ duration: number; children: React.ReactNode }> = ({
  duration,
  children,
}) => (
  <AbsoluteFill
    style={{ background: PAPER, opacity: useFade(duration) }}
    className="justify-center px-20"
  >
    {children}
  </AbsoluteFill>
);

/** Full-bleed photograph with the caption sitting in the lower third. */
const Plate: React.FC<{
  src: string;
  label: string;
  title: string;
  note?: string;
  duration: number;
  focus?: string;
}> = ({ src, label, title, note, duration, focus = "center 35%" }) => {
  const frame = useCurrentFrame();
  const t = useRise(4);
  return (
    <AbsoluteFill style={{ opacity: useFade(duration) }}>
      <AbsoluteFill style={{ transform: `scale(${1 + frame / 1400})` }}>
        <Img
          src={staticFile(`images/photos/${src}`)}
          className="h-full w-full object-cover"
          style={{ objectPosition: focus }}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.12) 40%, rgba(0,0,0,0.86) 100%)",
        }}
      />
      <AbsoluteFill className="justify-end px-16 pb-[210px]">
        <div style={{ opacity: t }} className="flex items-center gap-5">
          <div style={{ background: ACCENT }} className="h-[3px] w-10" />
          <div
            style={{ fontFamily: monoFont, color: "#f3ece2" }}
            className="text-[23px] font-bold uppercase tracking-[0.32em]"
          >
            {label}
          </div>
        </div>
        <div
          style={{
            transform: `translateY(${interpolate(t, [0, 1], [30, 0])}px)`,
            opacity: t,
            fontFamily: serifFont,
            color: "#fbf8f2",
            whiteSpace: "pre-line",
          }}
          className="mt-7 text-[96px] font-bold leading-[1.04] tracking-[-0.03em]"
        >
          {title}
        </div>
        {note ? (
          <div
            style={{ opacity: t, fontFamily: bodyFont, color: "#cfc7ba" }}
            className="mt-5 text-[29px] font-medium"
          >
            {note}
          </div>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const DAY_A = [
  "Weighted push-ups",
  "Weighted lunges",
  "Dumbbell rows",
  "Leg raises",
];
const DAY_B = [
  "Dumbbell shoulder press",
  "Dumbbell Romanian deadlifts",
  "Dumbbell bicep curls",
  "Weighted crunches",
];

const NUTRITION = [
  { left: "Protein", right: "160–200g", note: "220g chicken breast, two to four times a day." },
  { left: "Carbs", right: "200g", note: "One cup of steamed rice, four times." },
  { left: "Fibre", right: "10g", note: "Chia seeds and water." },
  { left: "Coffee", right: "Daily", note: "Cappuccino, extra foam, ¼ cup milk, topped with hot water." },
  { left: "Coke Zero", right: "By the box", note: "The one thing that isn't measured." },
];

const SUPPS = [
  { left: "Morning", right: "3", note: "L-theanine · Vitamin B2 · memory and focus." },
  { left: "Afternoon", right: "4", note: "Vitamin D 1–2 · Vitamin C ×2 · memory and focus." },
  { left: "Evening", right: "2", note: "Ashwagandha · magnesium glycinate, 30–60 min before bed." },
];

const Outro: React.FC<{ duration: number }> = ({ duration }) => {
  const markIn = useRise(0, 14);
  const ctaIn = useRise(16, 12);
  const frame = useCurrentFrame();
  const pulse = 1 + Math.sin(frame / 9) * 0.02;

  return (
    <AbsoluteFill
      style={{ background: PAPER, opacity: useFade(duration, 8) }}
      className="items-center justify-center px-16"
    >
      <div
        style={{ opacity: markIn, fontFamily: serifFont, color: INK }}
        className="text-[128px] font-bold tracking-[-0.03em]"
      >
        {BRAND_SHORT}
      </div>
      <div
        style={{ opacity: markIn, fontFamily: monoFont, color: ACCENT }}
        className="mt-4 text-[24px] font-bold uppercase tracking-[0.34em]"
      >
        Movinforward by Armota
      </div>
      <div style={{ opacity: ctaIn, background: RULE }} className="my-12 h-[1px] w-[220px]" />
      <div
        style={{ transform: `scale(${pulse})`, opacity: ctaIn, fontFamily: monoFont, background: ACCENT, color: PAPER }}
        className="rounded-full px-11 py-5 text-[30px] font-bold uppercase tracking-[0.06em]"
      >
        {OFFER}
      </div>
      <div style={{ opacity: ctaIn, fontFamily: bodyFont, color: INK }} className="mt-8 text-[31px] font-bold">
        {HANDLE}
      </div>
      <div
        style={{ opacity: ctaIn, fontFamily: bodyFont, color: INK_SOFT }}
        className="mt-10 px-12 text-center text-[21px] font-medium"
      >
        What works for me, not medical advice. Check supplements with your doctor.
      </div>
    </AbsoluteFill>
  );
};

const SECTIONS: { key: string; duration: number; node: (d: number) => React.ReactNode }[] = [
  {
    key: "cover",
    duration: 95,
    node: (d) => (
      <Plate
        duration={d}
        src="gym.jpg"
        focus="center 40%"
        label="The protocol"
        title={"Training.\nNutrition.\nCardio."}
        note="Everything I actually do, in order."
      />
    ),
  },
  {
    key: "day-a",
    duration: 140,
    node: (d) => (
      <Page duration={d}>
        <Label>Training · Day A</Label>
        <div className="mt-8">
          <Title>Push, quads, back, abs.</Title>
        </div>
        <div className="mt-10" style={{ borderTop: `1px solid ${RULE}` }}>
          {DAY_A.map((name, i) => (
            <Row key={name} left={name} right="3 sets" delay={10 + i * 13} />
          ))}
        </div>
      </Page>
    ),
  },
  {
    key: "day-b",
    duration: 140,
    node: (d) => (
      <Page duration={d}>
        <Label>Training · Day B</Label>
        <div className="mt-8">
          <Title>Shoulders, hamstrings, arms, abs.</Title>
        </div>
        <div className="mt-10" style={{ borderTop: `1px solid ${RULE}` }}>
          {DAY_B.map((name, i) => (
            <Row key={name} left={name} right="3 sets" delay={10 + i * 13} />
          ))}
        </div>
      </Page>
    ),
  },
  {
    key: "when",
    duration: 55,
    node: (d) => (
      <Plate
        duration={d}
        src="gym.jpg"
        focus="center 55%"
        label="When"
        title={"Three nights\na week."}
        note="9:00 – 9:50 PM. Every set to failure."
      />
    ),
  },
  {
    key: "nutrition",
    duration: 185,
    node: (d) => (
      <Page duration={d}>
        <Label>Nutrition</Label>
        <div className="mt-8">
          <Title size={88}>The daily numbers.</Title>
        </div>
        <div className="mt-9" style={{ borderTop: `1px solid ${RULE}` }}>
          {NUTRITION.map((row, i) => (
            <Row key={row.left} left={row.left} right={row.right} note={row.note} delay={10 + i * 14} />
          ))}
        </div>
      </Page>
    ),
  },
  {
    key: "table",
    duration: 70,
    node: (d) => (
      <Plate
        duration={d}
        src="plate.jpg"
        focus="center 45%"
        label="The rule that matters"
        title={"Eat with\npeople."}
        note="Talking, joking, watching something together. Not alone at the bench."
      />
    ),
  },
  {
    key: "prep",
    duration: 105,
    node: (d) => (
      <Page duration={d}>
        <Label>Meal prep &amp; supplements</Label>
        <div className="mt-8">
          <Title size={80}>Cooked once. Taken on time.</Title>
        </div>
        <div className="mt-8" style={{ borderTop: `1px solid ${RULE}` }}>
          <Row left="Chicken breast" right="5.6kg" note="No skin. One cook for the week." delay={8} />
          <Row left="Rice" right="28 cups" note="Portioned the same way every time." delay={20} />
          {SUPPS.map((row, i) => (
            <Row key={row.left} left={row.left} right={row.right} note={row.note} delay={32 + i * 12} />
          ))}
        </div>
      </Page>
    ),
  },
  {
    key: "cardio",
    duration: 95,
    node: (d) => (
      <Plate
        duration={d}
        src="walk.jpg"
        focus="center 60%"
        label="Cardio"
        title={"Five laps\nof the block."}
        note="And walk somewhere scenic instead of the same route every time."
      />
    ),
  },
  { key: "outro", duration: 115, node: (d) => <Outro duration={d} /> },
];

export const Protocol: React.FC = () => {
  let at = 0;
  return (
    <AbsoluteFill style={{ background: PAPER }}>
      {SECTIONS.map((section) => {
        const from = at;
        at += section.duration;
        return (
          <Sequence key={section.key} from={from} durationInFrames={section.duration}>
            {section.node(section.duration)}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
