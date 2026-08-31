export type Slide = {
  /** Filename inside public/images/. */
  src: string;
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
    label: "Homepage hero",
    kicker: "Introducing",
    caption: "Faith-Driven Streetwear",
  },
  {
    src: "collection.jpg",
    label: "Store — Godly Raiment Hat",
    kicker: "The Collection",
    caption: "The Godly Raiment Hat",
  },
  {
    src: "hat.jpg",
    label: "Godly Raiment Hat — product shot",
    kicker: "Crafted With Purpose",
    caption: "Timeless Fit. Built To Last.",
  },
];
