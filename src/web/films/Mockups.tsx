import { Film, Headline, Kicker, Outro, Section, Body } from "../kit";
import { SITES } from "../sites";
import { SiteShowcase } from "./showcase";

export const Mockups: React.FC = () => (
  <Film
    track="uplift"
    palette="espresso"
    sections={[
      {
        key: "hook",
        duration: 95,
        node: (
          <Section duration={95}>
            <Kicker>Website mockups</Kicker>
            <div className="mt-10">
              <Headline lines={["You see your", "new website", "before you pay."]} goldIndex={[1]} />
            </div>
            <div className="mt-10">
              <Body delay={22}>Every build starts with a free concept, designed around your business — not a template.</Body>
            </div>
          </Section>
        ),
      },
      { key: "a", duration: 80, node: <SiteShowcase site={SITES.barber} duration={80} label="Concept 01 · Barbershop" /> },
      { key: "b", duration: 80, node: <SiteShowcase site={SITES.cafe} duration={80} label="Concept 02 · Cafe" /> },
      { key: "c", duration: 80, node: <SiteShowcase site={SITES.trade} duration={80} label="Concept 03 · Trades" /> },
      {
        key: "payoff",
        duration: 50,
        node: (
          <Section duration={50} className="items-center justify-center px-20">
            <Headline lines={["No template.", "No obligation."]} goldIndex={[1]} align="center" size={112} />
          </Section>
        ),
      },
      { key: "outro", duration: 95, node: <Outro /> },
    ]}
  />
);
