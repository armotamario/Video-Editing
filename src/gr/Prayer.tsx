import { Benefits, Body, Film, Headline, Kicker, Outro, Proof, Section } from "./kit";

export const Prayer: React.FC = () => (
  <Film
    track="vigil"
    palette="sand"
    sections={[
      {
        key: "hook",
        duration: 85,
        node: (
          <Section duration={85}>
            <Kicker>Have you prayed today?</Kicker>
            <div className="mt-10">
              <Headline lines={["You'll scroll", "for an hour.", "Give Him five."]} goldIndex={[2]} />
            </div>
            <div className="mt-10">
              <Body delay={22}>You already have the time. You're spending it somewhere else.</Body>
            </div>
          </Section>
        ),
      },
      {
        key: "proof-1",
        duration: 90,
        node: (
          <Proof
            duration={90}
            size={62}
            quote="Rejoice always, pray without ceasing, give thanks in all circumstances."
            cite="1 Thessalonians 5:16–18 · NRSV"
          />
        ),
      },
      {
        key: "proof-2",
        duration: 90,
        node: (
          <Proof
            duration={90}
            size={56}
            quote="Prayer is the raising of one's mind and heart to God or the requesting of good things from God."
            cite="St John Damascene · Catechism 2559"
          />
        ),
      },
      {
        key: "benefits",
        duration: 120,
        node: (
          <Section duration={120}>
            <Kicker>Start here</Kicker>
            <div className="mt-8">
              <Benefits
                start={10}
                step={15}
                points={[
                  { title: "One minute, first", note: "Before the phone. Before anything else." },
                  { title: "Use your own words", note: "He isn't marking your grammar." },
                  { title: "Same time every day", note: "A habit holds when the feeling doesn't." },
                  { title: "Finish with thanks", note: "Name one thing from today." },
                ]}
              />
            </div>
          </Section>
        ),
      },
      { key: "outro", duration: 95, node: <Outro cta="Pray today" /> },
    ]}
  />
);
