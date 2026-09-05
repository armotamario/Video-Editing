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
import { FILM_DURATION as GR_FILM_DURATION } from "./gr/kit";
import { Products } from "./gr/Products";
import { Prayer } from "./gr/Prayer";
import { BibleFilm } from "./gr/BibleFilm";
import { MassFilm } from "./gr/MassFilm";
import { FILM_DURATION as SHRED_FILM_DURATION } from "./shred/kit";
import { Stretch } from "./shred/Stretch";
import { WorkoutA } from "./shred/WorkoutA";
import { WorkoutB } from "./shred/WorkoutB";
import { Cardio } from "./shred/Cardio";
import { Diet } from "./shred/Diet";
import { Calisthenics } from "./shred/Calisthenics";
import { Protocol, PROTOCOL_DURATION } from "./shred/Protocol";

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

/** The Godly Raiment set — hook, proof, benefits, call to action. */
const GR_FILMS: [string, React.FC][] = [
  ["GrProducts", Products],
  ["GrPrayer", Prayer],
  ["GrBible", BibleFilm],
  ["GrMass", MassFilm],
];

/** MFBA's Shredded Series — mobility, two lifting days, cardio, diet. */
const SHRED_FILMS: [string, React.FC][] = [
  ["ShredStretch", Stretch],
  ["ShredWorkoutA", WorkoutA],
  ["ShredWorkoutB", WorkoutB],
  ["ShredCardio", Cardio],
  ["ShredDiet", Diet],
  ["ShredCalisthenics", Calisthenics],
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

      {SHRED_FILMS.map(([id, component]) => (
        <Composition
          key={id}
          id={id}
          component={component}
          durationInFrames={SHRED_FILM_DURATION}
          fps={30}
          width={1080}
          height={1920}
        />
      ))}

      <Composition
        id="ShredProtocol"
        component={Protocol}
        durationInFrames={PROTOCOL_DURATION}
        fps={30}
        width={1080}
        height={1920}
      />

      {GR_FILMS.map(([id, component]) => (
        <Composition
          key={id}
          id={id}
          component={component}
          durationInFrames={GR_FILM_DURATION}
          fps={30}
          width={1080}
          height={1920}
        />
      ))}

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
