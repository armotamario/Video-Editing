import { Body, Film, Headline, Kicker, Outro, RowList, Section, SeriesTag } from "./kit";

const MISTAKES = [
  { title: "You're not tracking", note: "Not forever. One honest week tells you everything.", tag: "01" },
  { title: "The weekend", note: "Five good days and two loose ones is a flat month.", tag: "02" },
  { title: "Cardio replaced lifting", note: "Cardio burns it. Lifting is what keeps the shape.", tag: "03" },
  { title: "You changed the plan", note: "Nine days in. Nothing works in nine days.", tag: "04" },
];

export const Mistakes: React.FC = () => (
  <Film
    track="grind"
    palette="mfbaOxblood"
    sections={[
      {
        key: "hook",
        duration: 80,
        node: (
          <Section duration={80}>
            <Kicker>Fat loss</Kicker>
            <div className="mt-10">
              <Headline lines={["Four reasons", "the scale", "isn't moving."]} accentIndex={[2]} />
            </div>
            <div className="mt-10">
              <Body delay={22}>None of them are your metabolism.</Body>
            </div>
          </Section>
        ),
      },
      {
        key: "list",
        duration: 220,
        node: (
          <Section duration={220} className="justify-center px-16 pt-[40px]">
            <SeriesTag episode="09" label="What's stalling you" />
            <div className="mt-[110px]">
              <RowList rows={MISTAKES} start={10} step={18} />
            </div>
          </Section>
        ),
      },
      {
        key: "close",
        duration: 85,
        node: (
          <Section duration={85} className="justify-center px-16">
            <Headline lines={["Fix one.", "Give it", "a month."]} accentIndex={[2]} size={124} />
            <div className="mt-10">
              <Body delay={18}>General fitness content, not medical advice.</Body>
            </div>
          </Section>
        ),
      },
      { key: "outro", duration: 95, node: <Outro /> },
    ]}
  />
);
