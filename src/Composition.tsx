import { Composition } from "remotion";
import { PromoVideo, TOTAL_DURATION } from "./PromoVideo";
import { MfbaPromo, MFBA_TOTAL_DURATION } from "./mfba/MfbaPromo";
import { MarioPromo, MARIO_TOTAL_DURATION } from "./mario/MarioPromo";
import { RaimentFilm, RAIMENT_TOTAL_DURATION } from "./raiment/RaimentFilm";
import { DietFilm, DIET_TOTAL_DURATION } from "./diet/DietFilm";

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
        id="GodlyRaimentCraft"
        component={RaimentFilm}
        durationInFrames={RAIMENT_TOTAL_DURATION}
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
      <Composition
        id="MfbaDiet"
        component={DietFilm}
        durationInFrames={DIET_TOTAL_DURATION}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="MarioArmotaPromo"
        component={MarioPromo}
        durationInFrames={MARIO_TOTAL_DURATION}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
