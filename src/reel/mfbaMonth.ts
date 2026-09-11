import type { Spec } from "./month";

/**
 * Twenty MFBA posts on the same shape as the Godly Raiment set — hook, proof,
 * benefits, call to action.
 *
 * The proof beat is his own numbers, not a study. Everything quoted here comes
 * from the protocol he gave me: the 55kg he lost, three sessions a week at
 * 9:00-9:50 PM, eight movements across two alternating days, 175g of protein
 * against 1,534 calories, 5.6kg of chicken and 28 cups of rice prepped in one
 * go, five laps of the block, and twelve sessions in a good month.
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

const base = { accent: ORANGE, sub: SUB } as const;

export const MFBA_MONTH: Spec[] = [
  // ---------------------------------------------------------------- training
  {
    ...base, id: "MfbA1", slug: "t1-failure", topic: "Products",
    hook: ["Three nights", "a week.", "That's all."], hookHot: "Three",
    quote: "Eight movements, two alternating days, every set taken to failure.",
    cite: "The whole program",
    benefits: [["Push, pull,", "legs, core."], ["Fifty minutes.", "Then home."]],
    benefitHot: ["core", "home"],
    cta: "Free 30 days\nthen $100/mo",
    back: [C("edit/pre_b.mp4", 120), C("edit/pre_c.mp4", 300), C("edit/pre_e.mp4", 200), GYM, PORTRAIT],
  },
  {
    ...base, id: "MfbA2", slug: "t2-last-rep", topic: "Products",
    hook: ["The last rep", "should be", "ugly."], hookHot: "ugly",
    quote: "If the last one looks like the first one, the set didn't happen.",
    cite: "How I train",
    benefits: [["Three sets.", "To failure.", "Every time."], ["Phone face", "down."]],
    benefitHot: ["failure", "down"],
    cta: "Free 30 days\nthen $100/mo",
    back: [C("edit/pre_c.mp4", 450), C("edit/pre_b.mp4", 600), C("edit/pre_e.mp4", 500), GYM, PORTRAIT],
  },
  {
    ...base, id: "MfbA3", slug: "t3-overload", topic: "Products",
    hook: ["Same weight", "for six months", "= same body."], hookHot: "same",
    quote: "Add a rep, add a set, add weight, slow it down, or cut the rest.",
    cite: "Five ways to progress",
    benefits: [["One of the", "five, every", "session."], ["Write it down", "or you won't", "know."]],
    benefitHot: ["five", "down"],
    cta: "Free 30 days\nthen $100/mo",
    back: [C("edit/pre_e.mp4", 150), C("edit/pre_c.mp4", 900), C("edit/pre_b.mp4", 900), GYM, PORTRAIT],
  },
  {
    ...base, id: "MfbA4", slug: "t4-no-gym", topic: "Products",
    hook: ["You don't", "need a gym.", "You need a floor."], hookHot: "floor",
    quote: "A pair of dumbbells and a floor is enough to write a full program.",
    cite: "What you actually need",
    benefits: [["Push-ups,", "rows, squats,", "leg raises."], ["That's a", "whole body."]],
    benefitHot: ["rows", "whole"],
    cta: "Free 30 days\nthen $100/mo",
    back: [C("edit/pre_e.mp4", 700), C("edit/pre_b.mp4", 1400), C("edit/pre_c.mp4", 1500), GYM, PORTRAIT],
  },

  // --------------------------------------------------------------- nutrition
  {
    ...base, id: "MfbN1", slug: "n1-protein", topic: "Prayer",
    hook: ["175 grams.", "Every single", "day."], hookHot: "175",
    quote: "175g of protein against 1,534 calories. That's the whole diet.",
    cite: "My actual numbers",
    benefits: [["Chicken,", "rice,", "broccoli."], ["The same", "meals. On", "repeat."]],
    benefitHot: ["rice", "same"],
    cta: "Free 30 days\nthen $100/mo",
    back: [MEAL, PLATE, MEAL, PLATE, PORTRAIT],
  },
  {
    ...base, id: "MfbN2", slug: "n2-prep", topic: "Prayer",
    hook: ["Cook once.", "Eat all", "week."], hookHot: "once",
    quote: "5.6kg of chicken breast and 28 cups of rice, prepped in one go.",
    cite: "One Sunday afternoon",
    benefits: [["No deciding.", "No takeaway."], ["The decision", "is already", "made."]],
    benefitHot: ["deciding", "made"],
    cta: "Free 30 days\nthen $100/mo",
    back: [PLATE, MEAL, PLATE, MEAL, PORTRAIT],
  },
  {
    ...base, id: "MfbN3", slug: "n3-tracking", topic: "Prayer",
    hook: ["You're eating", "more than", "you think."], hookHot: "more",
    quote: "Track one honest week. Weigh it once, save the meal, move on.",
    cite: "The only week that matters",
    benefits: [["Not forever.", "Just once."], ["You'll never", "guess the", "same again."]],
    benefitHot: ["once", "never"],
    cta: "Free 30 days\nthen $100/mo",
    back: [MEAL, PLATE, MEAL, PLATE, PORTRAIT],
  },
  {
    ...base, id: "MfbN4", slug: "n4-with-people", topic: "Prayer",
    hook: ["The rule that", "matters more", "than macros."], hookHot: "macros",
    quote: "Eat with people. Talking, joking, watching something together.",
    cite: "Not alone at the bench",
    benefits: [["A diet you", "hate lasts", "three weeks."], ["One you can", "live with", "lasts years."]],
    benefitHot: ["hate", "years"],
    cta: "Free 30 days\nthen $100/mo",
    back: [MEAL, PLATE, MEAL, WALK, PORTRAIT],
  },

  // ------------------------------------------------------------------ cardio
  {
    ...base, id: "MfbC1", slug: "c1-walk", topic: "Bible",
    hook: ["The cheapest", "fat loss", "you'll ever do."], hookHot: "cheapest",
    quote: "Five laps of the block. Every day. That's it.",
    cite: "The whole cardio plan",
    benefits: [["No gym.", "No equipment.", "No excuse."], ["Twenty", "minutes."]],
    benefitHot: ["excuse", "Twenty"],
    cta: "Free 30 days\nthen $100/mo",
    back: [WALK, WALK, WALK, GYM, PORTRAIT],
  },
  {
    ...base, id: "MfbC2", slug: "c2-scenic", topic: "Bible",
    hook: ["You quit", "because it", "got boring."], hookHot: "boring",
    quote: "Change the route when you get bored. That's what buys another month.",
    cite: "Why mine survived",
    benefits: [["Somewhere", "scenic."], ["Boredom kills", "more plans", "than soreness."]],
    benefitHot: ["scenic", "Boredom"],
    cta: "Free 30 days\nthen $100/mo",
    back: [WALK, WALK, WALK, WALK, PORTRAIT],
  },
  {
    ...base, id: "MfbC3", slug: "c3-not-instead", topic: "Bible",
    hook: ["Cardio", "replaced your", "lifting."], hookHot: "replaced",
    quote: "Cardio burns it. Lifting is what keeps the shape underneath.",
    cite: "Why the scale lies",
    benefits: [["Do both.", "Never swap", "one for the other."], ["Walk on the", "days you", "don't lift."]],
    benefitHot: ["both", "Walk"],
    cta: "Free 30 days\nthen $100/mo",
    back: [C("edit/pre_c.mp4", 1200), WALK, C("edit/pre_b.mp4", 400), GYM, PORTRAIT],
  },
  {
    ...base, id: "MfbC4", slug: "c4-rest", topic: "Bible",
    hook: ["Never on", "the day you", "trained legs."], hookHot: "Never",
    quote: "Run twice a week. Never the day after legs. Rest is part of it.",
    cite: "What I actually do",
    benefits: [["Recovery isn't", "lazy."], ["It's where the", "work turns", "into muscle."]],
    benefitHot: ["lazy", "muscle"],
    cta: "Free 30 days\nthen $100/mo",
    back: [WALK, C("edit/pre_e.mp4", 300), WALK, GYM, PORTRAIT],
  },

  // ----------------------------------------------------------------- mindset
  {
    ...base, id: "MfbM1", slug: "x1-never-twice", topic: "Mass",
    hook: ["Missing one", "isn't the", "problem."], hookHot: "one",
    quote: "One missed session is a bad week. Two is a new habit.",
    cite: "The only rule that matters",
    benefits: [["Never miss", "twice."], ["That's the", "whole", "discipline."]],
    benefitHot: ["twice", "whole"],
    cta: "Free 30 days\nthen $100/mo",
    back: [GYM, C("edit/pre_e.mp4", 600), C("edit/pre_c.mp4", 600), WALK, PORTRAIT],
  },
  {
    ...base, id: "MfbM2", slug: "x2-twelve", topic: "Mass",
    hook: ["Twelve", "sessions.", "Four missed."], hookHot: "Twelve",
    quote: "Twelve sessions in a month is a good month. Nobody gets a clean sheet.",
    cite: "What a real month looks like",
    benefits: [["Judge the", "month. Not", "the day."], ["Perfect weeks", "aren't the", "point."]],
    benefitHot: ["month", "aren't"],
    cta: "Free 30 days\nthen $100/mo",
    back: [C("edit/pre_b.mp4", 800), GYM, C("edit/pre_c.mp4", 1800), WALK, PORTRAIT],
  },
  {
    ...base, id: "MfbM3", slug: "x3-motivation", topic: "Mass",
    hook: ["Motivation", "runs out.", "The plan doesn't."], hookHot: "plan",
    quote: "Decide the days on Sunday, so you're not deciding them daily.",
    cite: "How it survives",
    benefits: [["Make it", "boring."], ["Boring is", "what you", "can repeat."]],
    benefitHot: ["boring", "repeat"],
    cta: "Free 30 days\nthen $100/mo",
    back: [C("edit/pre_e.mp4", 800), GYM, WALK, C("edit/pre_b.mp4", 1800), PORTRAIT],
  },
  {
    ...base, id: "MfbM4", slug: "x4-flat-line", topic: "Mass",
    hook: ["Five weeks.", "Nothing", "moved."], hookHot: "Nothing",
    quote: "Sixteen weeks, eight kilos, and five of those weeks showed nothing.",
    cite: "My own weigh-ins",
    benefits: [["The flat bit", "is where", "people quit."], ["It's also", "where it", "was working."]],
    benefitHot: ["quit", "working"],
    cta: "Free 30 days\nthen $100/mo",
    back: [GYM, C("edit/pre_c.mp4", 1000), WALK, C("edit/pre_e.mp4", 400), PORTRAIT],
  },

  // ------------------------------------------------------------------- start
  {
    ...base, id: "MfbS1", slug: "s1-55kg", topic: "Fellowship",
    hook: ["I lost 55", "kilos.", "The boring way."], hookHot: "55",
    quote: "No challenge, no shake. The same few meals and three nights a week.",
    cite: "How it actually went",
    benefits: [["I've been the", "one starting", "over."], ["That's who", "I coach."]],
    benefitHot: ["over", "coach"],
    cta: "Free 30 days\nthen $100/mo",
    back: [PORTRAIT, GYM, C("edit/pre_b.mp4", 200), WALK, PORTRAIT],
  },
  {
    ...base, id: "MfbS2", slug: "s2-first-month", topic: "Fellowship",
    hook: ["You don't need", "a perfect plan.", "Four weeks."], hookHot: "Four",
    quote: "Three sessions, eight movements, protein at every meal, walk the rest.",
    cite: "Month one, all of it",
    benefits: [["Nobody quits", "because the", "plan was wrong."], ["They quit", "because it", "was too much."]],
    benefitHot: ["wrong", "much"],
    cta: "Free 30 days\nthen $100/mo",
    back: [GYM, C("edit/pre_e.mp4", 100), C("edit/pre_c.mp4", 100), WALK, PORTRAIT],
  },
  {
    ...base, id: "MfbS3", slug: "s3-built-for-you", topic: "Fellowship",
    hook: ["Not a PDF", "you download", "once."], hookHot: "PDF",
    quote: "A program around your equipment, your days, and your injuries.",
    cite: "What you actually get",
    benefits: [["Weekly", "check-ins."], ["Message me", "when the week", "falls apart."]],
    benefitHot: ["check-ins", "apart"],
    cta: "Free 30 days\nthen $100/mo",
    back: [PORTRAIT, GYM, MEAL, C("edit/pre_b.mp4", 1000), PORTRAIT],
  },
  {
    ...base, id: "MfbS4", slug: "s4-free-month", topic: "Fellowship",
    hook: ["Try it a month", "before you pay", "anything."], hookHot: "anything",
    quote: "Cancel before the 30 days are up and you've paid nothing at all.",
    cite: "No lock-in, no sign-up fee",
    benefits: [["If it's not", "for you,", "walk away."], ["If it is,", "it's $100", "a month."]],
    benefitHot: ["walk", "$100"],
    cta: "Free 30 days\nthen $100/mo",
    back: [PORTRAIT, GYM, C("edit/pre_c.mp4", 200), MEAL, PORTRAIT],
  },
];
