import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { bodyFont, headlineFont, monoFont } from "../fonts";
import {
  ACCENT,
  ACCENT_SOFT,
  INK,
  INK_SOFT,
  LINE,
  ON_ACCENT,
  PAGE_BG,
  SURFACE,
  paletteVars,
  type PaletteName,
} from "../palettes";
import { ArrowMark } from "../mfba/ArrowMark";
import { PhotoBackdrop } from "../photo";
import { BRAND_SHORT, HANDLE, OFFER, OFFER_SUB } from "../mfba/brand";

export const FILM_DURATION = 480;
export const SERIES = "Shredded series";

export type Track = "drive" | "grind" | "pace" | "mobility" | "bodyweight";

export const useRise = (delay = 0, damping = 200) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping } });
};

export const useSectionFade = (durationInFrames: number, frames = 10) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [durationInFrames - frames, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

export const Film: React.FC<{
  track: Track;
  palette: PaletteName;
  sections: { key: string; duration: number; node: React.ReactNode }[];
}> = ({ track, palette, sections }) => {
  let at = 0;
  return (
    <AbsoluteFill style={{ ...paletteVars(palette), background: PAGE_BG }}>
      <Audio src={staticFile(`audio/shred-${track}.wav`)} />
      {sections.map((section) => {
        const from = at;
        at += section.duration;
        return (
          <Sequence key={section.key} from={from} durationInFrames={section.duration}>
            {section.node}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

export const Section: React.FC<{
  duration: number;
  className?: string;
  children: React.ReactNode;
}> = ({ duration, className = "justify-center px-16", children }) => (
  <AbsoluteFill style={{ opacity: useSectionFade(duration) }} className={className}>
    {children}
  </AbsoluteFill>
);

/** The badge that ties the series together, pinned to the top of a card. */
export const SeriesTag: React.FC<{ episode: string; label: string }> = ({ episode, label }) => {
  const t = useRise(0);
  return (
    <AbsoluteFill className="items-center justify-start pt-[150px]" style={{ opacity: t }}>
      <div className="flex items-center gap-4">
        <div style={{ background: ACCENT }} className="h-[3px] w-9 rounded-full" />
        <div
          style={{ fontFamily: monoFont, color: ACCENT }}
          className="text-[23px] font-bold uppercase tracking-[0.32em]"
        >
          {SERIES} · {episode}
        </div>
        <div style={{ background: ACCENT }} className="h-[3px] w-9 rounded-full" />
      </div>
      <div
        style={{ fontFamily: bodyFont, color: INK_SOFT }}
        className="mt-4 text-[24px] font-bold uppercase tracking-[0.24em]"
      >
        {label}
      </div>
    </AbsoluteFill>
  );
};

export const Kicker: React.FC<{ children: React.ReactNode; delay?: number }> = ({
  children,
  delay = 0,
}) => {
  const t = useRise(delay);
  return (
    <div
      style={{ opacity: t, fontFamily: monoFont, color: ACCENT }}
      className="text-[24px] font-bold uppercase tracking-[0.32em]"
    >
      {children}
    </div>
  );
};

const HeadlineLine: React.FC<{ line: string; delay: number; size: number; accent: boolean }> = ({
  line,
  delay,
  size,
  accent,
}) => {
  const t = useRise(delay);
  return (
    <div
      style={{
        transform: `translateY(${interpolate(t, [0, 1], [56, 0])}px)`,
        opacity: t,
        fontFamily: headlineFont,
        fontSize: size,
        lineHeight: 0.96,
        color: accent ? ACCENT : INK,
      }}
      className="tracking-wide"
    >
      {line}
    </div>
  );
};

export const Headline: React.FC<{
  lines: string[];
  accentIndex?: number[];
  size?: number;
  delay?: number;
  align?: "left" | "center";
}> = ({ lines, accentIndex = [], size = 132, delay = 0, align = "left" }) => (
  <div className={align === "center" ? "text-center" : ""}>
    {lines.map((line, i) => (
      <HeadlineLine
        key={line}
        line={line}
        delay={delay + i * 6}
        size={size}
        accent={accentIndex.includes(i)}
      />
    ))}
  </div>
);

export const Body: React.FC<{ children: React.ReactNode; delay?: number }> = ({
  children,
  delay = 0,
}) => {
  const t = useRise(delay);
  return (
    <div
      style={{
        transform: `translateY(${interpolate(t, [0, 1], [22, 0])}px)`,
        opacity: t,
        fontFamily: bodyFont,
        color: INK_SOFT,
      }}
      className="text-[34px] font-medium leading-snug"
    >
      {children}
    </div>
  );
};

const Row: React.FC<{
  index: number;
  title: string;
  note?: string;
  tag?: string;
  delay: number;
  compact: boolean;
}> = ({ index, title, note, tag, delay, compact }) => {
  const t = useRise(delay, 18);
  return (
    <div
      style={{
        transform: `translateX(${interpolate(t, [0, 1], [-46, 0])}px)`,
        opacity: t,
        borderTop: `1px solid ${LINE}`,
      }}
      className={`flex items-center gap-6 ${compact ? "py-4" : "py-7"}`}
    >
      <div
        style={{ fontFamily: monoFont, color: ACCENT }}
        className="w-[56px] flex-none text-[22px] font-bold"
      >
        {String(index + 1).padStart(2, "0")}
      </div>
      <div className="flex-1">
        <div
          style={{ fontFamily: headlineFont, color: INK }}
          className={compact ? "text-[48px] leading-none tracking-wide" : "text-[58px] leading-none tracking-wide"}
        >
          {title}
        </div>
        {note ? (
          <div
            style={{ fontFamily: bodyFont, color: INK_SOFT }}
            className="mt-2 text-[26px] font-medium leading-snug"
          >
            {note}
          </div>
        ) : null}
      </div>
      {tag ? (
        <div
          style={{ fontFamily: monoFont, color: ACCENT, border: `1px solid ${ACCENT_SOFT}` }}
          className="flex-none rounded-full px-5 py-2 text-[22px] font-bold"
        >
          {tag}
        </div>
      ) : null}
    </div>
  );
};

export const RowList: React.FC<{
  rows: { title: string; note?: string; tag?: string }[];
  start?: number;
  step?: number;
  compact?: boolean;
}> = ({ rows, start = 0, step = 13, compact = false }) => (
  <div>
    {rows.map((row, i) => (
      <Row
        key={row.title}
        index={i}
        title={row.title}
        note={row.note}
        tag={row.tag}
        delay={start + i * step}
        compact={compact}
      />
    ))}
  </div>
);

/** One movement, full frame: name, working sets, and what it actually trains. */
export const ExerciseCard: React.FC<{
  index: number;
  name: string;
  sets: string;
  targets: string;
  duration: number;
}> = ({ index, name, sets, targets, duration }) => {
  const numIn = useRise(0, 14);
  const nameIn = useRise(4, 16);
  const targetIn = useRise(14);
  const fade = useSectionFade(duration, 8);

  return (
    <AbsoluteFill className="justify-center px-16 pb-[130px]" style={{ opacity: fade }}>
      <div
        style={{ opacity: numIn, fontFamily: headlineFont, color: ACCENT }}
        className="text-[104px] leading-none"
      >
        {String(index + 1).padStart(2, "0")}
      </div>
      <div
        style={{
          transform: `translateY(${interpolate(nameIn, [0, 1], [46, 0])}px)`,
          opacity: nameIn,
          fontFamily: headlineFont,
          color: INK,
          whiteSpace: "pre-line",
        }}
        className="mt-6 text-[112px] leading-[0.94] tracking-wide"
      >
        {name}
      </div>
      <div
        style={{
          transform: `translateY(${interpolate(targetIn, [0, 1], [26, 0])}px)`,
          opacity: targetIn,
        }}
        className="mt-10 flex items-center gap-5"
      >
        <div
          style={{ fontFamily: monoFont, background: ACCENT, color: ON_ACCENT }}
          className="rounded-full px-7 py-3 text-[26px] font-bold"
        >
          {sets}
        </div>
        <div style={{ fontFamily: bodyFont, color: INK_SOFT }} className="text-[30px] font-bold">
          {targets}
        </div>
      </div>
    </AbsoluteFill>
  );
};


/** On the photo sign-off the palette ink can be dark, so the type is fixed. */
const PHOTO_INK = "#f8f4ee";
const PHOTO_INK_SOFT = "#cdc5b9";
const PHOTO_ON_ACCENT = "#16130f";

export const Outro: React.FC<{ note?: string }> = ({ note }) => {
  const frame = useCurrentFrame();
  const markIn = useRise(0, 14);
  const nameIn = useRise(8);
  const ctaIn = useRise(20, 12);
  const pulse = 1 + Math.sin(frame / 8) * 0.03;
  const fadeIn = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      <PhotoBackdrop src="gym.jpg" scrim={0.76} focus="center 35%" />

      <AbsoluteFill className="items-center justify-end px-16 pb-[170px]">
        <div style={{ transform: `scale(${markIn})`, opacity: markIn }}>
          <ArrowMark size={128} color={ACCENT} />
        </div>

        <div
          style={{
            transform: `translateY(${interpolate(nameIn, [0, 1], [24, 0])}px)`,
            opacity: nameIn,
            fontFamily: headlineFont,
            color: PHOTO_INK,
          }}
          className="mt-10 text-[118px] leading-none tracking-wide"
        >
          {BRAND_SHORT}
        </div>
        <div
          style={{ opacity: nameIn, fontFamily: monoFont, color: ACCENT }}
          className="mt-3 text-[25px] font-bold uppercase tracking-[0.3em]"
        >
          {SERIES}
        </div>

        <div
          style={{
            transform: `scale(${pulse})`,
            opacity: ctaIn,
            fontFamily: bodyFont,
            background: ACCENT,
            color: PHOTO_ON_ACCENT,
          }}
          className="mt-11 rounded-full px-11 py-5 text-[32px] font-black uppercase tracking-wide"
        >
          {OFFER}
        </div>
        <div
          style={{ opacity: ctaIn, fontFamily: bodyFont, color: PHOTO_INK_SOFT }}
          className="mt-5 text-[27px] font-bold"
        >
          {OFFER_SUB}
        </div>
        <div
          style={{ opacity: ctaIn, fontFamily: bodyFont, color: PHOTO_INK }}
          className="mt-7 text-[32px] font-bold"
        >
          {HANDLE}
        </div>

        {note ? (
          <div
            style={{ opacity: ctaIn, fontFamily: bodyFont, color: PHOTO_INK_SOFT }}
            className="mt-9 px-10 text-center text-[22px] font-medium"
          >
            {note}
          </div>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export { ACCENT, INK, INK_SOFT, SURFACE };
