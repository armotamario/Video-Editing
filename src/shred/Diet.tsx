import { AbsoluteFill, interpolate } from "remotion";
import { bodyFont, headlineFont, monoFont } from "../fonts";
import { ACCENT, INK, INK_SOFT } from "../mfba/theme";
import {
  Body,
  Film,
  Headline,
  Kicker,
  Outro,
  RowList,
  Section,
  SeriesTag,
  useRise,
  useSectionFade,
} from "./kit";

const RULES = [
  { title: "2–3L of water", note: "Bottle on the desk. Refill before you're thirsty." },
  { title: "175g of protein", note: "Chicken breast does most of the work." },
  { title: "Track it in an app", note: "MyFitnessPal. Weigh it once, save the meal." },
  { title: "Eat the same meals", note: "Chicken, jasmine rice, broccoli. Three times." },
  { title: "Caffeine 2–3× a day", note: "Early. Not before a 9pm session." },
  { title: "Veg with every meal", note: "50g of broccoli. Free volume, free fibre." },
];

const DAY = [
  { value: "1,534", label: "Calories" },
  { value: "175g", label: "Protein" },
  { value: "159g", label: "Carbs" },
  { value: "19g", label: "Fat" },
];

const Chip: React.FC<{ value: string; label: string; delay: number }> = ({
  value,
  label,
  delay,
}) => {
  const t = useRise(delay, 16);
  return (
    <div
      style={{
        transform: `translateY(${interpolate(t, [0, 1], [36, 0])}px)`,
        opacity: t,
        background: "#1b1815",
      }}
      className="flex-1 rounded-[24px] px-2 py-7 text-center"
    >
      <div style={{ fontFamily: headlineFont, color: ACCENT }} className="text-[62px] leading-none">
        {value}
      </div>
      <div
        style={{ fontFamily: monoFont, color: INK_SOFT }}
        className="mt-3 text-[20px] font-bold uppercase tracking-[0.16em]"
      >
        {label}
      </div>
    </div>
  );
};

const RealDay: React.FC<{ duration: number }> = ({ duration }) => {
  const headIn = useRise(0);
  const fade = useSectionFade(duration, 8);
  return (
    <AbsoluteFill className="justify-center px-16 pb-[80px]" style={{ opacity: fade }}>
      <div
        style={{ opacity: headIn, fontFamily: monoFont, color: ACCENT }}
        className="text-[24px] font-bold uppercase tracking-[0.32em]"
      >
        What that adds up to
      </div>
      <div
        style={{
          transform: `translateY(${interpolate(headIn, [0, 1], [36, 0])}px)`,
          opacity: headIn,
          fontFamily: headlineFont,
          color: INK,
        }}
        className="mt-6 text-[104px] leading-[0.96] tracking-wide"
      >
        One actual day.
      </div>
      <div className="mt-12 flex gap-4">
        {DAY.map((item, i) => (
          <Chip key={item.label} value={item.value} label={item.label} delay={12 + i * 6} />
        ))}
      </div>
      <div
        style={{ opacity: useRise(40), fontFamily: bodyFont, color: INK_SOFT }}
        className="mt-10 text-[29px] font-medium"
      >
        Not a meal plan. A habit you can repeat tomorrow.
      </div>
    </AbsoluteFill>
  );
};

export const Diet: React.FC = () => (
  <Film
    track="drive"
    sections={[
      {
        key: "hook",
        duration: 80,
        node: (
          <Section duration={80}>
            <Kicker>Diet</Kicker>
            <div className="mt-10">
              <Headline lines={["Six rules.", "That's the", "whole diet."]} accentIndex={[0]} />
            </div>
            <div className="mt-10">
              <Body delay={22}>No shakes, no cutting carbs, no starving at 9pm.</Body>
            </div>
          </Section>
        ),
      },
      {
        key: "rules",
        duration: 210,
        node: (
          <Section duration={210} className="justify-center px-16 pt-[40px]">
            <SeriesTag episode="05" label="Diet" />
            <div className="mt-[110px]">
              <RowList rows={RULES} start={10} step={16} compact />
            </div>
          </Section>
        ),
      },
      { key: "day", duration: 95, node: <RealDay duration={95} /> },
      { key: "outro", duration: 95, node: <Outro /> },
    ]}
  />
);
