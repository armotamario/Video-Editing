import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { monoFont, serifFont } from "../fonts";
import { Film, GOLD, INK, INK_SOFT, Outro, Section, useSectionFade } from "./kit";

/** A day, itemised. The last line is the one that stings. */
const ITEMS: { label: string; value: string }[] = [
  { label: "Asleep", value: "8h 00m" },
  { label: "Work", value: "9h 00m" },
  { label: "The phone", value: "3h 12m" },
  { label: "Television", value: "1h 20m" },
  { label: "Eating", value: "1h 10m" },
  { label: "Everything else", value: "1h 18m" },
  { label: "Prayer", value: "0h 00m" },
];

const PER_ITEM = 20;
const DASH = "· · · · · · · · · · · · · · · · · · · · · · · · · · · · · ·";

const Row: React.FC<{ label: string; value: string; at: number; accent?: boolean }> = ({
  label,
  value,
  at,
  accent,
}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [at, at + 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      className="flex items-baseline justify-between gap-6 py-[14px]"
      style={{
        opacity: t,
        transform: `translateY(${interpolate(t, [0, 1], [12, 0])}px)`,
        fontFamily: monoFont,
        color: accent ? GOLD : INK,
      }}
    >
      <div className="text-[42px] uppercase tracking-[0.1em]">{label}</div>
      <div className="flex-1 overflow-hidden whitespace-nowrap text-[30px]" style={{ color: `${INK_SOFT}88` }}>
        {DASH}
      </div>
      <div className="text-[42px] tabular-nums">{value}</div>
    </div>
  );
};

const Docket: React.FC<{ duration: number; withPrayer: boolean }> = ({ duration, withPrayer }) => {
  const frame = useCurrentFrame();
  const fade = useSectionFade(duration, 8);
  const totalAt = ITEMS.length * PER_ITEM + 10;
  const totalIn = interpolate(frame, [totalAt, totalAt + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill className="items-center justify-center px-16" style={{ opacity: fade }}>
      <div className="w-full">
        <div className="text-center">
          <div
            style={{ fontFamily: monoFont, color: INK_SOFT }}
            className="text-[28px] uppercase tracking-[0.4em]"
          >
            One day
          </div>
          <div
            style={{ fontFamily: serifFont, color: INK }}
            className="mt-3 text-[74px] font-bold leading-none"
          >
            Itemised
          </div>
        </div>

        <div
          style={{ color: `${INK_SOFT}66`, fontFamily: monoFont }}
          className="mt-8 overflow-hidden whitespace-nowrap text-[26px]"
        >
          {DASH}
          {DASH}
        </div>

        {ITEMS.map((item, i) => (
          <Row
            key={item.label}
            label={item.label}
            value={withPrayer && item.label === "Prayer" ? "0h 05m" : item.value}
            at={i * PER_ITEM}
            accent={item.label === "Prayer"}
          />
        ))}

        <div
          style={{ color: `${INK_SOFT}66`, fontFamily: monoFont, opacity: totalIn }}
          className="mt-2 overflow-hidden whitespace-nowrap text-[26px]"
        >
          {DASH}
          {DASH}
        </div>

        <div
          className="flex items-baseline justify-between pt-5"
          style={{ opacity: totalIn, fontFamily: monoFont, color: INK }}
        >
          <div className="text-[46px] font-bold uppercase tracking-[0.14em]">Total</div>
          <div className="text-[46px] font-bold tabular-nums">24h 00m</div>
        </div>

        <div
          style={{ opacity: totalIn, fontFamily: monoFont, color: GOLD }}
          className="mt-8 text-center text-[30px] font-bold uppercase tracking-[0.34em]"
        >
          {withPrayer ? "Same day. Different day." : "Non-refundable"}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Receipt: React.FC = () => (
  <Film
    track="chant"
    palette="vellum"
    sections={[
      {
        key: "hook",
        duration: 58,
        node: (
          <Section duration={58} className="items-center justify-center px-16 text-center">
            <div
              style={{ fontFamily: monoFont, color: GOLD }}
              className="text-[26px] font-bold uppercase tracking-[0.34em]"
            >
              Where it went
            </div>
            <div
              style={{ fontFamily: serifFont, color: INK }}
              className="mt-10 text-[116px] font-bold leading-[1.02]"
            >
              If your day
              <br />
              came with a
              <br />
              <span style={{ color: GOLD }}>receipt.</span>
            </div>
          </Section>
        ),
      },
      { key: "docket", duration: 190, node: <Docket duration={190} withPrayer={false} /> },
      {
        key: "turn",
        duration: 66,
        node: (
          <Section duration={66} className="items-center justify-center px-16 text-center">
            <div
              style={{ fontFamily: serifFont, color: INK }}
              className="text-[108px] font-bold leading-[1.06]"
            >
              You can't get
              <br />
              the day back.
            </div>
            <div
              style={{ fontFamily: serifFont, color: GOLD }}
              className="mt-8 text-[108px] font-bold leading-[1.06]"
            >
              You get tomorrow.
            </div>
          </Section>
        ),
      },
      { key: "fixed", duration: 100, node: <Docket duration={100} withPrayer /> },
      { key: "outro", duration: 66, node: <Outro cta="Five minutes tomorrow" /> },
    ]}
  />
);
