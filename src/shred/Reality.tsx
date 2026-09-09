import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { bodyFont, headlineFont, monoFont } from "../fonts";
import { LINE, MUTED } from "../palettes";
import { ACCENT, Film, INK, INK_SOFT, Outro, Section, useSectionFade } from "./kit";

/** Sixteen weekly weigh-ins. The straight line is the one people expect. */
const START = 92.4;
const END = 84.0;
const ACTUAL = [
  92.4, 91.5, 91.8, 90.6, 89.9, 90.2, 89.8, 89.9,
  90.1, 89.6, 88.4, 87.5, 87.6, 86.2, 85.1, 84.0,
];

const W = 900;
const H = 620;
const PAD = 46;
const LO = 83.0;
const HI = 93.5;

const px = (i: number) => PAD + (i / (ACTUAL.length - 1)) * (W - PAD * 2);
const py = (kg: number) => PAD + ((HI - kg) / (HI - LO)) * (H - PAD * 2);

const path = (values: number[]) =>
  values.map((v, i) => `${i === 0 ? "M" : "L"}${px(i).toFixed(1)},${py(v).toFixed(1)}`).join(" ");

const EXPECTED = ACTUAL.map((_, i) => START + ((END - START) * i) / (ACTUAL.length - 1));

/** A line that draws itself left to right. */
const Trace: React.FC<{
  d: string;
  colour: string;
  width: number;
  from: number;
  frames: number;
  dashed?: boolean;
}> = ({ d, colour, width, from, frames, dashed }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [from, from + frames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const len = 3000;
  return (
    <path
      d={d}
      fill="none"
      stroke={colour}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={dashed ? "10 12" : `${len} ${len}`}
      strokeDashoffset={dashed ? 0 : len * (1 - t)}
      opacity={dashed ? t : 1}
    />
  );
};

const Chart: React.FC<{ duration: number; showActual: boolean; showPlateau: boolean }> = ({
  duration,
  showActual,
  showPlateau,
}) => {
  const fade = useSectionFade(duration, 8);
  const frame = useCurrentFrame();
  const plateauIn = interpolate(frame, [58, 74], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill className="items-center justify-center" style={{ opacity: fade }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        {[86, 88, 90, 92].map((kg) => (
          <g key={kg}>
            <line x1={PAD} x2={W - PAD} y1={py(kg)} y2={py(kg)} stroke={LINE} strokeWidth={1} />
            <text
              x={PAD - 12}
              y={py(kg) + 8}
              textAnchor="end"
              fill={MUTED}
              fontFamily={monoFont}
              fontSize={22}
            >
              {kg}
            </text>
          </g>
        ))}

        {showPlateau ? (
          <g opacity={plateauIn}>
            <rect
              x={px(4)}
              y={PAD}
              width={px(9) - px(4)}
              height={H - PAD * 2}
              fill={ACCENT}
              opacity={0.08}
            />
            <text
              x={(px(4) + px(9)) / 2}
              y={PAD + 34}
              textAnchor="middle"
              fill={ACCENT}
              fontFamily={monoFont}
              fontSize={24}
              fontWeight={700}
            >
              5 WEEKS, NOTHING
            </text>
          </g>
        ) : null}

        <Trace d={path(EXPECTED)} colour={MUTED} width={3} from={0} frames={40} dashed />
        <text
          x={px(11)}
          y={py(EXPECTED[11]) - 18}
          fill={MUTED}
          fontFamily={monoFont}
          fontSize={23}
          opacity={interpolate(frame, [34, 48], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
        >
          what you expect
        </text>

        {showActual ? (
          <>
            <Trace d={path(ACTUAL)} colour={ACCENT} width={7} from={10} frames={62} />
            <text
              x={px(2)}
              y={py(ACTUAL[2]) - 26}
              fill={ACCENT}
              fontFamily={monoFont}
              fontSize={25}
              fontWeight={700}
              opacity={interpolate(frame, [40, 56], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
            >
              what happens
            </text>
          </>
        ) : null}
      </svg>

      <div
        style={{ fontFamily: monoFont, color: MUTED }}
        className="mt-2 text-[24px] uppercase tracking-[0.28em]"
      >
        Weight, kg · 16 weeks
      </div>
    </AbsoluteFill>
  );
};

export const Reality: React.FC = () => (
  <Film
    track="pace"
    palette="mfbaGraphite"
    sections={[
      {
        key: "hook",
        duration: 66,
        node: (
          <Section duration={66} className="justify-center px-16">
            <div
              style={{ fontFamily: headlineFont, color: INK }}
              className="text-[128px] leading-[0.95] tracking-wide"
            >
              Sixteen weeks.
            </div>
            <div
              style={{ fontFamily: headlineFont, color: ACCENT }}
              className="text-[128px] leading-[0.95] tracking-wide"
            >
              Eight kilos.
            </div>
            <div
              style={{ fontFamily: bodyFont, color: INK_SOFT }}
              className="mt-10 text-[34px] font-medium leading-snug"
            >
              Not one of those weeks looked like progress.
            </div>
          </Section>
        ),
      },
      { key: "expected", duration: 60, node: <Chart duration={60} showActual={false} showPlateau={false} /> },
      { key: "actual", duration: 120, node: <Chart duration={120} showActual showPlateau={false} /> },
      { key: "plateau", duration: 110, node: <Chart duration={110} showActual showPlateau /> },
      {
        key: "close",
        duration: 60,
        node: (
          <Section duration={60} className="justify-center px-16">
            <div
              style={{ fontFamily: headlineFont, color: INK }}
              className="text-[124px] leading-[0.95] tracking-wide"
            >
              Same finish.
            </div>
            <div
              style={{ fontFamily: headlineFont, color: ACCENT }}
              className="text-[124px] leading-[0.95] tracking-wide"
            >
              Uglier line.
            </div>
            <div
              style={{ fontFamily: bodyFont, color: INK_SOFT }}
              className="mt-8 text-[32px] font-medium"
            >
              Weigh weekly, judge monthly. General fitness content, not medical advice.
            </div>
          </Section>
        ),
      },
      { key: "outro", duration: 64, node: <Outro /> },
    ]}
  />
);
