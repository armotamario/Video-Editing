import { Benefits, Body, Film, Headline, Kicker, Outro, Proof, Section } from "./kit";

export const BibleFilm: React.FC = () => (
  <Film
    track="chant"
    palette="bone"
    sections={[
      {
        key: "hook",
        duration: 85,
        node: (
          <Section duration={85}>
            <Kicker>The Word</Kicker>
            <div className="mt-10">
              <Headline lines={["You finished", "the feed.", "Not the Gospel."]} goldIndex={[2]} />
            </div>
            <div className="mt-10">
              <Body delay={22}>One of them is still going to matter in a hundred years.</Body>
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
            size={56}
            quote="All scripture is inspired by God and is useful for teaching, for reproof, for correction, and for training in righteousness."
            cite="2 Timothy 3:16 · NRSV"
          />
        ),
      },
      {
        key: "proof-2",
        duration: 90,
        node: (
          <Proof
            duration={90}
            size={76}
            quote="Ignorance of Scripture is ignorance of Christ."
            cite="St Jerome · Catechism 133"
          />
        ),
      },
      {
        key: "benefits",
        duration: 120,
        node: (
          <Section duration={120}>
            <Kicker>How to actually start</Kicker>
            <div className="mt-8">
              <Benefits
                start={10}
                step={15}
                points={[
                  { title: "Begin with Mark", note: "The shortest Gospel. Sixteen chapters." },
                  { title: "One chapter a day", note: "Ten minutes. Before the phone." },
                  { title: "Read it out loud", note: "You'll hold on to twice as much." },
                  { title: "Write one line down", note: "The verse that stopped you." },
                ]}
              />
            </div>
          </Section>
        ),
      },
      { key: "outro", duration: 95, node: <Outro cta="Open it tonight" /> },
    ]}
  />
);
