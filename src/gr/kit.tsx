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
import { bodyFont, monoFont, serifFont } from "../fonts";
import {
  ACCENT_LINE,
  ACCENT_SOFT,
  INK,
  INK_SOFT,
  PAGE_BG,
  ACCENT as PALETTE_ACCENT,
  paletteVars,
  type PaletteName,
} from "../palettes";

/** Kept under the old names so the films read the same as before. */
const GOLD = PALETTE_ACCENT;
import { BRAND_NAME, BRAND_URL, TAGLINE } from "../brand";
import { PhotoBackdrop } from "../photo";

/** Every film in this set is 16s, cut to a 16s bed. */
export const FILM_DURATION = 480;

export type Track = "chant" | "vigil" | "hymn" | "procession";

/** The Godly Raiment mark: the cross from the label, drawn rather than traced. */
export const Cross: React.FC<{ size: number; color?: string }> = ({ size, color = GOLD }) => (
  <svg width={size} height={(size * 145) / 100} viewBox="0 0 100 145" fill={color}>
    <circle cx="50" cy="9" r="9" />
    <rect x="41" y="9" width="18" height="91" />
    <circle cx="14" cy="41" r="9" />
    <circle cx="86" cy="41" r="9" />
    <rect x="14" y="32" width="72" height="18" />
    <polygon points="41,100 59,100 50,145" />
  </svg>
);

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
      <Audio src={staticFile(`audio/gr-${track}.wav`)} />
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
}> = ({ duration, className = "justify-center px-20", children }) => (
  <AbsoluteFill style={{ opacity: useSectionFade(duration) }} className={className}>
    {children}
  </AbsoluteFill>
);

export const Kicker: React.FC<{ children: React.ReactNode; delay?: number }> = ({
  children,
  delay = 0,
}) => {
  const t = useRise(delay);
  return (
    <div
      style={{ opacity: t, fontFamily: monoFont, color: GOLD }}
      className="text-[25px] font-bold uppercase tracking-[0.34em]"
    >
      {children}
    </div>
  );
};

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
        transform: `translateY(${interpolate(t, [0, 1], [44, 0])}px)`,
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

/** One quoted source, centred, with the citation set in mono gold beneath it. */
export const Proof: React.FC<{ quote: string; cite: string; duration: number; size?: number }> = ({
  quote,
  cite,
  duration,
  size = 62,
}) => {
  const markIn = useRise(0, 15);
  const quoteIn = useRise(6);
  const citeIn = useRise(20);
  const fade = useSectionFade(duration, 8);

  return (
    <AbsoluteFill className="items-center justify-center px-20 pb-[80px]" style={{ opacity: fade }}>
      <div style={{ opacity: markIn }}>
        <Cross size={52} />
      </div>
      <div
        style={{
          transform: `translateY(${interpolate(quoteIn, [0, 1], [36, 0])}px)`,
          opacity: quoteIn,
          fontFamily: serifFont,
          color: INK,
          fontSize: size,
        }}
        className="mt-14 text-center font-medium leading-[1.32]"
      >
        {quote}
      </div>
      <div style={{ opacity: citeIn, background: ACCENT_SOFT }} className="mt-14 h-[2px] w-[90px]" />
      <div
        style={{ opacity: citeIn, fontFamily: monoFont, color: GOLD }}
        className="mt-8 text-center text-[26px] font-bold uppercase tracking-[0.18em]"
      >
        {cite}
      </div>
    </AbsoluteFill>
  );
};

const Point: React.FC<{ index: number; title: string; note?: string; delay: number }> = ({
  index,
  title,
  note,
  delay,
}) => {
  const t = useRise(delay, 18);
  return (
    <div
      style={{
        transform: `translateX(${interpolate(t, [0, 1], [-48, 0])}px)`,
        opacity: t,
        borderTop: `1px solid ${ACCENT_LINE}`,
      }}
      className="flex items-start gap-8 py-8"
    >
      <div
        style={{ fontFamily: monoFont, color: GOLD }}
        className="w-[66px] flex-none pt-3 text-[25px] font-bold"
      >
        {String(index + 1).padStart(2, "0")}
      </div>
      <div className="flex-1">
        <div
          style={{ fontFamily: serifFont, color: INK }}
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

export const Benefits: React.FC<{
  points: { title: string; note?: string }[];
  start?: number;
  step?: number;
}> = ({ points, start = 0, step = 14 }) => (
  <div>
    {points.map((point, i) => (
      <Point
        key={point.title}
        index={i}
        title={point.title}
        note={point.note}
        delay={start + i * step}
      />
    ))}
  </div>
);


/** On the photo sign-off the palette ink can be dark, so the type is fixed. */
const PHOTO_INK = "#f8f4ee";
const PHOTO_ON_ACCENT = "#16130f";

/** The same sign-off closes every film in the set. */
export const Outro: React.FC<{ cta: string }> = ({ cta }) => {
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
    <AbsoluteFill style={{ opacity: fadeIn }}>
      <PhotoBackdrop src="portrait.jpg" scrim={0.76} focus="center 20%" />

      <AbsoluteFill className="items-center justify-end px-16 pb-[200px]">
        <div style={{ transform: `scale(${markIn})`, opacity: markIn }}>
          <Cross size={112} />
        </div>

        <div
          style={{
            transform: `translateY(${interpolate(nameIn, [0, 1], [26, 0])}px)`,
            opacity: nameIn,
            fontFamily: serifFont,
            color: PHOTO_INK,
          }}
          className="mt-12 text-[86px] font-bold tracking-[-0.01em]"
        >
          {BRAND_NAME}
        </div>
        <div
          style={{ opacity: nameIn, fontFamily: monoFont, color: GOLD }}
          className="mt-4 text-[26px] font-bold uppercase tracking-[0.36em]"
        >
          {TAGLINE}
        </div>

        <div
          style={{
            transform: `scale(${pulse})`,
            opacity: ctaIn,
            fontFamily: monoFont,
            background: GOLD,
            color: PHOTO_ON_ACCENT,
          }}
          className="mt-12 rounded-full px-12 py-6 text-[31px] font-bold"
        >
          {cta}
        </div>

        <div
          style={{ opacity: ctaIn, fontFamily: monoFont, color: PHOTO_INK }}
          className="mt-10 text-[33px] font-bold tracking-[0.06em]"
        >
          {BRAND_URL}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export { GOLD, INK, INK_SOFT };
