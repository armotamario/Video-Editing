/**
 * A standalone Godly Raiment reel on Eucharistic adoration — one hour, spent
 * saying nothing, given a stronger hook than the October set's take on the
 * same theme.
 *
 * Scripture and the citation are quoted short and were written without web
 * access. Check the reference before posting.
 */

import type { Spec } from "./month";

const P = (src: string, focus = "center 32%", dim = 0.5) =>
  ({ kind: "plate", src, focus, dim }) as const;

const PORTRAIT = P("photos/portrait.jpg", "center 24%", 0.52);
const WALK = P("photos/walk.jpg", "center 45%", 0.5);
const DESK = P("photos/desk.jpg", "center 45%", 0.55);

export const ADORATION: Spec[] = [
  {
    id: "Adoration1", slug: "adoration-one-hour", topic: "Mass",
    hook: ["Could you not", "watch with me", "one hour?"], hookHot: "one hour",
    quote: "Come to me, all who labour and are heavy laden, and I will give you rest.",
    cite: "Matthew 11:28",
    benefits: [["No words.", "No performance."], ["Just you,", "in the room."]],
    benefitHot: ["performance", "room"],
    cta: "Find an\nhour this week",
    back: [PORTRAIT, DESK, WALK, DESK, PORTRAIT],
  },
];
