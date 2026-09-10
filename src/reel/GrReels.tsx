import { Beat, Float, Plate, Reel, SignOff } from "./kit";

/**
 * Godly Raiment in the footage-with-captions style: a picture holds the frame
 * and the words do the work, one accented word a line.
 */

/** The cap, and what wearing it actually claims. */
export const GrClothes: React.FC = () => (
  <Reel
    beats={[
      {
        key: "hook",
        duration: 66,
        back: <Plate src="photos/portrait.jpg" focus="center 22%" dim={0.42} />,
        node: <Beat lines={["Your clothes", "already say", "something."]} hot="say" size={102} />,
      },
      {
        key: "turn",
        duration: 58,
        back: <Plate src="photos/portrait.jpg" focus="center 30%" from={1.14} dim={0.5} />,
        node: <Beat lines={["You just", "never chose", "what."]} hot="chose" size={104} />,
      },
      {
        key: "cap",
        duration: 62,
        back: <Float src="store/black.png" />,
        node: <Beat lines={["So choose."]} hot="choose" size={128} />,
      },
      {
        key: "stone",
        duration: 56,
        back: <Float src="store/stone.png" />,
        node: <Beat lines={["A cross", "on the front.", "That's the whole pitch."]} hot="cross" size={82} />,
      },
      {
        key: "charcoal",
        duration: 56,
        back: <Float src="store/charcoal.png" />,
        node: <Beat lines={["$28.99.", "Three colours.", "Out now."]} hot="now" size={92} />,
      },
      {
        key: "off",
        duration: 72,
        back: <Plate src="photos/portrait.jpg" focus="center 26%" dim={0.52} />,
        node: <SignOff line={"Wear what\nyou believe"} />,
      },
    ]}
  />
);

/** For the lapsed — the one that names the thing out loud. */
export const GrStillCatholic: React.FC = () => (
  <Reel
    beats={[
      {
        key: "hook",
        duration: 72,
        back: <Plate src="photos/portrait.jpg" focus="center 24%" dim={0.5} />,
        node: <Beat lines={["POV: you still", "call yourself", "Catholic."]} hot="Catholic" size={96} />,
      },
      {
        key: "a",
        duration: 52,
        back: <Plate src="photos/walk.jpg" focus="center 55%" dim={0.5} />,
        node: <Beat lines={["Can't remember", "your last", "confession."]} hot="confession" size={88} />,
      },
      {
        key: "b",
        duration: 52,
        back: <Plate src="photos/walk.jpg" focus="center 35%" from={1.16} dim={0.52} />,
        node: <Beat lines={["Haven't been", "to Mass", "since Easter."]} hot="Easter" size={90} />,
      },
      {
        key: "c",
        duration: 52,
        back: <Plate src="photos/desk.jpg" focus="center 45%" dim={0.55} />,
        node: <Beat lines={["Still pray", "when it", "goes wrong."]} hot="pray" size={94} />,
      },
      {
        key: "turn",
        duration: 76,
        back: <Plate src="photos/portrait.jpg" focus="center 30%" from={1.18} dim={0.46} />,
        node: <Beat lines={["That's not", "nothing.", "That's a start."]} hot="start" size={94} />,
      },
      {
        key: "off",
        duration: 78,
        back: <Plate src="photos/portrait.jpg" focus="center 22%" dim={0.54} />,
        node: <SignOff line={"Confession is\nSaturday"} />,
      },
    ]}
  />
);

/** Five minutes — the time argument, made plainly. */
export const GrFiveMinutes: React.FC = () => (
  <Reel
    beats={[
      {
        key: "hook",
        duration: 68,
        back: <Plate src="photos/desk.jpg" focus="center 40%" dim={0.5} />,
        node: <Beat lines={["Three hours", "on your phone.", "Today."]} hot="Three" size={98} />,
      },
      {
        key: "a",
        duration: 58,
        back: <Plate src="photos/desk.jpg" focus="center 55%" from={1.16} dim={0.55} />,
        node: <Beat lines={["You're not", "short on", "time."]} hot="time" size={104} />,
      },
      {
        key: "b",
        duration: 60,
        back: <Plate src="photos/walk.jpg" focus="center 45%" dim={0.48} />,
        node: <Beat lines={["You're short", "on the", "five minutes."]} hot="five" size={92} />,
      },
      {
        key: "c",
        duration: 64,
        back: <Plate src="photos/walk.jpg" focus="center 30%" from={1.18} dim={0.5} />,
        node: <Beat lines={["Before the", "phone.", "Not after."]} hot="Before" size={100} />,
      },
      {
        key: "off",
        duration: 76,
        back: <Plate src="photos/portrait.jpg" focus="center 24%" dim={0.54} />,
        node: <SignOff line={"Give Him\nfive"} />,
      },
    ]}
  />
);

/** The cross on the cap, and why it isn't a fashion choice. */
export const GrNotJewellery: React.FC = () => (
  <Reel
    beats={[
      {
        key: "hook",
        duration: 70,
        back: <Float src="store/black.png" drift={16} />,
        node: <Beat lines={["It's not", "jewellery."]} hot="jewellery" size={124} />,
      },
      {
        key: "a",
        duration: 62,
        back: <Float src="store/charcoal.png" drift={20} />,
        node: <Beat lines={["It's an", "execution", "device."]} hot="execution" size={98} />,
      },
      {
        key: "b",
        duration: 62,
        back: <Plate src="photos/portrait.jpg" focus="center 34%" from={1.2} dim={0.5} />,
        node: <Beat lines={["Worn on", "purpose.", "Every day."]} hot="purpose" size={100} />,
      },
      {
        key: "c",
        duration: 66,
        back: <Float src="store/stone.png" drift={18} />,
        node: <Beat lines={["By people", "who believe", "it didn't end there."]} hot="believe" size={80} />,
      },
      {
        key: "off",
        duration: 68,
        back: <Plate src="photos/portrait.jpg" focus="center 22%" dim={0.54} />,
        node: <SignOff line={"Wear what\nyou believe"} />,
      },
    ]}
  />
);
