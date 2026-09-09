import { Benefits, Body, Film, Headline, Kicker, Outro, Proof, Section } from "./kit";

export const Confession: React.FC = () => (
  <Film
    track="vigil"
    palette="plum"
    sections={[
      {
        key: "hook",
        duration: 85,
        node: (
          <Section duration={85}>
            <Kicker>How long has it been?</Kicker>
            <div className="mt-10">
              <Headline lines={["It's been years.", "He's still", "waiting."]} goldIndex={[2]} />
            </div>
            <div className="mt-10">
              <Body delay={22}>The longer you leave it, the bigger it feels. It isn't.</Body>
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
            size={58}
            quote="If you forgive the sins of any, they are forgiven them."
            cite="John 20:23 · NRSV"
          />
        ),
      },
      {
        key: "proof-2",
        duration: 90,
        node: (
          <Proof
            duration={90}
            size={54}
            quote="Those who approach the sacrament obtain pardon from God's mercy for the offence committed against him."
            cite="Catechism 1422"
          />
        ),
      },
      {
        key: "benefits",
        duration: 120,
        node: (
          <Section duration={120} className="justify-center px-16">
            <Kicker>If you're going back</Kicker>
            <div className="mt-10">
              <Benefits
                start={10}
                points={[
                  { title: "Say how long it's been", note: "First line, out of the way. He has heard it before." },
                  { title: "Five minutes beforehand", note: "Sit down and think it through, so you're not guessing." },
                  { title: "Say the worst one first", note: "Everything after it gets easier." },
                  { title: "Do your penance that day", note: "Before the feeling wears off." },
                ]}
              />
            </div>
          </Section>
        ),
      },
      { key: "outro", duration: 95, node: <Outro cta="Go this Saturday" /> },
    ]}
  />
);
