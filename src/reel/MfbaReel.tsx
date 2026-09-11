import { Clip, Plate, Reel } from "./kit";
import { AthleticBeat, AthleticQuote, AthleticSignOff } from "./athletic";
import type { Spec } from "./month";
import { BEATS } from "./MonthReel";

const back = (b: Spec["back"][number]) =>
  b.kind === "clip" ? (
    <Clip src={b.src} startFrom={b.startFrom} dim={b.dim} />
  ) : (
    <Plate src={b.src} focus={b.focus} dim={b.dim} />
  );

const TOPIC: Record<string, string> = {
  Products: "Training",
  Prayer: "Nutrition",
  Bible: "Cardio",
  Mass: "Mindset",
  Fellowship: "Start here",
};

export const MfbaReel: React.FC<{ spec: Spec }> = ({ spec }) => (
  <Reel
    beats={[
      {
        key: "hook",
        duration: BEATS[0],
        back: back(spec.back[0]),
        node: <AthleticBeat label={TOPIC[spec.topic]} lines={spec.hook} hot={spec.hookHot} />,
      },
      {
        key: "proof",
        duration: BEATS[1],
        back: back(spec.back[1]),
        node: <AthleticQuote text={spec.quote} cite={spec.cite} />,
      },
      {
        key: "benefit-1",
        duration: BEATS[2],
        back: back(spec.back[2]),
        node: <AthleticBeat lines={spec.benefits[0]} hot={spec.benefitHot[0]} size={104} />,
      },
      {
        key: "benefit-2",
        duration: BEATS[3],
        back: back(spec.back[3]),
        node: <AthleticBeat lines={spec.benefits[1]} hot={spec.benefitHot[1]} size={104} />,
      },
      {
        key: "cta",
        duration: BEATS[4],
        back: back(spec.back[4]),
        node: <AthleticSignOff line={spec.cta} sub={spec.sub ?? "@movinforwardbyarm"} />,
      },
    ]}
  />
);
