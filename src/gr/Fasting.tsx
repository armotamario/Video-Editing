import { Benefits, Body, Film, Headline, Kicker, Outro, Proof, Section } from "./kit";

export const Fasting: React.FC = () => (
  <Film
    track="procession"
    palette="forest"
    sections={[
      {
        key: "hook",
        duration: 85,
        node: (
          <Section duration={85}>
            <Kicker>One day a week</Kicker>
            <div className="mt-10">
              <Headline lines={["You've never", "gone without", "anything."]} goldIndex={[2]} />
            </div>
            <div className="mt-10">
              <Body delay={22}>Neither had I. That's exactly why it's worth starting.</Body>
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
            quote="When you fast, do not look dismal, so that your fasting may be seen not by others but by your Father."
            cite="Matthew 6:16–18 · NRSV"
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
            quote="Abstinence from meat is to be observed on all Fridays of the year."
            cite="Code of Canon Law, c. 1251"
          />
        ),
      },
      {
        key: "benefits",
        duration: 120,
        node: (
          <Section duration={120} className="justify-center px-16">
            <Kicker>Start here</Kicker>
            <div className="mt-10">
              <Benefits
                start={10}
                points={[
                  { title: "Fridays, no meat", note: "It's already asked of you. Start with what's already asked." },
                  { title: "Give up one thing you'd miss", note: "Coffee, the second helping, the scroll after dinner." },
                  { title: "Give away what it saved you", note: "Otherwise it's just a diet with a religious name." },
                  { title: "Don't announce it", note: "The moment you post about it, that's the reward gone." },
                ]}
              />
            </div>
          </Section>
        ),
      },
      { key: "outro", duration: 95, node: <Outro cta="Try it this Friday" /> },
    ]}
  />
);
