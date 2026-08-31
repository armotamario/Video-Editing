export type Slide = {
  /** Filename inside public/images/. */
  src: string;
  /** CSS object-position — biases the full-bleed crop toward the important content. */
  focus?: string;
  label: string;
  caption: string;
  kicker: string;
};

export const BRAND_NAME = "GODLY RAIMENT";
export const BRAND_URL = "GODLYRAIMENT.COM.AU";
export const TAGLINE = "Wear Your Faith";

export const slides: Slide[] = [
  {
    src: "homepage.jpg",
    focus: "center 55%",
    label: "Homepage hero",
    kicker: "Introducing",
    caption: "Faith-Driven Streetwear",
  },
  {
    src: "collection.jpg",
    focus: "40% center",
    label: "Store — Godly Raiment Hat",
    kicker: "The Collection",
    caption: "The Godly Raiment Hat",
  },
  {
    src: "colorways.jpg",
    label: "Colorways — Black & Camo",
    kicker: "Crafted With Purpose",
    caption: "Timeless Fit. Built To Last.",
  },
];
