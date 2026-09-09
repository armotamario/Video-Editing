import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { monoFont, serifFont } from "../fonts";
import { Film, GOLD, Headline, INK, INK_SOFT, Kicker, Outro, Section, useSectionFade } from "./kit";

/** Twenty-four hours, drawn as a ring. The gap at the end is the point. */
const R = 250;
const C = 2 * Math.PI * R;
const HOUR = C / 24;

/**
 * One warm ramp, stepped by lightness so the segments separate on a dark
 * ground. The phone is the lightest on purpose — it's the one to notice.
 */
const BLOCKS: { label: string; hours: number; colour: string; width: number }[] = [
  { label: "Asleep", hours: 8, colour: "#3b3128", width: 46 },
  { label: "Work", hours: 9, colour: "#6d5c4a", width: 46 },
  { label: "The phone", hours: 3, colour: "#c3a888", width: 46 },
  { label: "Everything else", hours: 4, colour: "#52463a", width: 46 },
];

const Arc: React.FC<{
  start: number;
  hours: number;
  colour: string;
  width: number;
  from: number;
}> = ({ start, hours, colour, width, from }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [from, from + 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const len = hours * HOUR * t;
  return (
    <circle
      cx={0}
      cy={0}
      r={R}
      fill="none"
      stroke={colour}
      strokeWidth={width}
      strokeDasharray={`${len} ${C}`}
      strokeDashoffset={-start * HOUR}
      strokeLinecap="butt"
    />
  );
};

const Dial: React.FC<{ duration: number; showPrayer: boolean }> = ({ duration, showPrayer }) => {
  const frame = useCurrentFrame();
  const fade = useSectionFade(duration, 8);
  let at = 0;
  const starts = BLOCKS.map((b) => {
    const s = at;
    at += b.hours;
    return s;
  });
  const prayerIn = interpolate(frame, [10, 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill className="items-center justify-center" style={{ opacity: fade }}>
      <svg width={760} height={760} viewBox="-380 -380 760 760">
        <g transform="rotate(-90)">
          <circle cx={0} cy={0} r={R} fill="none" stroke="#2a231c" strokeWidth={46} />
          {BLOCKS.map((b, i) => (
            <Arc
              key={b.label}
              start={starts[i]}
              hours={b.hours}
              colour={b.colour}
              width={b.width}
              from={6 + i * 18}
            />
          ))}
          {showPrayer ? (
            <circle
              cx={0}
              cy={0}
              r={R}
              fill="none"
              stroke={GOLD}
              strokeWidth={46}
              strokeDasharray={`${HOUR * 0.5 * prayerIn} ${C}`}
              strokeDashoffset={-23.5 * HOUR}
              strokeLinecap="round"
            />
          ) : null}
        </g>
      </svg>

      <AbsoluteFill className="items-center justify-center">
        {showPrayer ? (
          <div className="text-center" style={{ opacity: prayerIn }}>
            <div style={{ fontFamily: serifFont, color: GOLD }} className="text-[128px] font-bold leading-none">
              5 min
            </div>
            <div
              style={{ fontFamily: monoFont, color: INK_SOFT }}
              className="mt-6 text-[26px] uppercase tracking-[0.28em]"
            >
              That's all it takes
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div style={{ fontFamily: serifFont, color: INK }} className="text-[132px] font-bold leading-none">
              24h
            </div>
            <div
              style={{ fontFamily: monoFont, color: INK_SOFT }}
              className="mt-6 text-[26px] uppercase tracking-[0.28em]"
            >
              Your day
            </div>
          </div>
        )}
      </AbsoluteFill>

      <div className="mt-12 flex flex-wrap items-center justify-center gap-x-12 gap-y-6 px-16">
        {BLOCKS.map((b, i) => (
          <div
            key={b.label}
            className="flex items-center gap-4"
            style={{
              opacity: interpolate(frame, [10 + i * 18, 24 + i * 18], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            <div style={{ background: b.colour }} className="h-[22px] w-[22px] rounded-[6px]" />
            <div
              style={{ fontFamily: monoFont, color: INK_SOFT }}
              className="text-[30px] uppercase tracking-[0.14em]"
            >
              {b.label} · {b.hours}h
            </div>
          </div>
        ))}
        {showPrayer ? (
          <div className="flex items-center gap-4" style={{ opacity: prayerIn }}>
            <div style={{ background: GOLD }} className="h-[22px] w-[22px] rounded-[6px]" />
            <div
              style={{ fontFamily: monoFont, color: GOLD }}
              className="text-[30px] uppercase tracking-[0.14em]"
            >
              Prayer · 5 min
            </div>
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

export const DayClock: React.FC = () => (
  <Film
    track="vigil"
    palette="espresso"
    sections={[
      {
        key: "hook",
        duration: 70,
        node: (
          <Section duration={70}>
            <Kicker>Twenty-four hours</Kicker>
            <div className="mt-10">
              <Headline lines={["You have", "the time.", "Look."]} goldIndex={[2]} />
            </div>
          </Section>
        ),
      },
      { key: "dial", duration: 150, node: <Dial duration={150} showPrayer={false} /> },
      {
        key: "gap",
        duration: 76,
        node: (
          <Section duration={76} className="justify-center px-16">
            <Headline lines={["Three hours", "on the phone.", "None with Him."]} goldIndex={[2]} size={98} />
          </Section>
        ),
      },
      { key: "prayer", duration: 110, node: <Dial duration={110} showPrayer /> },
      { key: "outro", duration: 74, node: <Outro cta="Five minutes today" /> },
    ]}
  />
);
