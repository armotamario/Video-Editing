import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { monoFont, serifFont } from "../fonts";
import { ACCENT_LINE } from "../palettes";
import { Cross, Film, GOLD, INK, INK_SOFT, Outro, Section, useRise, useSectionFade } from "./kit";

/** Psalm 46:10, one word at a time. */
const WORDS = ["Be", "still,", "and", "know", "that", "I", "am", "God."];
const PER_WORD = 26;

/** Each word alone, full frame, cut hard to the next. */
const Word: React.FC<{ index: number }> = ({ index }) => {
  const frame = useCurrentFrame();
  const word = WORDS[index];
  const last = index === WORDS.length - 1;
  const inT = interpolate(frame, [0, 7], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const outT = interpolate(frame, [PER_WORD - 6, PER_WORD], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const drift = interpolate(frame, [0, PER_WORD], [0, -14]);

  return (
    <AbsoluteFill className="items-center justify-center px-14">
      <div
        style={{
          opacity: inT * outT,
          transform: `translateY(${drift + interpolate(inT, [0, 1], [26, 0])}px) scale(${interpolate(
            inT,
            [0, 1],
            [0.9, 1],
          )})`,
          fontFamily: serifFont,
          color: last ? GOLD : INK,
          fontSize: word.length > 5 ? 190 : 240,
        }}
        className="text-center font-bold leading-none tracking-[-0.02em]"
      >
        {word}
      </div>
      <div
        className="absolute bottom-[300px] flex gap-3"
        style={{ opacity: 0.9 }}
      >
        {WORDS.map((w, i) => (
          <div
            key={w + i}
            style={{ background: i <= index ? GOLD : ACCENT_LINE }}
            className="h-[6px] w-[46px] rounded-full"
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};

const Whole: React.FC<{ duration: number }> = ({ duration }) => {
  const fade = useSectionFade(duration, 10);
  const markIn = useRise(0, 14);
  const lineIn = useRise(6);
  const citeIn = useRise(24);
  return (
    <AbsoluteFill className="items-center justify-center px-16" style={{ opacity: fade }}>
      <div style={{ transform: `scale(${markIn})`, opacity: markIn }}>
        <Cross size={58} />
      </div>
      <div
        style={{
          opacity: lineIn,
          transform: `translateY(${interpolate(lineIn, [0, 1], [30, 0])}px)`,
          fontFamily: serifFont,
          color: INK,
        }}
        className="mt-14 text-center text-[92px] font-bold leading-[1.14]"
      >
        Be still, and know that I am God.
      </div>
      <div style={{ opacity: citeIn, background: GOLD }} className="mt-14 h-[2px] w-[90px]" />
      <div
        style={{ opacity: citeIn, fontFamily: monoFont, color: GOLD }}
        className="mt-8 text-[27px] font-bold uppercase tracking-[0.2em]"
      >
        Psalm 46:10 · NRSV
      </div>
    </AbsoluteFill>
  );
};

export const WordFilm: React.FC = () => (
  <Film
    track="chant"
    palette="vellum"
    sections={[
      {
        key: "open",
        duration: 56,
        node: (
          <Section duration={56} className="items-center justify-center px-16 text-center">
            <div
              style={{ fontFamily: monoFont, color: GOLD }}
              className="text-[27px] font-bold uppercase tracking-[0.34em]"
            >
              Eight words
            </div>
            <div
              style={{ fontFamily: serifFont, color: INK_SOFT }}
              className="mt-10 text-[46px] font-medium leading-snug"
            >
              Read them slower than you want to.
            </div>
          </Section>
        ),
      },
      ...WORDS.map((w, i) => ({
        key: `w-${i}-${w}`,
        duration: PER_WORD,
        node: <Word index={i} />,
      })),
      { key: "whole", duration: 120, node: <Whole duration={120} /> },
      { key: "outro", duration: 96, node: <Outro cta="Five minutes today" /> },
    ]}
  />
);
