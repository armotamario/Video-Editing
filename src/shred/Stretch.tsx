import { Body, Film, Headline, Kicker, Outro, RowList, Section, SeriesTag } from "./kit";

const ROUTINE = [
  { title: "Vertigo drills", tag: "60s" },
  { title: "Back", tag: "60s" },
  { title: "Ankles", tag: "60s" },
  { title: "Calves", tag: "60s" },
  { title: "Glutes", tag: "60s" },
  { title: "Quads", tag: "60s" },
  { title: "Abdominal massage", tag: "2 min" },
  { title: "Stomach massage", tag: "2 min" },
  { title: "Pelvic floor", tag: "60s" },
];

export const Stretch: React.FC = () => (
  <Film
    track="mobility"
    palette="mfbaMidnight"
    sections={[
      {
        key: "hook",
        duration: 85,
        node: (
          <Section duration={85}>
            <Kicker>Ten minutes a day</Kicker>
            <div className="mt-10">
              <Headline lines={["A stiff body", "gives back", "half the work."]} accentIndex={[2]} />
            </div>
            <div className="mt-10">
              <Body delay={22}>This is the order I run mine, top to bottom.</Body>
            </div>
          </Section>
        ),
      },
      {
        key: "routine",
        duration: 160,
        node: (
          <Section duration={160} className="justify-center px-16 pt-[60px]">
            <SeriesTag episode="01" label="Mobility" />
            <div className="mt-[120px]">
              <RowList rows={ROUTINE} start={10} step={9} compact />
            </div>
          </Section>
        ),
      },
      {
        key: "how",
        duration: 140,
        node: (
          <Section duration={140}>
            <Kicker>How to run it</Kicker>
            <div className="mt-8">
              <RowList
                start={10}
                step={15}
                rows={[
                  { title: "At night, not before lifting", note: "Long holds before a session cost you strength." },
                  { title: "Breathe out into it", note: "The stretch happens on the exhale, not the push." },
                  { title: "Every day beats twice a week", note: "Ten easy minutes, not one brutal hour." },
                ]}
              />
            </div>
          </Section>
        ),
      },
      {
        key: "outro",
        duration: 95,
        node: <Outro note="General fitness content, not medical advice. Vertigo and pelvic-floor work should be cleared with your doctor or physio first." />,
      },
    ]}
  />
);
