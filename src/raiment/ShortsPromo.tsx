import { Promo, promoDuration } from "./promo";
import type { PromoBeat } from "./promo";

const BEATS: PromoBeat[] = [
  { src: "store/shorts-1.jpg", label: "New in", line: "Godly Raiment\nShorts", hot: "Shorts" },
  { src: "store/shorts-2.jpg", label: "Front", line: "Wear what\nyou believe", hot: "you believe" },
  { src: "store/shorts-3.jpg", label: "Detail", line: "Gold cross\non the leg", hot: "Gold cross" },
  { src: "store/shorts-4.jpg", label: "Back", line: "Front and\nback", hot: "back" },
  { src: "store/shorts-5.jpg", label: "Worn", line: "One colour.\nOne cross.", hot: "One cross." },
];

export const SHORTS_PROMO_DURATION = promoDuration(BEATS.length);

export const ShortsPromo: React.FC = () => <Promo name="Shorts" beats={BEATS} />;
