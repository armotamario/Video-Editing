import { Composition } from "remotion";
import { PromoVideo, TOTAL_DURATION } from "./PromoVideo";
import { MfbaPromo, MFBA_TOTAL_DURATION } from "./mfba/MfbaPromo";

export const MyComposition = () => {
  return (
    <>
      <Composition
        id="GodlyRaimentPromo"
        component={PromoVideo}
        durationInFrames={TOTAL_DURATION}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="MfbaPromo"
        component={MfbaPromo}
        durationInFrames={MFBA_TOTAL_DURATION}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
