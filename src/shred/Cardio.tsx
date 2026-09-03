import { AbsoluteFill, interpolate } from "remotion";
import { bodyFont, headlineFont, monoFont } from "../fonts";
import {
  ACCENT,
  Body,
  Film,
  Headline,
  Kicker,
  Outro,
  RowList,
  INK,
  INK_SOFT,
  Section,
  SeriesTag,
  useRise,
  useSectionFade,
} from "./kit";

/** One cardio mode: what it is, where it happens, why there. */
const ModeCard: React.FC<{
  mode: string;
  where: string;
  detail: string;
  why: string;
  duration: number;
}> = ({ mode, where, detail, why, duration }) => {
  const modeIn = useRise(0, 14);
  const whereIn = useRise(8, 16);
  const whyIn = useRise(20);
  const fade = useSectionFade(duration, 8);

  return (
    <AbsoluteFill className="justify-center px-16 pb-[120px]" style={{ opacity: fade }}>
      <div
        style={{
          transform: `translateY(${interpolate(modeIn, [0, 1], [46, 0])}px)`,
          opacity: modeIn,
          fontFamily: headlineFont,
          color: ACCENT,
        }}
        className="text-[150px] leading-none tracking-wide"
      >
        {mode}
      </div>

      <div
        style={{ opacity: whereIn, fontFamily: monoFont, color: INK_SOFT }}
        className="mt-10 text-[24px] font-bold uppercase tracking-[0.3em]"
      >
        Where
      </div>
      <div
        style={{
          transform: `translateY(${interpolate(whereIn, [0, 1], [30, 0])}px)`,
          opacity: whereIn,
          fontFamily: headlineFont,
          color: INK,
        }}
        className="mt-4 text-[84px] leading-[0.96] tracking-wide"
      >
        {where}
      </div>
      <div
        style={{ opacity: whereIn, fontFamily: bodyFont, color: INK_SOFT }}
        className="mt-4 text-[31px] font-medium"
      >
        {detail}
      </div>

      <div
        style={{
          transform: `translateY(${interpolate(whyIn, [0, 1], [26, 0])}px)`,
          opacity: whyIn,
          borderLeft: `5px solid ${ACCENT}`,
        }}
        className="mt-12 pl-8"
      >
        <div style={{ fontFamily: bodyFont, color: INK }} className="text-[33px] font-bold leading-snug">
          {why}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Cardio: React.FC = () => (
  <Film
    track="pace"
    palette="mfbaMidnight"
    sections={[
      {
        key: "hook",
        duration: 80,
        node: (
          <Section duration={80}>
            <Kicker>Cardio</Kicker>
            <div className="mt-10">
              <Headline lines={["The cheapest", "fat loss", "you'll ever do."]} accentIndex={[1]} />
            </div>
            <div className="mt-10">
              <Body delay={22}>No gym. No machine. No membership.</Body>
            </div>
          </Section>
        ),
      },
      {
        key: "run",
        duration: 105,
        node: (
          <Section duration={105} className="">
            <ModeCard
              duration={105}
              mode="Run"
              where="The local soccer field"
              detail="Laps of the pitch, not the footpath."
              why="Soft ground, no traffic, no lights — and a lap is easy to count."
            />
            <SeriesTag episode="04" label="Cardio" />
          </Section>
        ),
      },
      {
        key: "walk",
        duration: 105,
        node: (
          <Section duration={105} className="">
            <ModeCard
              duration={105}
              mode="Walk"
              where="Around the block × 10"
              detail="Somewhere scenic when you can be bothered."
              why="It's the one you'll actually still be doing in six months."
            />
            <SeriesTag episode="04" label="Cardio" />
          </Section>
        ),
      },
      {
        key: "rules",
        duration: 95,
        node: (
          <Section duration={95}>
            <Kicker>How it fits</Kicker>
            <div className="mt-8">
              <RowList
                start={8}
                step={13}
                rows={[
                  { title: "Walk daily, run twice", note: "The walk is the base. The run is the bonus." },
                  { title: "Never on lifting legs", note: "Run on the days you didn't train quads." },
                  { title: "Change the scenery", note: "A new route buys you another month of doing it." },
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
