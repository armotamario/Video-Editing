import {
  AbsoluteFill,
  Audio,
  Sequence,
  getInputProps,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { bodyFont, headlineFont, monoFont, serifFont } from "../fonts";
import {
  ACCENT_LINE,
  INK,
  INK_SOFT,
  LINE,
  ON_ACCENT,
  PAGE_BG,
  ACCENT as PALETTE_ACCENT,
  paletteVars,
  type PaletteName,
} from "../palettes";

/** Kept under the old name so the films read the same as before. */
const GOLD = PALETTE_ACCENT;
const ON_GOLD = ON_ACCENT;
import { MonogramMark } from "../mario/MonogramMark";
import { CTA, CTA_SUB, HANDLE, LABEL, NAME, SITE } from "./brand";

/** Every film in this set is 16s, cut to the same 16s bed. */
export const FILM_DURATION = 480;

/** The six 16s beds, so no two neighbouring posts sound the same. */
export type Track = "cinematic" | "trap" | "lofi" | "uplift" | "tense" | "minimal";

/**
 * Films render silent so a trending sound can be added in the app on upload.
 * Pass --props='{"sound":true}' to lay the film's own bed back underneath.
 */
const withSound = (getInputProps() as { sound?: boolean }).sound === true;

export const FilmShell: React.FC<{
  track: Track;
  palette: PaletteName;
  children: React.ReactNode;
}> = ({ track, palette, children }) => (
  <AbsoluteFill style={{ ...paletteVars(palette), background: PAGE_BG }}>
    {withSound ? <Audio src={staticFile(`audio/web-${track}.wav`)} /> : null}
    {children}
  </AbsoluteFill>
);

/** Lays sections back to back and drops the shared bed underneath them. */
/** Fades a whole section out over its last frames so cuts never snap. */
export const useSectionFade = (durationInFrames: number, frames = 10) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [durationInFrames - frames, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

export const useRise = (delay = 0, damping = 200) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping } });
};

export const Film: React.FC<{
  track: Track;
  palette: PaletteName;
  sections: { key: string; duration: number; node: React.ReactNode }[];
}> = ({ track, palette, sections }) => {
  let at = 0;
  return (
    <FilmShell track={track} palette={palette}>
      {sections.map((section) => {
        const from = at;
        at += section.duration;
        return (
          <Sequence key={section.key} from={from} durationInFrames={section.duration}>
            {section.node}
          </Sequence>
        );
      })}
    </FilmShell>
  );
};

/** A full-frame section that fades itself out just before the next cut. */
export const Section: React.FC<{
  duration: number;
  className?: string;
  children: React.ReactNode;
}> = ({ duration, className = "justify-center px-20", children }) => {
  const opacity = useSectionFade(duration);
  return (
    <AbsoluteFill style={{ opacity }} className={className}>
      {children}
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
      style={{ opacity: t, fontFamily: monoFont, color: GOLD }}
      className="text-[26px] font-bold uppercase tracking-[0.34em]"
    >
      {children}
    </div>
  );
};

/** Playfair display headline, one line per array entry, gold on marked lines. */
const HeadlineLine: React.FC<{ line: string; delay: number; size: number; gold: boolean }> = ({
  line,
  delay,
  size,
  gold,
}) => {
  const t = useRise(delay);
  return (
    <div
      style={{
        transform: `translateY(${interpolate(t, [0, 1], [46, 0])}px)`,
        opacity: t,
        fontFamily: serifFont,
        fontSize: size,
        lineHeight: 1.14,
        color: gold ? GOLD : INK,
      }}
      className="font-bold tracking-[-0.02em]"
    >
      {line}
    </div>
  );
};

