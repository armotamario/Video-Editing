import { Body, Film, Headline, Kicker, Outro, RowList, Section, SeriesTag } from "./kit";

const RULES = [
  { title: "Three sessions", note: "Same days every week. Put them in the calendar.", tag: "Wk 1" },
  { title: "Eight movements", note: "Push, pull, legs, core. Two days, alternating.", tag: "Wk 1" },
  { title: "Protein every meal", note: "A palm of it. Don't count anything else yet.", tag: "Wk 2" },
  { title: "Walk the off days", note: "Twenty minutes. It's not a workout, it's a habit.", tag: "Wk 2" },
  { title: "Weigh in once", note: "Same morning, same conditions. Once a week, not daily.", tag: "Wk 3" },
];

export const FirstMonth: React.FC = () => (
  <Film
    track="drive"
    palette="mfbaSand"
    sections={[
      {
        key: "hook",
        duration: 80,
        node: (
          <Section duration={80}>
            <Kicker>Month one</Kicker>
            <div className="mt-10">
              <Headline lines={["You don't need", "a perfect plan.", "You need four weeks."]} accentIndex={[2]} size={112} />
            </div>
            <div className="mt-10">
              <Body delay={22}>Nobody quits because the program was wrong. They quit because it was too much.</Body>
            </div>
          </Section>
        ),
      },
      {
        key: "rules",
        duration: 220,
        node: (
          <Section duration={220} className="justify-center px-16 pt-[40px]">
            <SeriesTag episode="08" label="Your first month" />
            <div className="mt-[110px]">
              <RowList rows={RULES} start={10} step={16} compact />
            </div>
          </Section>
        ),
      },
      {
        key: "close",
        duration: 85,
        node: (
          <Section duration={85} className="justify-center px-16">
            <Headline lines={["Do that for", "four weeks.", "Then we add."]} accentIndex={[2]} size={116} />
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
