/**
 * September's Godly Raiment schedule: twenty posts across five topics, each
 * built on the same shape — hook, proof, benefits, call to action.
 *
 * Scripture and the canon and Catechism references are quoted short and were
 * written without web access. Check them before posting.
 */

export type Spec = {
  id: string;
  slug: string;
  topic: "Products" | "Prayer" | "Bible" | "Mass" | "Fellowship";
  hook: string[];
  hookHot: string;
  quote: string;
  cite: string;
  benefits: [string[], string[]];
  benefitHot: [string, string];
  cta: string;
  /** Godly Raiment's gold unless a brand overrides it. */
  accent?: string;
  sub?: string;
  back: {
    kind: "plate" | "float" | "clip";
    src: string;
    focus?: string;
    dim?: number;
    startFrom?: number;
  }[];
};

const P = (src: string, focus = "center 32%", dim = 0.5) =>
  ({ kind: "plate", src, focus, dim }) as const;
const F = (src: string) => ({ kind: "float", src }) as const;

const PORTRAIT = P("photos/portrait.jpg", "center 24%", 0.52);
const WALK = P("photos/walk.jpg", "center 45%", 0.5);
const DESK = P("photos/desk.jpg", "center 45%", 0.55);
const MEAL = P("photos/meal.jpg", "center 50%", 0.55);
const PLATE = P("photos/plate.jpg", "center 45%", 0.55);
const GYM = P("photos/gym.jpg", "center 35%", 0.55);

