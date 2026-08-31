import { getInputProps } from "remotion";

/**
 * Three backdrop directions, selectable at render time:
 *   npx remotion render GodlyRaimentPromo out.mp4 --props='{"theme":"espresso"}'
 *
 * GOLD is drawn from the cap's own embroidery gold (sampled at ~#a58556): kept
 * bright on the dark palettes where it needs to glow, and deepened on the bone
 * palette where the literal thread colour is too light to hold contrast.
 */
export type Palette = {
  PAGE_BG: string;
  INK: string;
  INK_SOFT: string;
  GOLD: string;
  CREAM: string;
  MARQUEE_INK: string;
  /** Light frames need a solid CTA to stay the strongest element; dark frames read better outlined. */
  CTA_FILLED: boolean;
};

export const THEMES: Record<string, Palette> = {
  graphite: {
    PAGE_BG: "radial-gradient(ellipse 120% 75% at 50% 42%, #2e2721 0%, #16130f 55%, #0b0a09 100%)",
    INK: "#ffffff",
    INK_SOFT: "#a3a3a3",
    GOLD: "#fbbf24",
    CREAM: "#faf7f1",
    MARQUEE_INK: "#d4d4d4",
    CTA_FILLED: false,
  },
  espresso: {
    PAGE_BG: "radial-gradient(ellipse 120% 75% at 50% 42%, #3d2e1f 0%, #1b120c 55%, #0c0908 100%)",
    INK: "#f7f1e6",
    INK_SOFT: "#b0a08b",
    GOLD: "#e8b45c",
    CREAM: "#faf7f1",
    MARQUEE_INK: "#cbbfae",
    CTA_FILLED: false,
  },
  bone: {
    PAGE_BG: "radial-gradient(ellipse 120% 75% at 50% 42%, #faf7f1 0%, #f1eade 55%, #e3dac9 100%)",
    INK: "#16130f",
    INK_SOFT: "#6f665a",
    GOLD: "#8a6a33",
    CREAM: "#faf7f1",
    MARQUEE_INK: "#c9beab",
    CTA_FILLED: true,
  },
};

const requested = (getInputProps() as { theme?: string }).theme;
const palette = THEMES[requested ?? ""] ?? THEMES.bone;

export const { PAGE_BG, INK, INK_SOFT, GOLD, CREAM, MARQUEE_INK, CTA_FILLED } = palette;
