export type Slide = {
  /** Filename inside public/images/. */
  src: string;
  /** "contain" letterboxes the (landscape) screenshot on a blurred backdrop so nothing is
   * cropped off. "cover" fills the frame edge-to-edge — use for images already shot portrait. */
  fit: "contain" | "cover";
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
    fit: "contain",
    label: "Homepage hero",
    kicker: "Introducing",
    caption: "Faith-Driven Streetwear",
  },
  {
    src: "collection.jpg",
    fit: "contain",
    label: "Store — Godly Raiment Hat",
    kicker: "The Collection",
    caption: "The Godly Raiment Hat",
  },
  {
    src: "colorways.jpg",
    fit: "cover",
    label: "Colorways — Black & Camo",
    kicker: "Crafted With Purpose",
    caption: "Timeless Fit. Built To Last.",
  },
];
