import { Plate, Reel } from "../reel/kit";
import { AthleticBeat, AthleticQuote, AthleticSignOff } from "../reel/athletic";

/**
 * Two silent MFBA reels built from Mario's own b-roll (no voiceover, no
 * bed — just the footage and the type). Numbers here come straight from
 * his training/nutrition protocol (see plan.ts).
 */

const SUB = "@movinforwardbyarm";

export const TRAINING_BEATS = [80, 90, 90, 90];
export const TRAINING_DURATION = TRAINING_BEATS.reduce((a, b) => a + b, 0);

export const MfbaTrainingReel: React.FC = () => (
  <Reel
    beats={[
      {
        key: "hook",
        duration: TRAINING_BEATS[0],
        back: <Plate src="mfba/gym-selfie.jpg" focus="center 38%" dim={0.5} />,
        node: <AthleticBeat label="Training" lines={["50 push-ups.", "Every single", "day."]} hot="Every" />,
      },
      {
        key: "lifts",
        duration: TRAINING_BEATS[1],
        back: <Plate src="mfba/gym-selfie.jpg" focus="center 55%" from={1.14} dim={0.56} />,
        node: (
          <AthleticQuote
            text="Weighted lunges, dumbbell rows, weighted crunches, barbell curls — every set to failure."
            cite="Today's lift"
          />
        ),
      },
      {
        key: "cardio",
        duration: TRAINING_BEATS[2],
        back: <Plate src="mfba/cardio-walk.jpg" focus="center 60%" dim={0.42} />,
        node: <AthleticBeat lines={["One hour", "of cardio.", "No days off."]} hot="off" size={104} />,
      },
      {
        key: "off",
        duration: TRAINING_BEATS[3],
        back: <Plate src="mfba/mirror-night.jpg" focus="center 45%" dim={0.5} />,
        node: <AthleticSignOff line={"Can't be bothered?\nFreestyle. Lift heavy."} sub={SUB} />,
      },
    ]}
  />
);

export const DIET_BEATS = [80, 90, 90, 90];
export const DIET_DURATION = DIET_BEATS.reduce((a, b) => a + b, 0);

export const MfbaDietReel: React.FC = () => (
  <Reel
    beats={[
      {
        key: "hook",
        duration: DIET_BEATS[0],
        back: <Plate src="mfba/outdoor-cap.jpg" focus="center 30%" dim={0.46} />,
        node: <AthleticBeat label="Nutrition" lines={["1,534 calories.", "170g protein.", "Every day."]} hot="170g" />,
      },
      {
        key: "prep",
        duration: DIET_BEATS[1],
        back: <Plate src="mfba/meal-chicken.jpg" focus="center 68%" dim={0.4} />,
        node: (
          <AthleticBeat
            label="One meal"
            lines={["500g chicken.", "2 cups rice.", "939 calories."]}
            hot="939"
            size={100}
          />
        ),
      },
      {
        key: "coffee",
        duration: DIET_BEATS[2],
        back: <Plate src="mfba/coffee.jpg" focus="center 40%" dim={0.44} />,
        node: <AthleticBeat lines={["Three coffees.", "Zero sugar.", "No excuses."]} hot="Zero" size={104} />,
      },
      {
        key: "off",
        duration: DIET_BEATS[3],
        back: <Plate src="mfba/mirror-night.jpg" focus="center 45%" dim={0.5} />,
        node: <AthleticSignOff line={"Eat with people\nyou love."} sub={SUB} />,
      },
    ]}
  />
);
