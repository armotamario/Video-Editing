import { Body, Film, Headline, Kicker, Outro, RowList, Section, SeriesTag } from "./kit";

const LEVERS = [
  { title: "Add a rep", note: "Eight became nine. That's a session that counted.", tag: "01" },
  { title: "Add a set", note: "Three to four, once the reps stop climbing.", tag: "02" },
  { title: "Add weight", note: "Smallest jump available, then rebuild the reps.", tag: "03" },
  { title: "Slow the way down", note: "Three seconds lowering is harder than more weight.", tag: "04" },
  { title: "Cut the rest", note: "Same work in less time is still more work.", tag: "05" },
];

export const Overload: React.FC = () => (
  <Film
    track="bodyweight"
    palette="mfbaClay"
    sections={[
      {
        key: "hook",
        duration: 80,
        node: (
          <Section duration={80}>
            <Kicker>Progressive overload</Kicker>
            <div className="mt-10">
              <Headline lines={["Same weight", "for six months", "= same body."]} accentIndex={[2]} size={116} />
            </div>
            <div className="mt-10">
              <Body delay={22}>The gym doesn't change you. Beating last week does.</Body>
            </div>
          </Section>
        ),
      },
      {
        key: "levers",
        duration: 220,
        node: (
          <Section duration={220} className="justify-center px-16 pt-[40px]">
            <SeriesTag episode="10" label="Five ways to add" />
            <div className="mt-[110px]">
              <RowList rows={LEVERS} start={10} step={16} compact />
            </div>
          </Section>
        ),
      },
      {
        key: "close",
        duration: 85,
        node: (
          <Section duration={85} className="justify-center px-16">
            <Headline lines={["Write it down.", "Or you won't", "know."]} accentIndex={[0]} size={116} />
            <div className="mt-10">
              <Body delay={18}>One of the five, every session. General fitness content, not medical advice.</Body>
            </div>
          </Section>
        ),
      },
      { key: "outro", duration: 95, node: <Outro /> },
    ]}
  />
);