export const Headline: React.FC<{
  lines: string[];
  goldIndex?: number[];
  size?: number;
  delay?: number;
  align?: "left" | "center";
}> = ({ lines, goldIndex = [], size = 104, delay = 0, align = "left" }) => (
  <div className={align === "center" ? "text-center" : ""}>
    {lines.map((line, i) => (
      <HeadlineLine
        key={line}
        line={line}
        delay={delay + i * 6}
        size={size}
        gold={goldIndex.includes(i)}
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

/** Numbered rows that step in one after another. */
const Point: React.FC<{
  index: number;
  title: string;
  note?: string;
  delay: number;
  strike: boolean;
}> = ({ index, title, note, delay, strike }) => {
  const t = useRise(delay, 18);
  return (
    <div
      style={{
        transform: `translateX(${interpolate(t, [0, 1], [-50, 0])}px)`,
        opacity: t,
        borderTop: `1px solid ${LINE}`,
      }}
      className="flex items-start gap-8 py-8"
    >
      <div
        style={{ fontFamily: monoFont, color: GOLD }}
        className="w-[70px] flex-none pt-3 text-[26px] font-bold"
      >
        {String(index + 1).padStart(2, "0")}
      </div>
      <div className="flex-1">
        <div
          style={{
            fontFamily: serifFont,
            color: INK,
            textDecoration: strike ? "line-through" : "none",
            textDecorationColor: GOLD,
          }}
          className="text-[52px] font-bold leading-tight tracking-[-0.01em]"
        >
          {title}
        </div>
        {note ? (
          <div
            style={{ fontFamily: bodyFont, color: INK_SOFT }}
            className="mt-2 text-[28px] font-medium leading-snug"
          >
            {note}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export const PointList: React.FC<{
  points: { title: string; note?: string }[];
  start?: number;
  step?: number;
  strike?: boolean;
}> = ({ points, start = 0, step = 12, strike = false }) => (
  <div>
    {points.map((point, i) => (
      <Point
        key={point.title}
        index={i}
        title={point.title}
        note={point.note}
        delay={start + i * step}
        strike={strike}
      />
    ))}
  </div>
);

/** The shared closing card — same sign-off on every film in the set. */
export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const markIn = useRise(0, 14);
  const nameIn = useRise(8);
  const ctaIn = useRise(20, 12);
  const pulse = 1 + Math.sin(frame / 9) * 0.025;
  const fadeIn = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill className="items-center justify-center px-16" style={{ opacity: fadeIn }}>
      <div style={{ transform: `scale(${markIn})`, opacity: markIn }}>
        <MonogramMark size={190} />
      </div>

      <div
        style={{
          transform: `translateY(${interpolate(nameIn, [0, 1], [26, 0])}px)`,
          opacity: nameIn,
          fontFamily: serifFont,
          color: INK,
        }}
        className="mt-12 text-[86px] font-bold tracking-[-0.01em]"
      >
        {NAME}
      </div>
      <div
        style={{ opacity: nameIn, fontFamily: monoFont, color: GOLD }}
        className="mt-3 text-[27px] font-bold uppercase tracking-[0.36em]"
      >
        {LABEL}
      </div>

      <div
        style={{
          transform: `scale(${pulse})`,
          opacity: ctaIn,
          fontFamily: monoFont,
          background: GOLD,
          color: ON_GOLD,
        }}
        className="mt-14 rounded-full px-12 py-6 text-[32px] font-bold"
      >
        {CTA}
      </div>
      <div
        style={{ opacity: ctaIn, fontFamily: bodyFont, color: INK_SOFT }}
        className="mt-6 text-[27px] font-medium"
      >
        {CTA_SUB}
      </div>

      <div
        style={{ opacity: ctaIn, fontFamily: monoFont, color: INK }}
        className="mt-12 text-[34px] font-bold"
      >
        {SITE}
      </div>
      <div
        style={{ opacity: ctaIn, fontFamily: bodyFont, color: INK_SOFT }}
        className="mt-3 text-[26px] font-bold"
      >
        {HANDLE}
      </div>
    </AbsoluteFill>
  );
};

export { GOLD, INK, INK_SOFT, ON_GOLD, LINE, ACCENT_LINE };
export { bodyFont, headlineFont, monoFont, serifFont };
