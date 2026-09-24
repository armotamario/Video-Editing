import {
  AbsoluteFill,
  Audio,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { bodyFont } from "../fonts";

/**
 * The footage-with-burned-in-captions style: a full-bleed picture that drifts,
 * with heavy type sitting over the middle of the frame. One word per line
 * carries the accent so the line has somewhere to land.
 */

export const REEL_DURATION = 450; // 15s at 30fps

/** Instagram covers the top ~15%, bottom ~25% and right ~15% of the frame. */
export const FRAME_H = 1920;
export const SAFE_TOP = Math.round(FRAME_H * 0.3);   // clear of the top chrome
export const SAFE_BOTTOM = Math.round(FRAME_H * 0.7); // clear of the caption bar

const OUTLINE = (c: string) =>
  `-4px -4px 0 ${c}, 4px -4px 0 ${c}, -4px 4px 0 ${c}, 4px 4px 0 ${c},` +
  `-6px 0 0 ${c}, 6px 0 0 ${c}, 0 -6px 0 ${c}, 0 6px 0 ${c},` +
  `-5px -3px 0 ${c}, 5px 3px 0 ${c}, 3px -5px 0 ${c}, -3px 5px 0 ${c},` +
  `0 10px 30px rgba(0,0,0,0.9)`;

/** A still, pushed slowly so the frame is never dead. */
export const Plate: React.FC<{
  src: string;
  from?: number;
  zoom?: number;
  focus?: string;
  dim?: number;
}> = ({ src, from = 1.06, zoom = 0.09, focus = "center 40%", dim = 0.34 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const scale = from + (frame / Math.max(durationInFrames, 1)) * zoom;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${scale})` }}>
        <Img
          src={staticFile(`images/${src}`)}
          className="h-full w-full object-cover"
          style={{ objectPosition: focus }}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `rgba(8,7,6,${dim})` }} />
    </AbsoluteFill>
  );
};

/** A product cut-out drifting over a dark ground. */
export const Float: React.FC<{ src: string; drift?: number }> = ({ src, drift = 26 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = frame / Math.max(durationInFrames, 1);
  return (
    <AbsoluteFill style={{ background: "#0b0a09" }}>
      {/* a soft pool of light so the cut-out is not floating on flat black */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(58% 34% at 50% 64%, rgba(232,178,60,0.20) 0%," +
            " rgba(232,178,60,0.07) 45%, rgba(11,10,9,0) 100%)",
        }}
      />
      <AbsoluteFill className="items-center" style={{ justifyContent: "flex-end", paddingBottom: 236 }}>
        <div
          style={{
            transform: `translateY(${interpolate(t, [0, 1], [drift, -drift])}px) scale(${interpolate(
              t,
              [0, 1],
              [1.0, 1.06],
            )})`,
          }}
          className="w-[884px]"
        >
          <Img src={staticFile(`images/${src}`)} className="w-full object-contain" />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/**
 * A product shot kept on paper rather than floated on black.
 *
 * The plate is roughly square and the frame is 9:16, so filling it would crop
 * the cap to a band of crown; this contains the whole shot low in the frame on
 * one shared paper ground and leaves the top third clear for the caption.
 */
export const Shot: React.FC<{ src: string; drift?: number }> = ({ src, drift = 16 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = frame / Math.max(durationInFrames, 1);
  return (
    <AbsoluteFill style={{ background: PAPER }}>
      <AbsoluteFill
        className="items-center"
        style={{ justifyContent: "flex-end", paddingBottom: 170 }}
      >
        <div
          style={{
            transform: `translateY(${interpolate(t, [0, 1], [drift, -drift])}px) scale(${interpolate(
              t,
              [0, 1],
              [1.0, 1.05],
            )})`,
            mixBlendMode: "multiply",
          }}
          className="w-[980px]"
        >
          <Img src={staticFile(`images/${src}`)} className="w-full object-contain" />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/**
 * A drawn scene rather than a photo — for a moment there's no real footage
 * of: a monstrance on an altar, candlelight, drifting incense. Nothing here
 * claims to be a real photograph.
 */
export const Adoration: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = frame / Math.max(durationInFrames, 1);
  const flicker = 1 + 0.05 * Math.sin(frame * 0.7) + 0.02 * Math.sin(frame * 2.3);
  return (
    <AbsoluteFill style={{ background: "#0b0a09" }}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(50% 42% at 50% 50%, rgba(232,178,60,0.34) 0%," +
            " rgba(232,178,60,0.12) 45%, rgba(11,10,9,0) 100%)",
          transform: `scale(${flicker})`,
        }}
      />
      <AbsoluteFill className="items-center justify-center">
        <svg
          width={560}
          height={720}
          viewBox="0 0 280 360"
          style={{
            filter: `drop-shadow(0 0 ${26 + 8 * Math.sin(frame * 0.5)}px rgba(232,178,60,0.55))`,
            transform: `translateY(${interpolate(t, [0, 1], [8, -8])}px)`,
          }}
        >
          {/* rays */}
          <g stroke="#e8b23c" strokeWidth={4} strokeLinecap="round" opacity={0.9}>
            {Array.from({ length: 16 }).map((_, i) => {
              const a = (i / 16) * Math.PI * 2;
              const r0 = 62, r1 = 100 + (i % 2 === 0 ? 22 : 0);
              const cx = 140, cy = 128;
              return (
                <line
                  key={i}
                  x1={cx + Math.cos(a) * r0}
                  y1={cy + Math.sin(a) * r0}
                  x2={cx + Math.cos(a) * r1}
                  y2={cy + Math.sin(a) * r1}
                />
              );
            })}
          </g>
          {/* the lunette, holding the host, at the centre */}
          <circle cx={140} cy={128} r={38} fill="none" stroke="#e8b23c" strokeWidth={4} />
          <circle cx={140} cy={128} r={26} fill="#faf3df" />
          <path d="M140 111v34M123 128h34" stroke="#c79a2e" strokeWidth={2} opacity={0.6} />
          {/* the stem and the flared foot */}
          <path
            d="M140 166 L140 278 M140 210 L116 210 M140 210 L164 210"
            stroke="#e8b23c"
            strokeWidth={5}
            fill="none"
            strokeLinecap="round"
          />
          <circle cx={140} cy={210} r={9} fill="#e8b23c" opacity={0.9} />
          <path
            d="M88 296 Q140 274 192 296 L206 328 Q140 350 74 328 Z"
            fill="none"
            stroke="#e8b23c"
            strokeWidth={5}
            strokeLinejoin="round"
          />
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Line: React.FC<{
  text: string;
  hot?: string;
  size: number;
  accent: string;
  delay: number;
  ink?: "light" | "dark";
}> = ({ text, hot, size, accent, delay, ink = "light" }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [delay, delay + 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const words = text.split(" ");
  return (
    <div
      style={{
        opacity: t,
        transform: `translateY(${interpolate(t, [0, 1], [18, 0])}px)`,
        fontFamily: bodyFont,
        fontWeight: 900,
        fontSize: size,
        lineHeight: 1.02,
        letterSpacing: "-0.02em",
        textShadow: OUTLINE(HALO[ink]),
      }}
      className="text-center uppercase"
    >
      {words.map((w, i) => {
        const bare = w.replace(/[^A-Za-z']/g, "").toLowerCase();
        const isHot = hot ? bare === hot.toLowerCase() : false;
        return (
          <span key={`${w}-${i}`} style={{ color: isHot ? accent : INK[ink] }}>
            {w}
            {i < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </div>
  );
};

/** One beat: a caption block held over whatever is behind it. */
/**
 * The scrim behind a caption. "band" sits across the middle third, for
 * footage; "top" stops above the product on a cut-out beat, so the cap keeps
 * its own contrast and the embroidery stays legible.
 */
const SCRIM = {
  /** A paper ground needs nothing behind the words. */
  none: "transparent",
  /** Over a pale product plate: a white wash, so dark ink reads. */
  wash:
    "linear-gradient(to bottom, rgba(250,249,246,0.86) 12%," +
    " rgba(250,249,246,0.86) 40%, rgba(250,249,246,0) 54%)",
  band:
    "linear-gradient(to bottom, rgba(8,7,6,0) 22%, rgba(8,7,6,0.62) 34%," +
    " rgba(8,7,6,0.62) 62%, rgba(8,7,6,0) 74%)",
  top:
    "linear-gradient(to bottom, rgba(8,7,6,0) 20%, rgba(8,7,6,0.68) 29%," +
    " rgba(8,7,6,0.68) 42%, rgba(8,7,6,0) 48%)",
};

/** Near-black type with a pale halo, for captions over a light backdrop. */
export const PAPER = "#f7f6f3";
/** The gold reads thin on paper; this is the same hue carrying more ink. */
export const PAPER_ACCENT = "#a8761a";
export const INK = { light: "#ffffff", dark: "#14120f" };
const HALO = { light: "#0a0908", dark: "#faf9f6" };

export const Beat: React.FC<{
  lines: string[];
  hot?: string;
  size?: number;
  accent?: string;
  scrim?: keyof typeof SCRIM;
  ink?: keyof typeof INK;
  /** Where the block starts, in pixels of the 1920 frame. */
  top?: number;
}> = ({
  lines,
  hot,
  size = 96,
  accent = "#e8b23c",
  scrim = "band",
  ink = "light",
  top = SAFE_TOP,
}) => (
  <AbsoluteFill>
    {/* a band behind the words — bright footage eats an outline on its own */}
    <AbsoluteFill style={{ background: SCRIM[scrim] }} />
    <AbsoluteFill
      className="items-center"
      style={{
        paddingTop: top,
        paddingLeft: 72,
        paddingRight: 72,
        justifyContent: "flex-start",
      }}
    >
      <div className="flex flex-col gap-2">
        {lines.map((l, i) => (
          <Line key={l} text={l} hot={hot} size={size} accent={accent} delay={i * 4} ink={ink} />
        ))}
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);

/** A reel is a stack of beats, each with its own backdrop. */
export const Reel: React.FC<{
  beats: { key: string; duration: number; back: React.ReactNode; node: React.ReactNode }[];
  /** One of the beds in public/audio, without the reel- prefix or extension. */
  track?: string;
}> = ({ beats, track }) => {
  let at = 0;
  return (
    <AbsoluteFill style={{ background: "#0b0a09" }}>
      {track ? <Audio src={staticFile(`audio/reel-${track}.wav`)} /> : null}
      {beats.map((b) => {
        const from = at;
        at += b.duration;
        return (
          <Sequence key={b.key} from={from} durationInFrames={b.duration}>
            {b.back}
            {b.node}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

/** The sign-off every reel lands on. */
export const SignOff: React.FC<{
  line: string;
  accent?: string;
  sub?: string;
  ink?: keyof typeof INK;
}> = ({ line, accent = "#e8b23c", sub = "Godlyraiment.com.au", ink = "light" }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill className="items-center justify-center px-16">
      <div
        style={{
          opacity: t,
          fontFamily: bodyFont,
          fontWeight: 900,
          fontSize: 86,
          letterSpacing: "-0.02em",
          color: INK[ink],
          textShadow: OUTLINE(HALO[ink]),
          whiteSpace: "pre-line",
        }}
        className="text-center uppercase leading-none"
      >
        {line}
      </div>
      <div
        style={{
          opacity: t,
          fontFamily: bodyFont,
          fontWeight: 900,
          fontSize: 34,
          letterSpacing: "0.22em",
          color: accent,
          textShadow: OUTLINE(HALO[ink]),
        }}
        className="mt-10 text-center uppercase"
      >
        {sub}
      </div>
    </AbsoluteFill>
  );
};

/** The proof beat: a short citation, with its source under a rule. */
export const Quote: React.FC<{
  text: string;
  cite: string;
  accent?: string;
  ink?: keyof typeof INK;
  /** Where the block starts, in pixels of the 1920 frame. */
  top?: number;
}> = ({ text, cite, accent = "#e8b23c", ink = "light", top }) => {
  const frame = useCurrentFrame();
  const inT = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const citeT = interpolate(frame, [12, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill>
      {ink === "dark" ? null : <AbsoluteFill style={{ background: "rgba(8,7,6,0.62)" }} />}
      <AbsoluteFill
        className="items-center px-20"
        style={{
          justifyContent: top === undefined ? "center" : "flex-start",
          paddingTop: top,
        }}
      >
        <div
          style={{
            opacity: inT,
            transform: `translateY(${interpolate(inT, [0, 1], [22, 0])}px)`,
            fontFamily: bodyFont,
            fontWeight: 700,
            fontSize: 66,
            lineHeight: 1.2,
            color: INK[ink],
            textShadow: OUTLINE(HALO[ink]),
          }}
          className="text-center"
        >
          {`“${text}”`}
        </div>
        <div style={{ opacity: citeT, background: accent }} className="mt-12 h-[4px] w-[110px]" />
        <div
          style={{
            opacity: citeT,
            fontFamily: bodyFont,
            fontWeight: 900,
            fontSize: 34,
            letterSpacing: "0.2em",
            color: accent,
            textShadow: OUTLINE(HALO[ink]),
          }}
          className="mt-8 text-center uppercase"
        >
          {cite}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** A moving backdrop: a slice of one of his own clips, dimmed for type. */
export const Clip: React.FC<{ src: string; startFrom?: number; dim?: number }> = ({
  src,
  startFrom = 0,
  dim = 0.46,
}) => (
  <AbsoluteFill>
    <OffthreadVideo src={staticFile(src)} startFrom={startFrom} muted />
    <AbsoluteFill style={{ background: `rgba(8,7,6,${dim})` }} />
  </AbsoluteFill>
);
