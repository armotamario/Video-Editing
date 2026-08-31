import { Composition } from "remotion";
import { PromoVideo, TOTAL_DURATION } from "./PromoVideo";

export const MyComposition = () => {
  return (
    <Composition
      id="GodlyRaimentPromo"
      component={PromoVideo}
      durationInFrames={TOTAL_DURATION}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
