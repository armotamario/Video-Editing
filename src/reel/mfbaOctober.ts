import type { Spec } from "./month";

/**
 * October's MFBA schedule: twenty fresh posts on the same shape as the Godly
 * Raiment set, in MFBA's own athletic treatment.
 *
 * Every proof line is his own protocol or his own weigh-ins — the 55kg, the
 * 175g of protein against 1,534 calories, three sessions a week, eight
 * movements across two days, five laps of the block, sixteen weeks. Nothing
 * here is a study, and nothing is invented.
 */

const ORANGE = "#ff6a1f";
const SUB = "@movinforwardbyarm";

const C = (src: string, startFrom = 0, dim = 0.5) =>
  ({ kind: "clip", src, startFrom, dim }) as const;
const P = (src: string, focus = "center 35%", dim = 0.52) =>
  ({ kind: "plate", src, focus, dim }) as const;

const GYM = P("photos/gym.jpg", "center 35%", 0.54);
const MEAL = P("photos/meal.jpg", "center 50%", 0.54);
const PLATE = P("photos/plate.jpg", "center 45%", 0.54);
const WALK = P("photos/walk.jpg", "center 45%", 0.5);
const PORTRAIT = P("photos/portrait.jpg", "center 24%", 0.54);
const DESK = P("photos/desk.jpg", "center 45%", 0.55);

const base = { accent: ORANGE, sub: SUB } as const;
const CTA = "Free 30 days\nthen $100/mo";

