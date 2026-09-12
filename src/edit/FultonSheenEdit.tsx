import { AbsoluteFill, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { SignOff } from "../reel/kit";

/**
 * A repost of an old Fulton Sheen broadcast, cleaned up and closed out with a
 * Godly Raiment sign-off. The source carried two burned-in watermarks — a
 * static "@fultonsheen.com" credit top right, and a TikTok badge that starts
 * stage left before settling bottom right once the captions begin — removed
 * by inpainting over both spots frame by frame (OpenCV, INPAINT_TELEA)
 * before the clip ever reaches this composition. `pre_f_clean.mp4` is that
 * already-cleaned output; this component just frames it and appends the
 * sign-off.
 */

export const CLIP_SECONDS = 88.588589;
export const CLIP_FPS = 30;
export const CLIP_DURATION = Math.round(CLIP_SECONDS * CLIP_FPS);
export const OUTRO_DURATION = 90;
export const FULTON_SHEEN_DURATION = CLIP_DURATION + OUTRO_DURATION;

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
      <OffthreadVideo src={staticFile("edit/pre_f_clean.mp4")} />
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
