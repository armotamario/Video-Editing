export type Slide = {
  /** Filename inside public/images/ — drop the real screenshot in with this name. */
  src: string;
  /** Flip to true once the matching file above actually exists in public/images/. */
  hasImage: boolean;
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
    hasImage: false,
    label: "Homepage hero shot",
    kicker: "Introducing",
    caption: "Faith-Driven Streetwear",
  },
  {
    src: "collection.jpg",
    hasImage: false,
    label: "Collection / shop grid",
    kicker: "The Collection",
    caption: "New Drop Just Landed",
  },
  {
    src: "product-detail.jpg",
    hasImage: false,
    label: "Product detail page",
    kicker: "Crafted With Purpose",
    caption: "Premium Quality, Built to Last",
  },
  {
    src: "lifestyle.jpg",
    hasImage: false,
    label: "Lifestyle / on-body photo",
    kicker: "Join The Movement",
    caption: "Wear Your Faith",
  },
];
