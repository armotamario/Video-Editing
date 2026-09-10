import { AbsoluteFill, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * A trimmed source clip with a short fade at each end. The ffmpeg build here
 * has no fade filter, so the ramp is done on the way through Remotion.
 */
export type ClipProps = {
  src: string;
  fadeFrames: number;
};

export const ClipEdit: React.FC<ClipProps> = ({ src, fadeFrames }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const opacity = Math.min(
    interpolate(frame, [0, fadeFrames], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
    interpolate(frame, [durationInFrames - fadeFrames, durationInFrames - 1], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );

  return (
    <AbsoluteFill style={{ background: "#000000" }}>
      <AbsoluteFill style={{ opacity }}>
        <OffthreadVideo src={staticFile(src)} muted />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
