import { Composition } from "remotion";
import { PromoVideo, TOTAL_DURATION } from "./PromoVideo";
import { MfbaPromo, MFBA_TOTAL_DURATION } from "./mfba/MfbaPromo";
import { MarioPromo, MARIO_TOTAL_DURATION } from "./mario/MarioPromo";
import { RaimentFilm, RAIMENT_TOTAL_DURATION } from "./raiment/RaimentFilm";
import { DietFilm, DIET_TOTAL_DURATION } from "./diet/DietFilm";
import { FILM_DURATION } from "./web/kit";
import { Mockups } from "./web/films/Mockups";
import { BeforeAfterFilm } from "./web/films/BeforeAfterFilm";
import { ClientSites } from "./web/films/ClientSites";
import { Homepage } from "./web/films/Homepage";
import { MobilePreview } from "./web/films/MobilePreview";
import { Testimonial } from "./web/films/Testimonial";
import { WebTips } from "./web/films/WebTips";
import { Mistakes } from "./web/films/Mistakes";
import { NoWebsite } from "./web/films/NoWebsite";
import { Trust } from "./web/films/Trust";
import { Transformations } from "./web/films/Transformations";

/** The web-development content set — one 16s film per posting category. */
const WEB_FILMS: [string, React.FC][] = [
  ["WebMockups", Mockups],
  ["WebBeforeAfter", BeforeAfterFilm],
  ["WebClientSites", ClientSites],
  ["WebHomepage", Homepage],
  ["WebMobilePreview", MobilePreview],
  ["WebTestimonial", Testimonial],
  ["WebTips", WebTips],
  ["WebMistakes", Mistakes],
  ["WebNoWebsite", NoWebsite],
  ["WebTrust", Trust],
  ["WebTransformations", Transformations],
];

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

      {WEB_FILMS.map(([id, component]) => (
        <Composition
          key={id}
          id={id}
          component={component}
          durationInFrames={FILM_DURATION}
          fps={30}
          width={1080}
          height={1920}
        />
      ))}
    </>
  );
};
