import { Benefits, Body, Film, Headline, Kicker, Outro, Proof, Section } from "./kit";

export const CrossFilm: React.FC = () => (
  <Film
    track="hymn"
    palette="slate"
    sections={[
      {
        key: "hook",
        duration: 85,
        node: (
          <Section duration={85}>
            <Kicker>Why we wear it</Kicker>
            <div className="mt-10">
              <Headline lines={["It's not", "jewellery."]} goldIndex={[1]} />
            </div>
            <div className="mt-12">
              <Body delay={22}>
                An instrument of execution, worn on purpose, by people who believe it ended in
                something else.
              </Body>
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
            quote="The message about the cross is foolishness to those who are perishing, but to us who are being saved it is the power of God."
            cite="1 Corinthians 1:18 · NRSV"
          />
        ),
      },
      {
        key: "proof-2",
        duration: 90,
        node: (
          <Proof
            duration={90}
            size={58}
            quote="May I never boast of anything except the cross of our Lord Jesus Christ."
            cite="Galatians 6:14 · NRSV"
          />
        ),
      },
      {
        key: "benefits",
        duration: 120,
        node: (
          <Section duration={120} className="justify-center px-16">
            <Kicker>What it does</Kicker>
            <div className="mt-10">
              <Benefits
                start={10}
                points={[
                  { title: "It's a claim", note: "Before you say anything, it has already said something." },
                  { title: "It's a reminder", note: "Mostly to you, every time you catch it in the mirror." },
                  { title: "It starts conversations", note: "Some of them the ones you've been avoiding." },
                  { title: "It costs you something", note: "That's the point. It always has been." },
                ]}
              />
            </div>
          </Section>
        ),
      },
      { key: "outro", duration: 95, node: <Outro cta="Wear what you believe" /> },
    ]}
  />
);
