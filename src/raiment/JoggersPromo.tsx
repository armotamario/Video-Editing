import { Promo, promoDuration } from "./promo";
import type { PromoBeat } from "./promo";

const BEATS: PromoBeat[] = [
  { src: "store/joggers-1.png", label: "New in", line: "Godly Raiment\nJoggers", hot: "Joggers" },
  { src: "store/joggers-2.png", label: "Worn", line: "Wear your\nfaith boldly", hot: "boldly" },
  { src: "store/joggers-3.png", label: "Back", line: "Front and\nback", hot: "back" },
  { src: "store/joggers-4.png", label: "Detail", line: "Washed black.\nOne cross.", hot: "One cross." },
];

export const JOGGERS_PROMO_DURATION = promoDuration(BEATS.length);

export const JoggersPromo: React.FC = () => <Promo name="Joggers" beats={BEATS} />;
