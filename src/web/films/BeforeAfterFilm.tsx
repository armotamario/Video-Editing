import { Body, Film, Headline, Kicker, Outro, PointList, Section } from "../kit";
import { SITES } from "../sites";
import { BeforeAfterScene } from "./beforeAfter";

export const BeforeAfterFilm: React.FC = () => (
  <Film
    track="trap"
    palette="teal"
    sections={[
      {
        key: "hook",
        duration: 95,
        node: (
          <Section duration={95}>
            <Kicker>Before &amp; after</Kicker>
            <div className="mt-10">
              <Headline lines={["Same business.", "Same prices.", "New website."]} goldIndex={[2]} />
            </div>
            <div className="mt-10">
              <Body delay={24}>The work never changed. Only what people see before they call.</Body>
            </div>
          </Section>
        ),
      },
      {
        key: "wipe",
        duration: 170,
        node: <BeforeAfterScene site={SITES.barber} duration={170} caption="Barbershop · Melbourne" />,
      },
      {
        key: "changed",
        duration: 120,
        node: (
          <Section duration={120}>
            <Kicker>What actually changed</Kicker>
            <div className="mt-10">
              <PointList
                start={12}
                step={16}
                points={[
                  { title: "One clear thing to do", note: "Book, call or order — decided before you scroll." },
                  { title: "Built for a phone first", note: "Where nearly every local search starts." },
                  { title: "Looks like the real shop", note: "Photos, prices and hours, not stock filler." },
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
