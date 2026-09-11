import { Beat, Clip, Float, Plate, Quote, Reel, SignOff } from "./kit";
import type { Spec } from "./month";

/** Hook, proof, two benefit beats, call to action — 13s at 30fps. */
export const BEATS = [78, 102, 66, 66, 78];
export const MONTH_DURATION = BEATS.reduce((a, b) => a + b, 0);

const back = (b: Spec["back"][number]) => {
  if (b.kind === "float") return <Float src={b.src} />;
  if (b.kind === "clip") return <Clip src={b.src} startFrom={b.startFrom} dim={b.dim} />;
  return <Plate src={b.src} focus={b.focus} dim={b.dim} />;
};

export const MonthReel: React.FC<{ spec: Spec }> = ({ spec }) => {
  const accent = spec.accent ?? "#e8b23c";
  return (
    <Reel
      beats={[
      {
        key: "hook",
        duration: BEATS[0],
        back: back(spec.back[0]),
        node: <Beat lines={spec.hook} hot={spec.hookHot} size={96} accent={accent} />,
      },
      {
        key: "proof",
        duration: BEATS[1],
        back: back(spec.back[1]),
        node: <Quote text={spec.quote} cite={spec.cite} accent={accent} />,
      },
      {
        key: "benefit-1",
        duration: BEATS[2],
        back: back(spec.back[2]),
        node: <Beat lines={spec.benefits[0]} hot={spec.benefitHot[0]} size={94} accent={accent} />,
      },
      {
        key: "benefit-2",
        duration: BEATS[3],
        back: back(spec.back[3]),
        node: <Beat lines={spec.benefits[1]} hot={spec.benefitHot[1]} size={94} accent={accent} />,
      },
      {
        key: "cta",
        duration: BEATS[4],
        back: back(spec.back[4]),
        node: <SignOff line={spec.cta} accent={accent} sub={spec.sub ?? "Godlyraiment.com.au"} />,
      },
      ]}
    />
  );
};
