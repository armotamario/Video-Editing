import { useCurrentFrame } from "remotion";
import { headlineFont } from "../fonts";
import { BRAND_NAME } from "../brand";

const SPEED_PX_PER_FRAME = 2.6;
const REPEATS = 10;

export const Marquee: React.FC = () => {
  const frame = useCurrentFrame();
  const offset = frame * SPEED_PX_PER_FRAME;

  return (
    <div className="overflow-hidden whitespace-nowrap">
      <div
        style={{ transform: `translateX(-${offset}px)`, fontFamily: headlineFont }}
        className="inline-flex text-9xl text-neutral-300"
      >
        {Array.from({ length: REPEATS }).map((_, i) => (
          <span key={i} className="pr-16">
            {BRAND_NAME}
          </span>
        ))}
      </div>
    </div>
  );
};
