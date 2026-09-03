import { bodyFont, headlineFont, serifFont } from "../fonts";

export type SiteRow = { title: string; note: string; price: string };

export type Site = {
  key: string;
  name: string;
  nav: string[];
  heroKicker: string;
  heroTitle: string[];
  heroSub: string;
  cta: string;
  ctaGhost: string;
  chips: string[];
  sectionKicker: string;
  sectionTitle: string;
  rows: SiteRow[];
  footNote: string;
  bg: string;
  panel: string;
  ink: string;
  inkSoft: string;
  accent: string;
  onAccent: string;
  line: string;
  headingFont: string;
  bodyFont: string;
  headingTracking: string;
};

/**
 * Three fictional local businesses, each with its own palette and type pairing,
 * so a site mock never reads as the same template twice. Rendered natively at a
 * nominal 1200px width and scaled into whatever frame holds it.
 */
export const SITES: Record<string, Site> = {
  barber: {
    key: "barber",
    name: "STEEL & COMB",
    nav: ["Services", "The Shop", "Prices", "Book"],
    heroKicker: "BARBERSHOP · MILLS PARK",
    heroTitle: ["Sharp cuts.", "No rush."],
    heroSub:
      "Fades, beard work and classic cuts from a chair that's yours for the full half hour.",
    cta: "Book a chair",
    ctaGhost: "See prices",
    chips: ["Walk-ins welcome", "Open seven days", "Since 2016"],
    sectionKicker: "THE SERVICES",
    sectionTitle: "Whatever you're after.",
    rows: [
      { title: "Skin fade", note: "Clippers, scissor finish, hot towel.", price: "$45" },
      { title: "Beard sculpt", note: "Shaped to your jaw, lined and oiled.", price: "$35" },
      { title: "Classic cut", note: "The one you've had since you were ten.", price: "$40" },
    ],
    footNote: "Shop 4, 212 High St · Mills Park VIC",
    bg: "#12100e",
    panel: "#1b1815",
    ink: "#f6f2ea",
    inkSoft: "#9a9086",
    accent: "#e0a534",
    onAccent: "#12100e",
    line: "#2a2622",
    headingFont: headlineFont,
    bodyFont,
    headingTracking: "0.02em",
  },
  cafe: {
    key: "cafe",
    name: "Caro & Co.",
    nav: ["Menu", "Beans", "Catering", "Find us"],
    heroKicker: "ESPRESSO BAR · BRUNSWICK",
    heroTitle: ["Coffee worth", "the walk."],
    heroSub:
      "Single origin roasted up the road, poured by people who actually know your order.",
    cta: "See the menu",
    ctaGhost: "Order ahead",
    chips: ["Roasted weekly", "All-day kitchen", "Dog friendly"],
    sectionKicker: "THE MENU",
    sectionTitle: "Made every morning.",
    rows: [
      { title: "Filter of the day", note: "Rotating single origin, brewed by batch.", price: "$5" },
      { title: "Big breakfast", note: "Eggs your way, house beans, sourdough.", price: "$24" },
      { title: "Retail beans", note: "250g bag, roasted the same week.", price: "$22" },
    ],
    footNote: "88 Sydney Rd · Brunswick VIC",
    bg: "#f7f2e8",
    panel: "#ede5d6",
    ink: "#1d1a15",
    inkSoft: "#6d6559",
    accent: "#4f6b3f",
    onAccent: "#f7f2e8",
    line: "#ded4c2",
    headingFont: serifFont,
    bodyFont,
    headingTracking: "-0.02em",
  },
  trade: {
    key: "trade",
    name: "NORTHSIDE PLUMBING",
    nav: ["Services", "Emergency", "Areas", "Quote"],
    heroKicker: "LICENSED PLUMBERS · 24/7",
    heroTitle: ["Blocked drain?", "We're 20 min away."],
    heroSub:
      "Same-day callouts across the northern suburbs, with the price agreed before we start.",
    cta: "Get a quote",
    ctaGhost: "Call now",
    chips: ["Fixed pricing", "Licensed & insured", "7-day service"],
    sectionKicker: "WHAT WE DO",
    sectionTitle: "The usual suspects.",
    rows: [
      { title: "Blocked drains", note: "Camera inspection and jet clear.", price: "from $180" },
      { title: "Hot water", note: "Repairs and same-day replacements.", price: "from $260" },
      { title: "Burst pipes", note: "Emergency isolation and repair.", price: "24/7" },
    ],
    footNote: "Servicing Preston, Reservoir & Coburg",
    bg: "#0e1622",
    panel: "#16202e",
    ink: "#eef3f9",
    inkSoft: "#8697aa",
    accent: "#f2a33c",
    onAccent: "#0e1622",
    line: "#22303f",
    headingFont: headlineFont,
    bodyFont,
    headingTracking: "0.02em",
  },
};
