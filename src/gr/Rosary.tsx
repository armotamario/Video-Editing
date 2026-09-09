import { Benefits, Body, Film, Headline, Kicker, Outro, Proof, Section } from "./kit";

export const Rosary: React.FC = () => (
  <Film
    track="chant"
    palette="indigo"
    sections={[
      {
        key: "hook",
        duration: 85,
        node: (
          <Section duration={85}>
            <Kicker>Fifty beads</Kicker>
            <div className="mt-10">
              <Headline lines={["You don't need", "an hour.", "Start with one."]} goldIndex={[2]} />
            </div>
            <div className="mt-10">
              <Body delay={22}>One decade is four minutes. You've wasted four minutes today already.</Body>
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
            quote="Greetings, favoured one! The Lord is with you."
            cite="Luke 1:28 · NRSV"
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
            quote="Meditation engages thought, imagination, emotion and desire."
            cite="Catechism 2708"
          />
        ),
      },
      {
        key: "benefits",
        duration: 120,
        node: (
          <Section duration={120} className="justify-center px-16">
            <Kicker>How to actually keep it up</Kicker>
            <div className="mt-10">
              <Benefits
                start={10}
                points={[
                  { title: "One decade, not five", note: "Finish something small rather than abandon something big." },
                  { title: "Same time every day", note: "In the car, on the walk, before the phone." },
                  { title: "Hold the beads", note: "Your hands keep count so your mind doesn't have to." },
                  { title: "Picture the mystery", note: "Otherwise it's just words with the sound off." },
                ]}
              />
            </div>
          </Section>
        ),
      },
      { key: "outro", duration: 95, node: <Outro cta="One decade tonight" /> },
    ]}
  />
);
