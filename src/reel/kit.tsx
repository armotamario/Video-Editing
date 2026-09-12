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

const Line: React.FC<{
  text: string;
  hot?: string;
  size: number;
  accent: string;
  delay: number;
}> = ({ text, hot, size, accent, delay }) => {
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
        textShadow: OUTLINE("#0a0908"),
      }}
      className="text-center uppercase"
    >
      {words.map((w, i) => {
        const bare = w.replace(/[^A-Za-z']/g, "").toLowerCase();
        const isHot = hot ? bare === hot.toLowerCase() : false;
        return (
          <span key={`${w}-${i}`} style={{ color: isHot ? accent : "#ffffff" }}>
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
  band:
    "linear-gradient(to bottom, rgba(8,7,6,0) 22%, rgba(8,7,6,0.62) 34%," +
    " rgba(8,7,6,0.62) 62%, rgba(8,7,6,0) 74%)",
  top:
    "linear-gradient(to bottom, rgba(8,7,6,0) 20%, rgba(8,7,6,0.68) 29%," +
    " rgba(8,7,6,0.68) 42%, rgba(8,7,6,0) 48%)",
};

export const Beat: React.FC<{
  lines: string[];
  hot?: string;
  size?: number;
  accent?: string;
  scrim?: keyof typeof SCRIM;
}> = ({ lines, hot, size = 96, accent = "#e8b23c", scrim = "band" }) => (
  <AbsoluteFill>
    {/* a band behind the words — bright footage eats an outline on its own */}
    <AbsoluteFill style={{ background: SCRIM[scrim] }} />
    <AbsoluteFill
      className="items-center"
      style={{
        paddingTop: SAFE_TOP,
        paddingLeft: 72,
        paddingRight: 72,
        justifyContent: "flex-start",
      }}
    >
      <div className="flex flex-col gap-2">
        {lines.map((l, i) => (
          <Line key={l} text={l} hot={hot} size={size} accent={accent} delay={i * 4} />
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
export const SignOff: React.FC<{ line: string; accent?: string; sub?: string }> = ({
  line,
  accent = "#e8b23c",
  sub = "Godlyraiment.com.au",
}) => {
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
          color: "#ffffff",
          textShadow: OUTLINE("#0a0908"),
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
          textShadow: OUTLINE("#0a0908"),
        }}
        className="mt-10 text-center uppercase"
      >
        {sub}
      </div>
    </AbsoluteFill>
  );
};

/** The proof beat: a short citation, with its source under a rule. */
export const Quote: React.FC<{ text: string; cite: string; accent?: string }> = ({
  text,
  cite,
  accent = "#e8b23c",
}) => {
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
      <AbsoluteFill style={{ background: "rgba(8,7,6,0.62)" }} />
      <AbsoluteFill className="items-center justify-center px-20">
        <div
          style={{
            opacity: inT,
            transform: `translateY(${interpolate(inT, [0, 1], [22, 0])}px)`,
            fontFamily: bodyFont,
            fontWeight: 700,
            fontSize: 66,
            lineHeight: 1.2,
            color: "#ffffff",
            textShadow: OUTLINE("#0a0908"),
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
            textShadow: OUTLINE("#0a0908"),
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
