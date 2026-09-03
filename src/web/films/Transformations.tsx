import { Film, Headline, Kicker, Outro, Section } from "../kit";
import { SITES } from "../sites";
import { BeforeAfterScene } from "./beforeAfter";

/** Three rapid old-to-new flips back to back. */
export const Transformations: React.FC = () => (
  <Film
    track="trap"
    palette="plum"
    sections={[
      {
        key: "hook",
        duration: 80,
        node: (
          <Section duration={80} className="items-center justify-center px-20">
            <Kicker>Website transformations</Kicker>
            <div className="mt-10">
              <Headline lines={["Three sites.", "Three rebuilds."]} goldIndex={[1]} align="center" size={112} />
            </div>
          </Section>
        ),
      },
      {
        key: "one",
        duration: 100,
        node: <BeforeAfterScene site={SITES.barber} duration={100} wipeStart={14} wipeEnd={72} caption="Barbershop" />,
      },
      {
        key: "two",
        duration: 100,
        node: <BeforeAfterScene site={SITES.cafe} duration={100} wipeStart={14} wipeEnd={72} caption="Espresso bar" />,
      },
      {
        key: "three",
        duration: 100,
        node: <BeforeAfterScene site={SITES.trade} duration={100} wipeStart={14} wipeEnd={72} caption="Plumbing" />,
      },
      { key: "outro", duration: 100, node: <Outro /> },
    ]}
  />
);
