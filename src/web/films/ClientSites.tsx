import { Body, Film, Headline, Kicker, Outro, PointList, Section } from "../kit";
import { SITES } from "../sites";
import { SiteShowcase } from "./showcase";

export const ClientSites: React.FC = () => (
  <Film
    track="cinematic"
    sections={[
      {
        key: "hook",
        duration: 90,
        node: (
          <Section duration={90}>
            <Kicker>Recent work</Kicker>
            <div className="mt-10">
              <Headline lines={["Built, shipped,", "live."]} goldIndex={[1]} />
            </div>
            <div className="mt-10">
              <Body delay={22}>Local businesses in Melbourne, each one built from scratch.</Body>
            </div>
          </Section>
        ),
      },
      { key: "a", duration: 100, node: <SiteShowcase site={SITES.trade} duration={100} label="Plumbing · Preston" scrollTo={0.8} /> },
      { key: "b", duration: 100, node: <SiteShowcase site={SITES.cafe} duration={100} label="Espresso bar · Brunswick" scrollTo={0.8} /> },
      {
        key: "how",
        duration: 95,
        node: (
          <Section duration={95}>
            <Kicker>How they ship</Kicker>
            <div className="mt-10">
              <PointList
                start={12}
                step={16}
                points={[
                  { title: "2–3 week turnaround", note: "Concept, build and launch." },
                  { title: "Mobile-first", note: "Designed on the phone before the desktop." },
                  { title: "Yours to keep", note: "Your domain, your content, your site." },
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
