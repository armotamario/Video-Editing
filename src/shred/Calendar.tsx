import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { bodyFont, headlineFont, monoFont } from "../fonts";
import { MUTED } from "../palettes";
import { ACCENT, Film, INK, INK_SOFT, Outro, Section, useSectionFade } from "./kit";

/**
 * Four weeks of a real month: twelve sessions, four days missed, the rest
 * walked. The point is that the misses are visible and it still worked.
 */
type Day = "train" | "walk" | "miss" | "rest";

const MONTH: Day[] = [
  "train", "walk", "train", "rest", "train", "walk", "rest",
  "train", "walk", "miss", "rest", "train", "walk", "rest",
  "miss", "walk", "train", "rest", "train", "miss", "rest",
  "train", "walk", "train", "rest", "train", "miss", "rest",
];

const PER_DAY = 7;
const COLS = 7;

const Cell: React.FC<{ kind: Day; index: number; frame: number }> = ({ kind, index, frame }) => {
  const at = 8 + index * PER_DAY;
  const t = interpolate(frame, [at, at + 9], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  /** Stepped so a filled, an outlined and an empty day read apart on a dark ground. */
  const style: Record<Day, { bg: string; border: string; dot: string }> = {
    train: { bg: ACCENT, border: ACCENT, dot: "" },
    walk: { bg: "#1d2836", border: "#4a5b6f", dot: "#9fb0c2" },
    miss: { bg: "transparent", border: "#3d4a5a", dot: "" },
    rest: { bg: "#161f2b", border: "#28323f", dot: "" },
  };
  const s = style[kind];
  return (
    <div
      style={{
        background: s.bg,
        border: `2px solid ${s.border}`,
        opacity: t,
        transform: `scale(${interpolate(t, [0, 1], [0.72, 1])})`,
      }}
      className="flex h-[124px] w-[124px] items-center justify-center rounded-[22px]"
    >
      {kind === "miss" ? (
        <div style={{ background: "#546375" }} className="h-[4px] w-[48px] rounded-full" />
      ) : null}
      {kind === "walk" ? (
        <div style={{ background: s.dot }} className="h-[20px] w-[20px] rounded-full" />
      ) : null}
    </div>
  );
};

const Grid: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const fade = useSectionFade(duration, 8);
  const done = MONTH.slice(0, Math.max(0, Math.floor((frame - 8) / PER_DAY) + 1));
  const trained = done.filter((d) => d === "train").length;
  const missed = done.filter((d) => d === "miss").length;

  return (
    <AbsoluteFill className="items-center justify-center" style={{ opacity: fade }}>
      <div className="flex w-[900px] items-end justify-between">
        <div>
          <div
            style={{ fontFamily: monoFont, color: MUTED }}
            className="text-[24px] uppercase tracking-[0.28em]"
          >
            Sessions
          </div>
          <div
            style={{ fontFamily: headlineFont, color: ACCENT }}
            className="text-[132px] leading-none"
          >
            {String(trained).padStart(2, "0")}
          </div>
        </div>
        <div className="text-right">
          <div
            style={{ fontFamily: monoFont, color: MUTED }}
            className="text-[24px] uppercase tracking-[0.28em]"
          >
            Missed
          </div>
          <div
            style={{ fontFamily: headlineFont, color: INK_SOFT }}
            className="text-[132px] leading-none"
          >
            {String(missed).padStart(2, "0")}
          </div>
        </div>
      </div>

      <div
        className="mt-12 grid gap-4"
        style={{ gridTemplateColumns: `repeat(${COLS}, 124px)` }}
      >
        {MONTH.map((kind, i) => (
          <Cell key={i} kind={kind} index={i} frame={frame} />
        ))}
      </div>

      <div className="mt-12 flex items-center gap-10">
        {([
          ["Trained", ACCENT, true],
          ["Walked", "#4a5b6f", false],
          ["Missed", "#3d4a5a", false],
        ] as const).map(([label, colour, filled]) => (
          <div key={label} className="flex items-center gap-4">
            <div
              style={{
                background: filled ? colour : "transparent",
                border: `2px solid ${colour}`,
              }}
              className="h-[26px] w-[26px] rounded-[8px]"
            />
            <div
              style={{ fontFamily: monoFont, color: MUTED }}
              className="text-[24px] uppercase tracking-[0.2em]"
            >
              {label}
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

export const Calendar: React.FC = () => (
  <Film
    track="drive"
    palette="mfbaMidnight"
    sections={[
      {
        key: "hook",
        duration: 62,
        node: (
          <Section duration={62} className="justify-center px-16">
            <div
              style={{ fontFamily: headlineFont, color: INK }}
              className="text-[126px] leading-[0.95] tracking-wide"
            >
              This is a
            </div>
            <div
              style={{ fontFamily: headlineFont, color: ACCENT }}
              className="text-[126px] leading-[0.95] tracking-wide"
            >
              good month.
            </div>
            <div
              style={{ fontFamily: bodyFont, color: INK_SOFT }}
              className="mt-10 text-[34px] font-medium leading-snug"
            >
              Not a perfect one. Watch what it actually looks like.
            </div>
          </Section>
        ),
      },
      { key: "grid", duration: 236, node: <Grid duration={236} /> },
      {
        key: "close",
        duration: 118,
        node: (
          <Section duration={118} className="justify-center px-16">
            <div
              style={{ fontFamily: headlineFont, color: INK }}
              className="text-[124px] leading-[0.95] tracking-wide"
            >
              Four missed.
            </div>
            <div
              style={{ fontFamily: headlineFont, color: ACCENT }}
              className="text-[124px] leading-[0.95] tracking-wide"
            >
              Still twelve in.
            </div>
            <div
              style={{ fontFamily: bodyFont, color: INK_SOFT }}
              className="mt-10 text-[33px] font-medium leading-snug"
            >
              Nobody gets a clean sheet. They just never miss twice.
            </div>
          </Section>
        ),
      },
      { key: "outro", duration: 64, node: <Outro /> },
    ]}
  />
);
