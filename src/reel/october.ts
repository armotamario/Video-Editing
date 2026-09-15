/**
 * October's Godly Raiment schedule: twenty fresh posts across the same five
 * topics, on the shape that works — hook, proof, benefits, call to action.
 *
 * No price appears anywhere in this set: these sell the reason to wear it, and
 * the shop page can do the rest.
 *
 * Scripture is quoted short and was written without web access. Check every
 * reference before posting.
 */

import type { Spec } from "./month";

const P = (src: string, focus = "center 32%", dim = 0.5) =>
  ({ kind: "plate", src, focus, dim }) as const;

const PORTRAIT = P("photos/portrait.jpg", "center 24%", 0.52);
const WALK = P("photos/walk.jpg", "center 45%", 0.5);
const DESK = P("photos/desk.jpg", "center 45%", 0.55);
const GYM = P("photos/gym.jpg", "center 35%", 0.55);
/** The store shots as photographed — cap on its own studio off-white, with
 *  only the carousel arrows and the page furniture taken out. The caption
 *  inverts to dark ink over these rather than sitting on a black card. */
const SHOT = (src: string) => ({ kind: "shot", src, light: true }) as const;

const BLACK = SHOT("store/plate-black.jpg");
const CHARCOAL = SHOT("store/plate-charcoal.jpg");
const STONE = SHOT("store/plate-stone.jpg");

