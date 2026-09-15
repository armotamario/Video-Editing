import { Beat, Clip, Float, PAPER_ACCENT, Plate, Quote, Reel, Shot, SignOff } from "./kit";
import type { Spec } from "./month";

/** Hook, proof, two benefit beats, call to action — 13s at 30fps. */
export const BEATS = [78, 102, 66, 66, 78];
export const MONTH_DURATION = BEATS.reduce((a, b) => a + b, 0);

const back = (b: Spec["back"][number]) => {
  if (b.kind === "shot") return <Shot src={b.src} />;
  if (b.kind === "float") return <Float src={b.src} />;
  if (b.kind === "clip") return <Clip src={b.src} startFrom={b.startFrom} dim={b.dim} />;
  return <Plate src={b.src} focus={b.focus} dim={b.dim} />;
};

/** Godly Raiment's beds, by topic. */
const GR_TRACK: Record<string, string> = {
  Products: "gr-promo",
  Prayer: "gr-prayer",
  Bible: "gr-bible",
  Mass: "gr-mass",
  Fellowship: "gr-bible",
};

export const MonthReel: React.FC<{ spec: Spec }> = ({ spec }) => {
  const accent = spec.accent ?? "#e8b23c";
  /** A cut-out beat carries the product, so the caption scrim keeps off it;
   *  a pale product plate takes a white wash and dark ink instead. */
  const light = (i: number) => spec.back[i].light === true;
  const scrim = (i: number): "top" | "band" | "none" =>
    light(i) ? "none" : spec.back[i].kind === "float" ? "top" : "band";
  /** On paper the caption rides higher, clear of the product. */
  const top = (i: number) => (light(i) ? 330 : undefined);
  /** And the gold has to carry more ink to hold against white. */
  const hue = (i: number) => (light(i) ? PAPER_ACCENT : accent);
  const ink = (i: number): "light" | "dark" => (light(i) ? "dark" : "light");
  return (
    <Reel
      track={spec.track ?? GR_TRACK[spec.topic]}
      beats={[
      {
        key: "hook",
        duration: BEATS[0],
        back: back(spec.back[0]),
        node: (
          <Beat
            lines={spec.hook}
            hot={spec.hookHot}
            size={96}
            accent={hue(0)}
            scrim={scrim(0)}
            ink={ink(0)}
            top={top(0)}
          />
        ),
      },
      {
        key: "proof",
        duration: BEATS[1],
        back: back(spec.back[1]),
        node: (
          <Quote
            text={spec.quote}
            cite={spec.cite}
            accent={hue(1)}
            ink={ink(1)}
            top={top(1)}
          />
        ),
      },
      {
        key: "benefit-1",
        duration: BEATS[2],
        back: back(spec.back[2]),
        node: (
          <Beat
            lines={spec.benefits[0]}
            hot={spec.benefitHot[0]}
            size={94}
            accent={hue(2)}
            scrim={scrim(2)}
            ink={ink(2)}
            top={top(2)}
          />
        ),
      },
      {
        key: "benefit-2",
        duration: BEATS[3],
        back: back(spec.back[3]),
        node: (
          <Beat
            lines={spec.benefits[1]}
            hot={spec.benefitHot[1]}
            size={94}
            accent={hue(3)}
            scrim={scrim(3)}
            ink={ink(3)}
            top={top(3)}
          />
        ),
      },
      {
        key: "cta",
        duration: BEATS[4],
        back: back(spec.back[4]),
        node: (
          <SignOff
            line={spec.cta}
            accent={hue(4)}
            sub={spec.sub ?? "Godlyraiment.com.au"}
            ink={ink(4)}
          />
        ),
      },
      ]}
    />
  );
};
