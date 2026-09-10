import { Composition } from "remotion";
import { ClipEdit } from "./edit/ClipEdit";
import { GrClothes, GrStillCatholic, GrFiveMinutes, GrNotJewellery } from "./reel/GrReels";
import { MONTH } from "./reel/month";
import { MonthReel, MONTH_DURATION } from "./reel/MonthReel";
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
import { Moments } from "./gr/Moments";
import { Store } from "./gr/Store";
import { Confession } from "./gr/Confession";
import { Rosary } from "./gr/Rosary";
import { Fasting } from "./gr/Fasting";
import { CrossFilm } from "./gr/CrossFilm";
import { DayClock } from "./gr/DayClock";
import { WordFilm } from "./gr/Word";
import { Timeline } from "./gr/Timeline";
import { MassMap } from "./gr/MassMap";
import { Examen } from "./gr/Examen";
import { Receipt } from "./gr/Receipt";
import { FILM_DURATION as SHRED_FILM_DURATION } from "./shred/kit";
import { Stretch } from "./shred/Stretch";
import { WorkoutA } from "./shred/WorkoutA";
import { WorkoutB } from "./shred/WorkoutB";
import { Cardio } from "./shred/Cardio";
import { Diet } from "./shred/Diet";
import { Calisthenics } from "./shred/Calisthenics";
import { Protocol, PROTOCOL_DURATION } from "./shred/Protocol";
import { FirstMonth } from "./shred/FirstMonth";
import { Mistakes as ShredMistakes } from "./shred/Mistakes";
import { Overload } from "./shred/Overload";
import { Consistency } from "./shred/Consistency";
import { Reality } from "./shred/Reality";
import { Calendar } from "./shred/Calendar";

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
  ["GrMoments", Moments],
  ["GrStore", Store],
  ["GrConfession", Confession],
  ["GrRosary", Rosary],
  ["GrFasting", Fasting],
  ["GrCross", CrossFilm],
  ["GrDayClock", DayClock],
  ["GrWord", WordFilm],
  ["GrTimeline", Timeline],
  ["GrMassMap", MassMap],
  ["GrExamen", Examen],
  ["GrReceipt", Receipt],
];

/** MFBA's Shredded Series — mobility, two lifting days, cardio, diet. */
const SHRED_FILMS: [string, React.FC][] = [
  ["ShredStretch", Stretch],
  ["ShredWorkoutA", WorkoutA],
  ["ShredWorkoutB", WorkoutB],
  ["ShredCardio", Cardio],
  ["ShredDiet", Diet],
  ["ShredCalisthenics", Calisthenics],
  ["ShredFirstMonth", FirstMonth],
  ["ShredMistakes", ShredMistakes],
  ["ShredOverload", Overload],
  ["ShredConsistency", Consistency],
  ["ShredReality", Reality],
  ["ShredCalendar", Calendar],
];

/** The uploaded clips: trimmed length, native rate, and the file to read. */
const EDITS: { id: string; src: string; fps: number; seconds: number }[] = [
  { id: "EditA", src: "edit/pre_a.mp4", fps: 30, seconds: 24.0 },
  { id: "EditB", src: "edit/pre_b.mp4", fps: 50, seconds: 48.9 },
  { id: "EditC", src: "edit/pre_c.mp4", fps: 30, seconds: 74.0 },
  { id: "EditD", src: "edit/pre_d.mp4", fps: 24, seconds: 19.0 },
  { id: "EditE", src: "edit/pre_e.mp4", fps: 30, seconds: 35.5 },
];

export const MyComposition = () => {
  return (
    <>
      {MONTH.map((spec) => (
        <Composition
          key={spec.id}
          id={spec.id}
          component={MonthReel}
          durationInFrames={MONTH_DURATION}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ spec }}
        />
      ))}
      {([
        ["ReelClothes", GrClothes, 370],
        ["ReelCatholic", GrStillCatholic, 382],
        ["ReelFiveMin", GrFiveMinutes, 326],
        ["ReelJewellery", GrNotJewellery, 328],
      ] as [string, React.FC, number][]).map(([id, C, dur]) => (
        <Composition
          key={id}
          id={id}
          component={C}
          durationInFrames={dur}
          fps={30}
          width={1080}
          height={1920}
        />
      ))}
      {EDITS.map((e) => (
        <Composition
          key={e.id}
          id={e.id}
          component={ClipEdit}
          durationInFrames={Math.round(e.seconds * e.fps)}
          fps={e.fps}
          width={1080}
          height={1920}
          defaultProps={{ src: e.src, fadeFrames: Math.round(e.fps * 0.4) }}
        />
      ))}
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