export const OCTOBER: Spec[] = [
  // ---------------------------------------------------------------- products
  {
    id: "OctP1", slug: "p1-not-private", topic: "Products",
    hook: ["Faith isn't", "a private", "thing."], hookHot: "private",
    quote: "You are the light of the world. A city set on a hill cannot be hidden.",
    cite: "Matthew 5:14",
    benefits: [["Wear it", "where people", "see it."], ["That's the", "whole point."]],
    benefitHot: ["see", "point"],
    cta: "Wear what\nyou believe",
    back: [PORTRAIT, WALK, BLACK, STONE, PORTRAIT],
  },
  {
    id: "OctP2", slug: "p2-armour", topic: "Products",
    hook: ["Get dressed", "for the", "fight."], hookHot: "fight",
    quote: "Put on the whole armour of God.",
    cite: "Ephesians 6:11",
    benefits: [["A cross", "on your", "head."], ["A reminder", "before anyone", "speaks."]],
    benefitHot: ["cross", "reminder"],
    cta: "Godly Raiment",
    back: [CHARCOAL, GYM, BLACK, WALK, PORTRAIT],
  },
  {
    id: "OctP3", slug: "p3-three-ways", topic: "Products",
    hook: ["One cross.", "Three ways", "to wear it."], hookHot: "cross",
    quote: "Let all that you do be done in love.",
    cite: "1 Corinthians 16:14",
    benefits: [["Black for", "most days."], ["Stone when", "it's bright."]],
    benefitHot: ["Black", "Stone"],
    cta: "Out now",
    back: [BLACK, CHARCOAL, STONE, WALK, PORTRAIT],
  },
  {
    id: "OctP4", slug: "p4-they-ask", topic: "Products",
    hook: ["Someone will", "ask you", "about it."], hookHot: "ask",
    quote: "Always be ready to give a reason for the hope that is in you.",
    cite: "1 Peter 3:15",
    benefits: [["That's not", "awkward."], ["That's the", "opening."]],
    benefitHot: ["awkward", "opening"],
    cta: "Wear what\nyou believe",
    back: [PORTRAIT, DESK, STONE, CHARCOAL, PORTRAIT],
  },

  // ------------------------------------------------------------------ prayer
  {
    id: "OctR1", slug: "r1-same-time", topic: "Prayer",
    hook: ["Pick a time.", "Keep it.", "That's it."], hookHot: "time",
    quote: "Evening and morning and at noon I will pray.",
    cite: "Psalm 55:17",
    benefits: [["A set hour", "beats a", "good mood."], ["Ten minutes", "that don't", "move."]],
    benefitHot: ["hour", "move"],
    cta: "Same time\ntomorrow",
    back: [PORTRAIT, WALK, DESK, WALK, PORTRAIT],
  },
  {
    id: "OctR2", slug: "r2-wanders", topic: "Prayer",
    hook: ["Your mind", "wanders.", "Keep going."], hookHot: "wanders",
    quote: "The spirit is willing, but the flesh is weak.",
    cite: "Matthew 26:41",
    benefits: [["Distraction", "isn't", "failure."], ["Coming back", "is the", "prayer."]],
    benefitHot: ["failure", "prayer"],
    cta: "Start again\ntoday",
    back: [DESK, PORTRAIT, WALK, DESK, PORTRAIT],
  },
  {
    id: "OctR3", slug: "r3-not-an-hour", topic: "Prayer",
    hook: ["You don't need", "an hour."], hookHot: "hour",
    quote: "When you pray, do not heap up empty phrases.",
    cite: "Matthew 6:7",
    benefits: [["Short and", "honest beats", "long and", "empty."], ["Say the", "real thing."]],
    benefitHot: ["honest", "real"],
    cta: "Two minutes,\nnow",
    back: [WALK, PORTRAIT, DESK, PORTRAIT, PORTRAIT],
  },
  {
    id: "OctR4", slug: "r4-your-hands", topic: "Prayer",
    hook: ["Give your hands", "something", "to do."], hookHot: "hands",
    quote: "Pray without ceasing.",
    cite: "1 Thessalonians 5:17",
    benefits: [["A decade", "on the walk", "home."], ["The body", "helps the mind", "stay."]],
    benefitHot: ["decade", "body"],
    cta: "One decade\ntoday",
    back: [WALK, WALK, PORTRAIT, WALK, PORTRAIT],
  },

  // ------------------------------------------------------------------- bible
  {
    id: "OctB1", slug: "b1-not-genesis", topic: "Bible",
    hook: ["Don't start", "at Genesis."], hookHot: "Genesis",
    quote: "Faith comes from what is heard.",
    cite: "Romans 10:17",
    benefits: [["Start with", "a Gospel."], ["Fifteen minutes.", "Same chair."]],
    benefitHot: ["Gospel", "Same"],
    cta: "Open one\ntonight",
    back: [DESK, PORTRAIT, DESK, WALK, PORTRAIT],
  },
  {
    id: "OctB2", slug: "b2-one-chapter", topic: "Bible",
    hook: ["One chapter", "a day.", "That's a year."], hookHot: "year",
    quote: "Man shall not live by bread alone, but by every word that comes from the mouth of God.",
    cite: "Matthew 4:4",
    benefits: [["Not a plan", "you'll quit", "in March."], ["One chapter.", "Every day."]],
    benefitHot: ["quit", "Every"],
    cta: "Chapter one,\ntonight",
    back: [DESK, DESK, PORTRAIT, DESK, PORTRAIT],
  },
  {
    id: "OctB3", slug: "b3-dont-get-it", topic: "Bible",
    hook: ["You'll read it", "and not", "get it."], hookHot: "get",
    quote: "How can I, unless someone guides me?",
    cite: "Acts 8:31",
    benefits: [["Ask someone.", "That's what", "the Church", "is for."], ["Nobody works", "it out", "alone."]],
    benefitHot: ["Church", "alone"],
    cta: "Ask, don't\nguess",
    back: [PORTRAIT, DESK, WALK, DESK, PORTRAIT],
  },
  {
    id: "OctB4", slug: "b4-do-it", topic: "Bible",
    hook: ["Reading it", "isn't", "the point."], hookHot: "point",
    quote: "Be doers of the word, and not hearers only.",
    cite: "James 1:22",
    benefits: [["One line.", "One change."], ["That's a", "good week."]],
    benefitHot: ["change", "good"],
    cta: "Pick one line",
    back: [DESK, WALK, PORTRAIT, DESK, PORTRAIT],
  },

  // -------------------------------------------------------------------- mass
  {
    id: "OctM1", slug: "m1-week-starts", topic: "Mass",
    hook: ["Your week", "starts on", "Sunday."], hookHot: "Sunday",
    quote: "Remember the sabbath day, to keep it holy.",
    cite: "Exodus 20:8",
    benefits: [["Everything else", "moves around", "it."], ["Not the", "other way."]],
    benefitHot: ["around", "other"],
    cta: "Sunday first",
    back: [PORTRAIT, WALK, PORTRAIT, WALK, PORTRAIT],
  },
  {
    id: "OctM2", slug: "m2-five-early", topic: "Mass",
    hook: ["Get there", "five minutes", "early."], hookHot: "early",
    quote: "Be still, and know that I am God.",
    cite: "Psalm 46:10",
    benefits: [["Walk in", "settled, not", "sprinting."], ["Five minutes", "changes the", "whole hour."]],
    benefitHot: ["settled", "whole"],
    cta: "Five minutes\nearly",
    back: [WALK, PORTRAIT, WALK, PORTRAIT, PORTRAIT],
  },
  {
    id: "OctM3", slug: "m3-been-away", topic: "Mass",
    hook: ["You've been", "away", "a while."], hookHot: "away",
    quote: "There is joy in heaven over one sinner who repents.",
    cite: "Luke 15:7",
    benefits: [["The priest", "has heard", "worse."], ["Go before", "Mass. Not", "someday."]],
    benefitHot: ["worse", "someday"],
    cta: "Go this week",
    back: [PORTRAIT, DESK, PORTRAIT, WALK, PORTRAIT],
  },
  {
    id: "OctM4", slug: "m4-say-nothing", topic: "Mass",
    hook: ["Sit with Him", "and say", "nothing."], hookHot: "nothing",
    quote: "Come to me, all who labour and are heavy laden.",
    cite: "Matthew 11:28",
    benefits: [["No words", "required."], ["Just stay", "the hour."]],
    benefitHot: ["words", "stay"],
    cta: "Find an hour",
    back: [PORTRAIT, PORTRAIT, WALK, PORTRAIT, PORTRAIT],
  },

  // -------------------------------------------------------------- fellowship
  {
    id: "OctF1", slug: "f1-shaping-you", topic: "Fellowship",
    hook: ["Your mates", "are shaping", "you."], hookHot: "shaping",
    quote: "Iron sharpens iron.",
    cite: "Proverbs 27:17",
    benefits: [["Pick the ones", "who make you", "better."], ["Quietly drop", "the rest."]],
    benefitHot: ["better", "drop"],
    cta: "Pick your five",
    back: [GYM, PORTRAIT, WALK, GYM, PORTRAIT],
  },
  {
    id: "OctF2", slug: "f2-go-first", topic: "Fellowship",
    hook: ["Stop waiting", "to be", "invited."], hookHot: "waiting",
    quote: "Come and see.",
    cite: "John 1:46",
    benefits: [["Two words.", "Send them."], ["Somebody has", "to go", "first."]],
    benefitHot: ["Send", "first"],
    cta: "Send the text",
    back: [PORTRAIT, WALK, DESK, PORTRAIT, PORTRAIT],
  },
  {
    id: "OctF3", slug: "f3-barely-holding", topic: "Fellowship",
    hook: ["Someone you know", "is barely", "holding on."], hookHot: "barely",
    quote: "Bear one another's burdens.",
    cite: "Galatians 6:2",
    benefits: [["You don't need", "the right", "words."], ["You need", "to turn up."]],
    benefitHot: ["right", "up"],
    cta: "Check on\none person",
    back: [WALK, PORTRAIT, GYM, WALK, PORTRAIT],
  },
  {
    id: "OctF4", slug: "f4-repetition", topic: "Fellowship",
    hook: ["Friendship is", "built on", "repetition."], hookHot: "repetition",
    quote: "A friend loves at all times.",
    cite: "Proverbs 17:17",
    benefits: [["Same day.", "Same time.", "Every week."], ["That's how", "it gets", "deep."]],
    benefitHot: ["Every", "deep"],
    cta: "Set a\nstanding day",
    back: [GYM, WALK, PORTRAIT, GYM, PORTRAIT],
  },
];
