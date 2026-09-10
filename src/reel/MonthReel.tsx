import { Beat, Float, Plate, Quote, Reel, SignOff } from "./kit";
import type { Spec } from "./month";

/** Hook, proof, two benefit beats, call to action — 13s at 30fps. */
export const BEATS = [78, 102, 66, 66, 78];
export const MONTH_DURATION = BEATS.reduce((a, b) => a + b, 0);

const back = (b: Spec["back"][number]) =>
  b.kind === "float" ? (
    <Float src={b.src} />
  ) : (
    <Plate src={b.src} focus={b.focus} dim={b.dim} />
  );

export const MonthReel: React.FC<{ spec: Spec }> = ({ spec }) => (
  <Reel
    beats={[
      {
        key: "hook",
        duration: BEATS[0],
        back: back(spec.back[0]),
        node: <Beat lines={spec.hook} hot={spec.hookHot} size={96} />,
      },
      {
        key: "proof",
        duration: BEATS[1],
        back: back(spec.back[1]),
        node: <Quote text={spec.quote} cite={spec.cite} />,
      },
      {
        key: "benefit-1",
        duration: BEATS[2],
        back: back(spec.back[2]),
        node: <Beat lines={spec.benefits[0]} hot={spec.benefitHot[0]} size={94} />,
      },
      {
        key: "benefit-2",
        duration: BEATS[3],
        back: back(spec.back[3]),
        node: <Beat lines={spec.benefits[1]} hot={spec.benefitHot[1]} size={94} />,
      },
      {
        key: "cta",
        duration: BEATS[4],
        back: back(spec.back[4]),
        node: <SignOff line={spec.cta} />,
      },
    ]}
  />
);
