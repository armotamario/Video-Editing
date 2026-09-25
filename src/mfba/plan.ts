/**
 * Mario's own training and nutrition protocol for MFBA — the source numbers
 * for reel/kit scripts (mfbaMonth.ts, BrollReels.tsx, etc). Given by him
 * directly; not a general program, don't generalize it to other people.
 */

export const WORKOUT = [
  { move: "Weighted Lunges", load: "15kg" },
  { move: "Dumbbell Rows", load: "22.5kg" },
  { move: "Weighted Crunches", load: "25kg" },
  { move: "Barbell Bicep Curls", load: "30kg" },
  { move: "Weighted Push-Ups", load: "bag" },
  { move: "Dumbbell Shoulder Presses", load: "12.5kg/25kg" },
  { move: "Dumbbell Romanian Deadlifts", load: "12.5kg" },
  { move: "Russian Twists", load: "bag/10kg" },
] as const;

export const EVERYDAY = [
  { move: "Push-ups", reps: 50 },
  { move: "Lunges", reps: 25 },
  { move: "Dips", reps: 50 },
] as const;

/** Fallback on a day he can't run the full session. */
export const IF_CANT_BE_BOTHERED = "Freestyle and lift heavy.";

export const CARDIO = "1 hour a day";

export const STRETCHING = [
  { area: "Ankles/calves", duration: "1 min", move: "Calf raises" },
  { area: "Back", duration: "2 min", move: "Knee to chest" },
  { area: "Glutes", duration: "2 min", move: "Chair exercise" },
  { area: "Quads", duration: "2 min", move: "Leg behind back" },
] as const;

export const DIET = {
  philosophy: "Eat together with friends/family while talking, joking, or watching something you all enjoy.",
  dailyCalories: 1534,
  dailyProteinG: 170,
  dailyCarbsG: 170,
  intensity: "Intense training every day.",
  cardio: "1 hour cardio a day.",
  protein: {
    dailyG: 200,
    source: "220g chicken breast x3 a day — 6kg of chicken",
  },
  carbs: {
    dailyG: 200,
    source: "1 cup steamed rice x4 — 4kg of jasmine rice",
  },
  lowCalorie: "Cucumber",
  fibre: "10g — chia seeds + lots of water",
  whenOut: "Something healthy when out",
  coffee: {
    timesPerDay: 3,
    recipe: "Cappuccino, extra foam, 1/4 cup milk, fill rest with hot water, cold water at the end to cool it",
  },
  softDrink: "Coke Zero, no caffeine box",
  vaseline: "x2 a day",
} as const;

/** Take supplements with food, when hungry. */
export const SUPPLEMENTS = [
  { name: "L-Theanine", when: "1x, morning" },
  { name: "Vitamin B1 & B2", when: "1 tablet, morning with breakfast" },
  { name: "Memory + focus", when: "morning and afternoon" },
  { name: "Vitamin D", when: "1-2 capsules, afternoon with food" },
  { name: "Vitamin C", when: "2 tablets, afternoon" },
  { name: "Ashwagandha", when: "1 capsule, evening with or after dinner" },
  { name: "Magnesium Glycinate", when: "1-2 tablets, evening, 30-60 min before bed" },
] as const;

export const LIFESTYLE = ["No alcohol", "No smoking", "No drugs", "No partying"] as const;
