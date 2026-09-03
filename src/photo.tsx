import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const useIn = (delay = 0, damping = 200) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping } });
};

/**
 * A photograph behind a section: slow push-in, and a scrim heavy enough that
 * type stays readable whatever the palette on top of it.
 */
export const PhotoBackdrop: React.FC<{
  src: string;
  /** 0 = no darkening, 1 = almost black. */
  scrim?: number;
  focus?: string;
  zoom?: number;
}> = ({ src, scrim = 0.72, focus = "center 30%", zoom = 0.06 }) => {
  const frame = useCurrentFrame();
  const scale = 1 + (frame / 120) * zoom;

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${scale})` }}>
        <Img
          src={staticFile(`images/photos/${src}`)}
          className="h-full w-full object-cover"
          style={{ objectPosition: focus }}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `linear-gradient(to bottom, rgba(0,0,0,${scrim * 0.85}) 0%, rgba(0,0,0,${
            scrim * 0.55
          }) 38%, rgba(0,0,0,${Math.min(0.94, scrim + 0.16)}) 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};

/** A framed photograph inside a section, with an optional caption under it. */
export const PhotoPanel: React.FC<{
  src: string;
  width: number;
  height: number;
  caption?: string;
  delay?: number;
  focus?: string;
}> = ({ src, width, height, caption, delay = 0, focus = "center" }) => {
  const t = useIn(delay, 16);
  return (
    <div className="flex flex-col items-center">
      <div
        style={{
          width,
          height,
          transform: `translateY(${interpolate(t, [0, 1], [60, 0])}px) scale(${interpolate(
            t,
            [0, 1],
            [0.94, 1],
          )})`,
          opacity: t,
          boxShadow: "0 40px 90px rgba(0,0,0,0.5)",
        }}
        className="overflow-hidden rounded-[32px]"
      >
        <Img
          src={staticFile(`images/photos/${src}`)}
          className="h-full w-full object-cover"
          style={{ objectPosition: focus }}
        />
      </div>
      {caption ? (
        <div
          style={{ opacity: t, color: "var(--ink-soft)" }}
          className="mt-6 text-center text-[26px] font-bold uppercase tracking-[0.24em]"
        >
          {caption}
        </div>
      ) : null}
    </div>
  );
};

/** The round headshot that closes every film. */
export const PortraitChip: React.FC<{ size: number; delay?: number }> = ({ size, delay = 0 }) => {
  const t = useIn(delay, 14);
  return (
    <div
      style={{
        width: size,
        height: size,
        transform: `scale(${interpolate(t, [0, 1], [0.86, 1])})`,
        opacity: t,
        border: "5px solid var(--accent)",
        boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
      }}
      className="overflow-hidden rounded-full"
    >
      <Img
        src={staticFile("images/photos/portrait-square.jpg")}
        className="h-full w-full object-cover"
      />
    </div>
  );
};

/**
 * A photo behind a whole section. It also re-points the ink variables at a
 * light pair, so type stays readable even when the film's palette is a light
 * one and its ink is nearly black.
 */
export const OnPhoto: React.FC<{
  src: string;
  scrim?: number;
  focus?: string;
  children: React.ReactNode;
}> = ({ src, scrim = 0.74, focus = "center 30%", children }) => (
  <AbsoluteFill>
    <PhotoBackdrop src={src} scrim={scrim} focus={focus} />
    <AbsoluteFill
      style={
        {
          "--ink": "#f8f4ee",
          "--ink-soft": "#cdc5b9",
          "--line": "rgba(255,255,255,0.22)",
          "--surface": "rgba(255,255,255,0.10)",
        } as React.CSSProperties
      }
    >
      {children}
    </AbsoluteFill>
  </AbsoluteFill>
);