export const MFBA_OCTOBER: Spec[] = [
  // ---------------------------------------------------------------- training
  {
    ...base, id: "MfbOT1", slug: "t1-warm-up", topic: "Products",
    hook: ["Five minutes", "you keep", "skipping."], hookHot: "skipping",
    quote: "Two light sets before the working sets. Every movement, every session.",
    cite: "What I do first",
    benefits: [["Cheaper than", "a month", "off."], ["Every session.", "No exceptions."]],
    benefitHot: ["Cheaper", "No"],
    cta: CTA,
    back: [C("edit/pre_b.mp4", 200), GYM, C("edit/pre_e.mp4", 250), GYM, PORTRAIT],
  },
  {
    ...base, id: "MfbOT2", slug: "t2-rest", topic: "Products",
    hook: ["Ninety seconds.", "Not five", "minutes."], hookHot: "Ninety",
    quote: "Long enough to lift heavy, short enough to still be in the session.",
    cite: "How I time it",
    benefits: [["Set a timer.", "Don't scroll."], ["The whole thing", "stays under", "an hour."]],
    benefitHot: ["scroll", "hour"],
    cta: CTA,
    back: [C("edit/pre_c.mp4", 700), C("edit/pre_b.mp4", 900), GYM, C("edit/pre_e.mp4", 600), PORTRAIT],
  },
  {
    ...base, id: "MfbOT3", slug: "t3-form", topic: "Products",
    hook: ["Lighter.", "Slower.", "Further."], hookHot: "Slower",
    quote: "Half the weight through a full range beat double with none. Every time.",
    cite: "What actually grew",
    benefits: [["Full stretch.", "Full squeeze."], ["Your joints", "last longer."]],
    benefitHot: ["stretch", "longer"],
    cta: CTA,
    back: [C("edit/pre_e.mp4", 400), C("edit/pre_c.mp4", 1100), GYM, C("edit/pre_b.mp4", 1100), PORTRAIT],
  },
  {
    ...base, id: "MfbOT4", slug: "t4-two-days", topic: "Products",
    hook: ["Two days.", "Eight movements.", "Repeat."], hookHot: "Eight",
    quote: "Push and legs one day, pull and core the other. That's the whole split.",
    cite: "My entire week",
    benefits: [["No guessing", "what to do."], ["Walk in", "and start."]],
    benefitHot: ["guessing", "start"],
    cta: CTA,
    back: [GYM, C("edit/pre_b.mp4", 1600), C("edit/pre_c.mp4", 1700), C("edit/pre_e.mp4", 750), PORTRAIT],
  },

  // --------------------------------------------------------------- nutrition
  {
    ...base, id: "MfbON1", slug: "n1-breakfast", topic: "Prayer",
    hook: ["Protein before", "your first", "coffee."], hookHot: "coffee",
    quote: "Forty grams at breakfast and the other 135 took care of themselves.",
    cite: "How I split 175g",
    benefits: [["You stop", "snacking", "by ten."], ["One decision,", "made early."]],
    benefitHot: ["snacking", "early"],
    cta: CTA,
    back: [MEAL, PLATE, MEAL, PLATE, PORTRAIT],
  },
  {
    ...base, id: "MfbON2", slug: "n2-not-starving", topic: "Prayer",
    hook: ["Hungry all day", "means you", "got it wrong."], hookHot: "wrong",
    quote: "1,534 calories and I was never starving. Volume, not willpower.",
    cite: "How I actually ate",
    benefits: [["Vegetables", "fill the", "plate."], ["Protein keeps", "you full."]],
    benefitHot: ["fill", "full"],
    cta: CTA,
    back: [PLATE, MEAL, PLATE, MEAL, PORTRAIT],
  },
  {
    ...base, id: "MfbON3", slug: "n3-weekend", topic: "Prayer",
    hook: ["Five good days.", "Two that", "undo them."], hookHot: "undo",
    quote: "A weekend can wipe out the whole week's deficit. Mine did, twice.",
    cite: "The hard way",
    benefits: [["Same meals", "Saturday."], ["One meal out.", "Not three."]],
    benefitHot: ["Same", "three"],
    cta: CTA,
    back: [MEAL, PLATE, WALK, MEAL, PORTRAIT],
  },
  {
    ...base, id: "MfbON4", slug: "n4-thirsty", topic: "Prayer",
    hook: ["You're not", "hungry. You're", "thirsty."], hookHot: "thirsty",
    quote: "Three litres a day, and half of what I called hunger went away.",
    cite: "The cheapest change I made",
    benefits: [["A bottle", "on the desk."], ["Finish it", "twice."]],
    benefitHot: ["bottle", "twice"],
    cta: CTA,
    back: [DESK, MEAL, PLATE, DESK, PORTRAIT],
  },

  // ------------------------------------------------------------------ cardio
  {
    ...base, id: "MfbOC1", slug: "c1-after-dinner", topic: "Bible",
    hook: ["Walk after", "you eat."], hookHot: "after",
    quote: "Ten minutes after dinner. Every night. That's where mine started.",
    cite: "My easiest habit",
    benefits: [["No kit.", "No planning."], ["It's the one", "you'll actually", "keep."]],
    benefitHot: ["No", "keep"],
    cta: CTA,
    back: [WALK, WALK, MEAL, WALK, PORTRAIT],
  },
  {
    ...base, id: "MfbOC2", slug: "c2-no-treadmill", topic: "Bible",
    hook: ["You don't need", "a treadmill."], hookHot: "treadmill",
    quote: "Stairs, hills, the long way to the shops. All of it counted.",
    cite: "Where mine came from",
    benefits: [["Add it to", "what you", "already do."], ["No extra", "hour needed."]],
    benefitHot: ["already", "extra"],
    cta: CTA,
    back: [WALK, WALK, WALK, GYM, PORTRAIT],
  },
  {
    ...base, id: "MfbOC3", slug: "c3-talk-test", topic: "Bible",
    hook: ["If you can't", "talk, you're", "going too hard."], hookHot: "talk",
    quote: "Slow enough to hold a conversation. That's the pace that lasted.",
    cite: "How fast to walk",
    benefits: [["You'll do it", "again", "tomorrow."], ["That's the", "whole trick."]],
    benefitHot: ["tomorrow", "whole"],
    cta: CTA,
    back: [WALK, C("edit/pre_e.mp4", 900), WALK, WALK, PORTRAIT],
  },
  {
    ...base, id: "MfbOC4", slug: "c4-never-zero", topic: "Bible",
    hook: ["One lap", "beats", "none."], hookHot: "none",
    quote: "On the worst days I still did one lap. Never zero.",
    cite: "The rule I kept",
    benefits: [["Zero is the", "only bad", "number."], ["One lap keeps", "the streak."]],
    benefitHot: ["Zero", "streak"],
    cta: CTA,
    back: [WALK, WALK, C("edit/pre_c.mp4", 1400), WALK, PORTRAIT],
  },

  // ----------------------------------------------------------------- mindset
  {
    ...base, id: "MfbOX1", slug: "x1-week-three", topic: "Mass",
    hook: ["Week three", "against their", "year three."], hookHot: "three",
    quote: "Sixteen weeks in I still didn't look like the people I was watching.",
    cite: "Where I actually was",
    benefits: [["Watch your", "own numbers."], ["Nobody else's", "timeline", "is yours."]],
    benefitHot: ["own", "yours"],
    cta: CTA,
    back: [GYM, C("edit/pre_b.mp4", 500), C("edit/pre_c.mp4", 800), WALK, PORTRAIT],
  },
  {
    ...base, id: "MfbOX2", slug: "x2-decide-once", topic: "Mass",
    hook: ["Stop trying", "to feel", "motivated."], hookHot: "motivated",
    quote: "I stopped asking whether I felt like it. The days were already decided.",
    cite: "What changed",
    benefits: [["Decide once.", "On Sunday."], ["Then it's just", "turning up."]],
    benefitHot: ["once", "turning"],
    cta: CTA,
    back: [C("edit/pre_e.mp4", 1000), GYM, WALK, C("edit/pre_b.mp4", 1900), PORTRAIT],
  },
  {
    ...base, id: "MfbOX3", slug: "x3-scale-lies", topic: "Mass",
    hook: ["The scale", "lied to me", "for a week."], hookHot: "lied",
    quote: "Up 1.2kg on the Monday, down 2kg by the Friday. Same food all week.",
    cite: "My own weigh-ins",
    benefits: [["Weigh daily.", "Read the", "weekly average."], ["One day means", "nothing."]],
    benefitHot: ["average", "nothing"],
    cta: CTA,
    back: [PORTRAIT, GYM, C("edit/pre_c.mp4", 1600), MEAL, PORTRAIT],
  },
  {
    ...base, id: "MfbOX4", slug: "x4-start-again", topic: "Mass",
    hook: ["You've started", "four times.", "Start again."], hookHot: "again",
    quote: "I restarted more times than I can count before the one that stuck.",
    cite: "How mine actually went",
    benefits: [["The last restart", "is the only", "one that counts."], ["Today works", "fine."]],
    benefitHot: ["last", "Today"],
    cta: CTA,
    back: [PORTRAIT, WALK, GYM, C("edit/pre_e.mp4", 500), PORTRAIT],
  },

  // ------------------------------------------------------------------- start
  {
    ...base, id: "MfbOS1", slug: "s1-week-one", topic: "Fellowship",
    hook: ["Week one", "is not the", "hard part."], hookHot: "one",
    quote: "Three sessions, protein at every meal, a walk a day. That's week one.",
    cite: "All of it",
    benefits: [["Week six is", "where people", "go."], ["That's what", "I coach you", "through."]],
    benefitHot: ["six", "coach"],
    cta: CTA,
    back: [GYM, C("edit/pre_b.mp4", 300), MEAL, WALK, PORTRAIT],
  },
  {
    ...base, id: "MfbOS2", slug: "s2-what-youve-got", topic: "Fellowship",
    hook: ["Tell me what", "you've got.", "I'll write it."], hookHot: "got",
    quote: "A full gym, two dumbbells, or a floor — the program is built around it.",
    cite: "How it works",
    benefits: [["No “find a", "cable machine”."], ["Only what", "you can", "reach."]],
    benefitHot: ["No", "reach"],
    cta: CTA,
    back: [PORTRAIT, GYM, C("edit/pre_e.mp4", 350), GYM, PORTRAIT],
  },
  {
    ...base, id: "MfbOS3", slug: "s3-someone-notices", topic: "Fellowship",
    hook: ["The program", "isn't the", "hard bit."], hookHot: "hard",
    quote: "Weekly check-ins, and a message from me when the week falls apart.",
    cite: "What you're actually paying for",
    benefits: [["That's the", "difference", "from a PDF."], ["Someone", "notices."]],
    benefitHot: ["PDF", "notices"],
    cta: CTA,
    back: [PORTRAIT, DESK, GYM, C("edit/pre_c.mp4", 400), PORTRAIT],
  },
  {
    ...base, id: "MfbOS4", slug: "s4-thirty-days", topic: "Fellowship",
    hook: ["Thirty days.", "Nothing", "to pay."], hookHot: "Nothing",
    quote: "Cancel inside the 30 days and you've paid nothing at all.",
    cite: "No lock-in, no sign-up fee",
    benefits: [["Try the whole", "thing first."], ["Then it's", "$100", "a month."]],
    benefitHot: ["whole", "$100"],
    cta: CTA,
    back: [PORTRAIT, GYM, MEAL, WALK, PORTRAIT],
  },
];
