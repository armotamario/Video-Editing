import { Body, Film, Headline, Kicker, Outro, RowList, Section, SeriesTag } from "./kit";

const RULES = [
  { title: "Never miss twice", note: "One session is a bad week. Two is a new habit.", tag: "01" },
  { title: "Ten minutes counts", note: "Turning up badly beats not turning up.", tag: "02" },
  { title: "Plan it on Sunday", note: "Decide the days once, so you're not deciding daily.", tag: "03" },
  { title: "Make it boring", note: "The same few meals, the same few lifts.", tag: "04" },
  { title: "Judge the month", note: "Twelve sessions out of twelve is the only score.", tag: "05" },
];

export const Consistency: React.FC = () => (
  <Film
    track="pace"
    palette="mfbaNight"
    sections={[
      {
        key: "hook",
        duration: 80,
        node: (
          <Section duration={80}>
            <Kicker>Staying on</Kicker>
            <div className="mt-10">
              <Headline lines={["Missing one", "isn't the", "problem."]} accentIndex={[2]} />
            </div>
            <div className="mt-10">
              <Body delay={22}>Missing the one after it is. That's where everyone loses a year.</Body>
            </div>
          </Section>
        ),
      },
      {
        key: "rules",
        duration: 220,
        node: (
          <Section duration={220} className="justify-center px-16 pt-[40px]">
            <SeriesTag episode="11" label="How it survives" />
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
            <Headline lines={["Motivation", "runs out.", "The plan doesn't."]} accentIndex={[2]} size={110} />
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
