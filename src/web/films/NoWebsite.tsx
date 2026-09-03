import { interpolate, useCurrentFrame } from "remotion";
import {
  Body,
  Film,
  GOLD,
  Headline,
  Kicker,
  Outro,
  Section,
  bodyFont,
  monoFont,
  serifFont,
  useRise,
} from "../kit";

const RESULTS = [
  { name: "Northside Plumbing", url: "northsideplumbing.com.au", meta: "4.8 ★ · Open now · Preston", site: true },
  { name: "Ridge & Co Plumbing", url: "ridgeplumbing.com.au", meta: "4.6 ★ · Open now · Coburg", site: true },
  { name: "Your business", url: "No website found", meta: "Phone number only", site: false },
];

/** A generic phone search sheet — the third listing is the one with no site. */
const SearchMock: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const sheetIn = useRise(0, 15);
  const chosen = frame > 120;

  return (
    <Section duration={duration} className="items-center justify-center px-16">
      <div
        style={{
          transform: `translateY(${interpolate(sheetIn, [0, 1], [70, 0])}px)`,
          opacity: sheetIn,
          background: "#ffffff",
          boxShadow: "0 40px 90px rgba(0,0,0,0.55)",
        }}
        className="w-full rounded-[36px] p-10"
      >
        <div
          style={{ background: "#f1f0ee", fontFamily: bodyFont, color: "#33312e" }}
          className="rounded-full px-9 py-6 text-[34px] font-medium"
        >
          plumber near me
        </div>

        {RESULTS.map((result, i) => {
          const rowIn = interpolate(frame, [18 + i * 22, 42 + i * 22], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const dim = !result.site;
          const highlight = chosen && i === 0;
          return (
            <div
              key={result.name}
              style={{
                opacity: rowIn * (dim ? 0.55 : 1),
                borderTop: "1px solid #e4e2df",
                background: highlight ? "#fdf4e3" : "transparent",
              }}
              className="mt-2 rounded-[18px] px-4 py-8"
            >
              <div
                style={{ fontFamily: serifFont, color: dim ? "#8a8781" : "#141310" }}
                className="text-[42px] font-bold tracking-[-0.01em]"
              >
                {result.name}
              </div>
              <div
                style={{
                  fontFamily: monoFont,
                  color: dim ? "#a09d97" : "#1a56c4",
                  textDecoration: dim ? "line-through" : "none",
                }}
                className="mt-3 text-[26px]"
              >
                {result.url}
              </div>
              <div style={{ fontFamily: bodyFont, color: "#6d6a65" }} className="mt-3 text-[26px] font-medium">
                {result.meta}
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          opacity: interpolate(frame, [126, 148], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          fontFamily: monoFont,
          color: GOLD,
        }}
        className="mt-14 text-[30px] font-bold uppercase tracking-[0.3em]"
      >
        They tapped the first one
      </div>
    </Section>
  );
};

export const NoWebsite: React.FC = () => (
  <Film
    track="tense"
    palette="indigo"
    sections={[
      {
        key: "hook",
        duration: 95,
        node: (
          <Section duration={95}>
            <Kicker>No website?</Kicker>
            <div className="mt-10">
              <Headline lines={["They're not", "choosing you.", "They can't find you."]} goldIndex={[2]} />
            </div>
            <div className="mt-10">
              <Body delay={24}>Here's what a customer actually sees when they go looking.</Body>
            </div>
          </Section>
        ),
      },
      { key: "search", duration: 195, node: <SearchMock duration={195} /> },
      {
        key: "payoff",
        duration: 95,
        node: (
          <Section duration={95} className="justify-center px-20">
            <Headline lines={["A social page", "is not an address.", "It's a rented room."]} goldIndex={[2]} size={96} />
            <div className="mt-10">
              <Body delay={24}>Your site is the one place a customer can check you out, see prices and book — without asking.</Body>
            </div>
          </Section>
        ),
      },
      { key: "outro", duration: 95, node: <Outro /> },
    ]}
  />
);
