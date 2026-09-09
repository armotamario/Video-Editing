import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { monoFont, serifFont } from "../fonts";
import { Film, GOLD, INK, INK_SOFT, Outro, Section, useSectionFade } from "./kit";

/**
 * Two thousand years on one rule. The empires are bars that start and stop;
 * the gold line above them never breaks.
 */
const SPAN_START = 0;
const PX_PER_YEAR = 2.6;

const SPANS: { name: string; from: number; to: number }[] = [
  { name: "Western Rome", from: 27, to: 476 },
  { name: "Byzantium", from: 395, to: 1453 },
  { name: "The Caliphates", from: 632, to: 1258 },
  { name: "Holy Roman Empire", from: 962, to: 1806 },
  { name: "Spanish Empire", from: 1492, to: 1898 },
  { name: "British Empire", from: 1583, to: 1997 },
  { name: "Soviet Union", from: 1922, to: 1991 },
];

/** Pack overlapping spans into lanes so no two share a row at the same time. */
const laneEnds: number[] = [];
const EMPIRES = [...SPANS]
  .sort((a, b) => a.from - b.from)
  .map((e) => {
    let row = laneEnds.findIndex((end) => end <= e.from);
    if (row === -1) {
      row = laneEnds.length;
      laneEnds.push(e.to);
    } else {
      laneEnds[row] = e.to;
    }
    return { ...e, row };
  });

const x = (year: number) => (year - SPAN_START) * PX_PER_YEAR;

const Rule: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const fade = useSectionFade(duration, 8);
  const year = interpolate(frame, [0, duration - 26], [33, 2026], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shift = 540 - x(year);

  return (
    <AbsoluteFill className="justify-center" style={{ opacity: fade, overflow: "hidden" }}>
      <div
        style={{ fontFamily: monoFont, color: GOLD }}
        className="absolute left-[54px] top-[178px] z-10 text-[32px] font-bold uppercase tracking-[0.18em]"
      >
        The Church · unbroken
      </div>

      <div className="absolute left-0 right-0 top-[300px] text-center">
        <div
          style={{ fontFamily: monoFont, color: INK_SOFT }}
          className="text-[27px] font-bold uppercase tracking-[0.34em]"
        >
          Anno Domini
        </div>
        <div
          style={{ fontFamily: serifFont, color: GOLD }}
          className="mt-4 text-[150px] font-bold leading-none tabular-nums"
        >
          {Math.round(year)}
        </div>
      </div>

      <div style={{ transform: `translateX(${shift}px)` }} className="relative h-[620px] w-[6200px]">
        {/* the century ticks */}
        {Array.from({ length: 21 }, (_, i) => i * 100).map((y) => (
          <div key={y} className="absolute top-[300px]" style={{ left: x(y) }}>
            <div style={{ background: `${INK_SOFT}66` }} className="h-[30px] w-[3px]" />
            <div
              style={{ fontFamily: monoFont, color: `${INK_SOFT}aa` }}
              className="mt-3 -translate-x-1/2 text-[26px]"
            >
              {y}
            </div>
          </div>
        ))}

        {/* the unbroken line */}
        <div
          className="absolute top-[228px] rounded-full"
          style={{
            left: x(33),
            width: Math.max(0, x(year) - x(33)),
            height: 38,
            background: GOLD,
          }}
        />

        {/* the empires that started and stopped */}
        {EMPIRES.map((e) => {
          const visible = year > e.from;
          const end = Math.min(year, e.to);
          const dead = year > e.to;
          const top = 376 + e.row * 104;
          return (
            <div key={e.name} style={{ opacity: visible ? 1 : 0 }}>
              <div
                className="absolute rounded-full"
                style={{
                  top,
                  left: x(e.from),
                  width: Math.max(0, x(end) - x(e.from)),
                  height: 22,
                  background: dead ? `${INK_SOFT}44` : INK_SOFT,
                }}
              />
              {/* the label rides the growing tip, so a living empire stays near
                  the playhead and a finished one drifts off with its end date */}
              <div
                className="absolute whitespace-nowrap text-[30px] uppercase tracking-[0.1em]"
                style={{
                  top: top + 30,
                  left: x(end),
                  transform: "translateX(-100%)",
                  fontFamily: monoFont,
                  color: dead ? `${INK_SOFT}77` : INK_SOFT,
                }}
              >
                {e.name}
                {dead ? ` · ended ${e.to}` : ""}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const Timeline: React.FC = () => (
  <Film
    track="procession"
    palette="midnight"
    sections={[
      {
        key: "hook",
        duration: 62,
        node: (
          <Section duration={62} className="justify-center px-16">
            <div
              style={{ fontFamily: monoFont, color: GOLD }}
              className="text-[26px] font-bold uppercase tracking-[0.34em]"
            >
              Two thousand years
            </div>
            <div
              style={{ fontFamily: serifFont, color: INK }}
              className="mt-10 text-[112px] font-bold leading-[1.02]"
            >
              Everything that
              <br />
              was going to
              <br />
              <span style={{ color: GOLD }}>replace it</span> is gone.
            </div>
          </Section>
        ),
      },
      { key: "rule", duration: 268, node: <Rule duration={268} /> },
      {
        key: "close",
        duration: 78,
        node: (
          <Section duration={78} className="items-center justify-center px-16 text-center">
            <div
              style={{ fontFamily: serifFont, color: INK }}
              className="text-[104px] font-bold leading-[1.08]"
            >
              Empires had a plan
              <br />
              for the next century.
            </div>
            <div
              style={{ fontFamily: serifFont, color: GOLD }}
              className="mt-10 text-[104px] font-bold leading-[1.08]"
            >
              She had the next one.
            </div>
          </Section>
        ),
      },
      { key: "outro", duration: 72, node: <Outro cta="Wear what you believe" /> },
    ]}
  />
);
