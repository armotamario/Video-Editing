import { AbsoluteFill, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { SignOff } from "../reel/kit";

/**
 * A repost of an old Fulton Sheen broadcast, cleaned up and closed out with a
 * Godly Raiment sign-off. The source carries two burned-in watermarks: a
 * static "@fultonsheen.com" credit top right, and a TikTok badge that starts
 * stage left before settling bottom right once the captions begin — both
 * fixed points in the frame, native 576x1024, scaled 1.875x onto the 1080x1920
 * canvas here. Each spot is covered by a blurred, cropped copy of the same
 * frame rather than a flat box, so it reads as a grain smudge against the
 * archival footage instead of a hard-edged cutout.
 */

export const CLIP_SECONDS = 88.588589;
export const CLIP_FPS = 30;
export const CLIP_DURATION = Math.round(CLIP_SECONDS * CLIP_FPS);
export const OUTRO_DURATION = 90;
export const FULTON_SHEEN_DURATION = CLIP_DURATION + OUTRO_DURATION;

type Zone = { x: number; y: number; w: number; h: number; from?: number; until?: number };

const FRAME_W = 1080;
const FRAME_H = 1920;

// The TikTok badge starts stage left and settles bottom right once the
// captions kick in, somewhere around the 4-4.5s mark — keep both zones live
// across that handover so there's no gap while it's actually mid-move.
const ZONES: Zone[] = [
  { x: 525, y: 150, w: 544, h: 122 }, // "@fultonsheen.com", top right, whole clip
  { x: 9, y: 816, w: 319, h: 253, until: 160 }, // TikTok badge, left side, opening seconds
  { x: 797, y: 1397, w: 281, h: 225, from: 120 }, // TikTok badge, bottom right, once captions run
];

/** A blurred, cropped copy of the same video, windowed to just this zone. */
const Patch: React.FC<Zone> = ({ x, y, w, h, from = 0, until = CLIP_DURATION }) => {
  const frame = useCurrentFrame();
  if (frame < from || frame >= until) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        overflow: "hidden",
        borderRadius: 18,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: -x,
          top: -y,
          width: FRAME_W,
          height: FRAME_H,
          filter: "blur(28px)",
          transform: "scale(1.15)",
          transformOrigin: `${x + w / 2}px ${y + h / 2}px`,
        }}
      >
        <OffthreadVideo src={staticFile("edit/pre_f.mp4")} muted style={{ width: FRAME_W, height: FRAME_H }} />
      </div>
    </div>
  );
};

const CleanedClip: React.FC = () => {
  const frame = useCurrentFrame();
  const fadeFrames = Math.round(CLIP_FPS * 0.4);
  const opacity = Math.min(
    interpolate(frame, [0, fadeFrames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(frame, [CLIP_DURATION - fadeFrames, CLIP_DURATION - 1], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );

  return (
    <AbsoluteFill style={{ opacity }}>
      <OffthreadVideo src={staticFile("edit/pre_f.mp4")} />
      {ZONES.map((z, i) => (
        <Patch key={i} {...z} />
      ))}
    </AbsoluteFill>
  );
};

export const FultonSheenEdit: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#0b0a09" }}>
      <Sequence durationInFrames={CLIP_DURATION}>
        <CleanedClip />
      </Sequence>
      <Sequence from={CLIP_DURATION} durationInFrames={OUTRO_DURATION}>
        <AbsoluteFill style={{ background: "#0b0a09" }}>
          <SignOff line={"Wear what\nyou believe"} />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