export const MONTH: Spec[] = [
  // ---------------------------------------------------------------- products
  {
    id: "SepP1", slug: "p1-treasure", topic: "Products",
    hook: ["Everyone can tell", "what you", "worship."], hookHot: "worship",
    quote: "Where your treasure is, there your heart will be also.",
    cite: "Matthew 6:21",
    benefits: [["It starts", "conversations."], ["It reminds", "you first."]],
    benefitHot: ["conversations", "you"],
    cta: "Wear what\nyou believe",
    back: [PORTRAIT, WALK, F("store/charcoal.png"), F("store/stone.png"), PORTRAIT],
  },
  {
    id: "SepP2", slug: "p2-mustard", topic: "Products",
    hook: ["A cap is", "a small", "thing."], hookHot: "small",
    quote: "The kingdom of heaven is like a mustard seed, the smallest of all the seeds.",
    cite: "Matthew 13:31–32",
    benefits: [["So was", "the seed."], ["Small things", "start things."]],
    benefitHot: ["seed", "start"],
    cta: "Godly Raiment\n$28.99",
    back: [F("store/stone.png"), WALK, F("store/black.png"), F("store/charcoal.png"), PORTRAIT],
  },
  {
    id: "SepP3", slug: "p3-put-on", topic: "Products",
    hook: ["You'll wear", "a brand that", "means nothing."], hookHot: "nothing",
    quote: "Put on the Lord Jesus Christ.",
    cite: "Romans 13:14",
    benefits: [["Wear one", "that means", "something."], ["Every day.", "On purpose."]],
    benefitHot: ["something", "purpose"],
    cta: "Wear what\nyou believe",
    back: [PORTRAIT, DESK, F("store/black.png"), F("store/stone.png"), PORTRAIT],
  },
  {
    id: "SepP4", slug: "p4-glory", topic: "Products",
    hook: ["Three colours.", "One cross.", "Out now."], hookHot: "cross",
    quote: "Whatever you do, do everything for the glory of God.",
    cite: "1 Corinthians 10:31",
    benefits: [["Black,", "charcoal,", "stone."], ["$28.99.", "Ships from", "Melbourne."]],
    benefitHot: ["stone", "Melbourne"],
    cta: "Shop the drop",
    back: [F("store/black.png"), WALK, F("store/charcoal.png"), F("store/stone.png"), PORTRAIT],
  },

  // ------------------------------------------------------------------ prayer
  {
    id: "SepR1", slug: "r1-five", topic: "Prayer",
    hook: ["You'll scroll", "for an hour.", "Give Him five."], hookHot: "five",
    quote: "Pray without ceasing.",
    cite: "1 Thessalonians 5:17",
    benefits: [["Start with", "one minute."], ["Before the", "phone. Not", "after."]],
    benefitHot: ["one", "Before"],
    cta: "Have you\nprayed today?",
    back: [DESK, PORTRAIT, WALK, DESK, PORTRAIT],
  },
  {
    id: "SepR2", slug: "r2-only-when", topic: "Prayer",
    hook: ["You only pray", "when it", "goes wrong."], hookHot: "wrong",
    quote: "Do not worry about anything, but in everything by prayer let your requests be made known to God.",
    cite: "Philippians 4:6",
    benefits: [["Ask on", "the good", "days too."], ["That's when", "it becomes", "a habit."]],
    benefitHot: ["good", "habit"],
    cta: "Have you\nprayed today?",
    back: [PORTRAIT, WALK, GYM, PORTRAIT, PORTRAIT],
  },
  {
    id: "SepR3", slug: "r3-no-words", topic: "Prayer",
    hook: ["You don't", "know what", "to say."], hookHot: "say",
    quote: "The Spirit helps us in our weakness, for we do not know how to pray as we ought.",
    cite: "Romans 8:26",
    benefits: [["Use your", "own words."], ["Badly is", "still", "praying."]],
    benefitHot: ["own", "still"],
    cta: "Say it\nbadly. Tonight.",
    back: [WALK, PORTRAIT, DESK, WALK, PORTRAIT],
  },
  {
    id: "SepR4", slug: "r4-morning", topic: "Prayer",
    hook: ["Same time.", "Every day.", "That's it."], hookHot: "Same",
    quote: "In the morning I plead my case to you, and watch.",
    cite: "Psalm 5:3",
    benefits: [["A habit holds", "when the", "feeling doesn't."], ["Pick the time", "before you", "need it."]],
    benefitHot: ["holds", "before"],
    cta: "Same time\ntomorrow",
    back: [DESK, WALK, PORTRAIT, DESK, PORTRAIT],
  },

  // ------------------------------------------------------------------- bible
  {
    id: "SepB1", slug: "b1-jerome", topic: "Bible",
    hook: ["You finished", "the feed.", "Not the Gospel."], hookHot: "Gospel",
    quote: "Ignorance of Scripture is ignorance of Christ.",
    cite: "St Jerome",
    benefits: [["One of them", "matters in", "a hundred years."], ["It isn't", "the feed."]],
    benefitHot: ["matters", "isn't"],
    cta: "Ten minutes\ntonight",
    back: [DESK, PORTRAIT, WALK, DESK, PORTRAIT],
  },
  {
    id: "SepB2", slug: "b2-mark", topic: "Bible",
    hook: ["Start with", "Mark.", "Sixteen chapters."], hookHot: "Mark",
    quote: "All scripture is inspired by God and is useful for teaching.",
    cite: "2 Timothy 3:16",
    benefits: [["Shortest", "Gospel.", "Fastest start."], ["One chapter", "a day.", "Sixteen days."]],
    benefitHot: ["Shortest", "One"],
    cta: "Start Mark\ntonight",
    back: [PORTRAIT, DESK, WALK, DESK, PORTRAIT],
  },
  {
    id: "SepB3", slug: "b3-lamp", topic: "Bible",
    hook: ["Ten minutes.", "Before the", "phone."], hookHot: "Before",
    quote: "Your word is a lamp to my feet and a light to my path.",
    cite: "Psalm 119:105",
    benefits: [["Read it", "out loud."], ["Write the", "one line", "that stopped you."]],
    benefitHot: ["loud", "one"],
    cta: "Which Gospel\nare you starting?",
    back: [WALK, PORTRAIT, DESK, WALK, PORTRAIT],
  },
  {
    id: "SepB4", slug: "b4-not-alone", topic: "Bible",
    hook: ["You read it", "wrong the", "first time."], hookHot: "wrong",
    quote: "No prophecy of scripture is a matter of one's own interpretation.",
    cite: "2 Peter 1:20",
    benefits: [["It was never", "meant to be", "read alone."], ["Read it with", "the Church", "that wrote it."]],
    benefitHot: ["alone", "Church"],
    cta: "Ten minutes\ntonight",
    back: [DESK, PORTRAIT, WALK, PORTRAIT, PORTRAIT],
  },

  // -------------------------------------------------------------------- mass
  {
    id: "SepM1", slug: "m1-one-hour", topic: "Mass",
    hook: ["One hour.", "Once a week.", "That's the ask."], hookHot: "One",
    quote: "On Sundays the faithful are bound to participate in the Mass.",
    cite: "Code of Canon Law, c. 1247",
    benefits: [["168 hours", "in a week."], ["You can find", "one of them."]],
    benefitHot: ["168", "one"],
    cta: "See you\nSunday",
    back: [PORTRAIT, WALK, DESK, PORTRAIT, PORTRAIT],
  },
  {
    id: "SepM2", slug: "m2-summit", topic: "Mass",
    hook: ["Nothing else", "comes", "close."], hookHot: "close",
    quote: "The Eucharist is the source and summit of the Christian life.",
    cite: "Catechism 1324",
    benefits: [["Not a talk.", "Not a", "concert."], ["The thing", "itself."]],
    benefitHot: ["Not", "thing"],
    cta: "See you\nSunday",
    back: [PORTRAIT, GYM, WALK, PORTRAIT, PORTRAIT],
  },
  {
    id: "SepM3", slug: "m3-dont-know", topic: "Mass",
    hook: ["You don't", "know when", "to stand."], hookHot: "stand",
    quote: "Come to me, all you that are weary and are carrying heavy burdens.",
    cite: "Matthew 11:28",
    benefits: [["Sit at", "the back.", "Copy the room."], ["Nobody is", "marking you."]],
    benefitHot: ["back", "Nobody"],
    cta: "Come as\nyou are",
    back: [WALK, PORTRAIT, DESK, WALK, PORTRAIT],
  },
  {
    id: "SepM4", slug: "m4-vigil", topic: "Mass",
    hook: ["Slept through", "Sunday", "again."], hookHot: "again",
    quote: "The obligation is satisfied by assistance at a Mass on the evening of the preceding day.",
    cite: "Code of Canon Law, c. 1248 §1",
    benefits: [["Saturday", "vigil", "counts."], ["No excuse", "left."]],
    benefitHot: ["counts", "No"],
    cta: "Saturday\nworks too",
    back: [PORTRAIT, WALK, PORTRAIT, DESK, PORTRAIT],
  },

  // -------------------------------------------------------------- fellowship
  {
    id: "SepF1", slug: "f1-together", topic: "Fellowship",
    hook: ["You can't", "do this", "alone."], hookHot: "alone",
    quote: "Let us consider how to provoke one another to love and good deeds, not neglecting to meet together.",
    cite: "Hebrews 10:24–25",
    benefits: [["Nobody keeps", "a faith", "in private."], ["It dies", "quietly."]],
    benefitHot: ["private", "dies"],
    cta: "Bring\none person",
    back: [MEAL, PORTRAIT, WALK, PLATE, PORTRAIT],
  },
  {
    id: "SepF2", slug: "f2-company", topic: "Fellowship",
    hook: ["Your friends", "decide who", "you become."], hookHot: "become",
    quote: "Whoever walks with the wise becomes wise, but the companion of fools suffers harm.",
    cite: "Proverbs 13:20",
    benefits: [["Look at your", "five closest", "mates."], ["That's your", "next five", "years."]],
    benefitHot: ["five", "years"],
    cta: "Pick better\ncompany",
    back: [MEAL, PORTRAIT, GYM, PLATE, PORTRAIT],
  },
  {
    id: "SepF3", slug: "f3-two-or-three", topic: "Fellowship",
    hook: ["You don't", "need a", "crowd."], hookHot: "crowd",
    quote: "Where two or three are gathered in my name, I am there among them.",
    cite: "Matthew 18:20",
    benefits: [["Two is", "enough."], ["Start with", "the one", "who'd say yes."]],
    benefitHot: ["Two", "one"],
    cta: "Text them\ntoday",
    back: [PLATE, PORTRAIT, MEAL, WALK, PORTRAIT],
  },
  {
    id: "SepF4", slug: "f4-lift", topic: "Fellowship",
    hook: ["Everyone falls.", "Not everyone", "gets up."], hookHot: "up",
    quote: "Two are better than one. If they fall, one will lift up the other.",
    cite: "Ecclesiastes 4:9–10",
    benefits: [["Have someone", "who notices", "you're gone."], ["Be that", "for someone", "else."]],
    benefitHot: ["notices", "Be"],
    cta: "Be the one\nwho notices",
    back: [MEAL, PORTRAIT, PLATE, WALK, PORTRAIT],
  },
];
