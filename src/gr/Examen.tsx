import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { monoFont, serifFont } from "../fonts";
import { ACCENT_LINE } from "../palettes";
import { Cross, Film, GOLD, INK, INK_SOFT, Outro, Section, useSectionFade } from "./kit";

/** Five questions, typed out one character at a time and then ticked off. */
const QUESTIONS = [
  "Where was I short with someone?",
  "What did I put ahead of Him?",
  "What am I actually grateful for?",
  "Who do I owe an apology to?",
  "What do I do differently tomorrow?",
];

const TYPE_SPEED = 1.6;
const HOLD = 16;

const lineFrames = (q: string) => Math.ceil(q.length / TYPE_SPEED) + HOLD;

const Line: React.FC<{ text: string; index: number; startAt: number }> = ({
  text,
  index,
  startAt,
}) => {
  const frame = useCurrentFrame();
  const local = frame - startAt;
  const typed = Math.max(0, Math.min(text.length, Math.floor(local * TYPE_SPEED)));
  const done = typed >= text.length;
  const tick = interpolate(local, [text.length / TYPE_SPEED + 4, text.length / TYPE_SPEED + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const caret = !done && Math.floor(frame / 6) % 2 === 0;

  if (local < 0) return null;

  return (
    <div className="flex items-start gap-7 py-6" style={{ borderTop: `1px solid ${ACCENT_LINE}` }}>
      <div
        style={{
          border: `3px solid ${tick > 0.3 ? GOLD : ACCENT_LINE}`,
          background: tick > 0.5 ? GOLD : "transparent",
        }}
        className="mt-3 h-[38px] w-[38px] flex-none rounded-[10px]"
      />
      <div
        style={{ fontFamily: serifFont, color: INK, opacity: 0.45 + 0.55 * (done ? 1 : 0.8) }}
        className="text-[54px] font-medium leading-[1.16]"
      >
        {text.slice(0, typed)}
        {caret ? <span style={{ color: GOLD }}>|</span> : null}
      </div>
      <div className="w-[10px] flex-none" style={{ opacity: 0 }}>
        {index}
      </div>
    </div>
  );
};

const Sheet: React.FC<{ duration: number }> = ({ duration }) => {
  const fade = useSectionFade(duration, 8);
  let at = 0;
  const starts = QUESTIONS.map((q) => {
    const s = at;
    at += lineFrames(q);
    return s;
  });

  return (
    <AbsoluteFill className="justify-center px-16" style={{ opacity: fade }}>
      <div
        style={{ fontFamily: monoFont, color: GOLD }}
        className="mb-8 text-[26px] font-bold uppercase tracking-[0.3em]"
      >
        Tonight, before the phone
      </div>
      {QUESTIONS.map((q, i) => (
        <Line key={q} text={q} index={i} startAt={starts[i]} />
      ))}
    </AbsoluteFill>
  );
};

export const Examen: React.FC = () => (
  <Film
    track="vigil"
    palette="sand"
    sections={[
      {
        key: "hook",
        duration: 60,
        node: (
          <Section duration={60} className="items-center justify-center px-16 text-center">
            <Cross size={62} />
            <div
              style={{ fontFamily: serifFont, color: INK }}
              className="mt-12 text-[118px] font-bold leading-[1.02]"
            >
              Five questions.
            </div>
            <div
              style={{ fontFamily: serifFont, color: GOLD }}
              className="text-[118px] font-bold leading-[1.02]"
            >
              Five minutes.
            </div>
            <div
              style={{ fontFamily: monoFont, color: INK_SOFT }}
              className="mt-10 text-[28px] uppercase tracking-[0.2em]"
            >
              The examen · every night
            </div>
          </Section>
        ),
      },
      { key: "sheet", duration: 210, node: <Sheet duration={210} /> },
      {
        key: "close",
        duration: 100,
        node: (
          <Section duration={100} className="items-center justify-center px-16 text-center">
            <div
              style={{ fontFamily: serifFont, color: INK }}
              className="text-[100px] font-bold leading-[1.08]"
            >
              Then say thank you
              <br />
              for one of them.
            </div>
            <div
              style={{ fontFamily: monoFont, color: GOLD }}
              className="mt-12 text-[29px] font-bold uppercase tracking-[0.2em]"
            >
              That's the whole thing
            </div>
          </Section>
        ),
      },
      { key: "outro", duration: 110, node: <Outro cta="Try it tonight" /> },
    ]}
  />
);
