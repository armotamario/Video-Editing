/**
 * Per-film colour themes.
 *
 * Every kit paints from CSS custom properties, so a film only names a palette
 * and the whole frame follows — background, ink, accent, rules and surfaces.
 * Each brand keeps its own identity (warm metal for Mario Armota, gold and
 * serif for Godly Raiment, orange for MFBA); what changes between videos is the
 * ground they sit on, so a profile grid never looks like eleven copies of the
 * same card.
 */
export type Palette = {
  pageBg: string;
  ink: string;
  inkSoft: string;
  accent: string;
  accentSoft: string;
  accentLine: string;
  onAccent: string;
  line: string;
  surface: string;
  muted: string;
};

const radial = (inner: string, mid: string, outer: string) =>
  `radial-gradient(ellipse 120% 75% at 50% 40%, ${inner} 0%, ${mid} 55%, ${outer} 100%)`;

export const PALETTES: Record<string, Palette> = {
  // --- Mario Armota: near-black grounds under one warm metal ---
  graphite: {
    pageBg: radial("#1c1a17", "#100e0c", "#080706"),
    ink: "#f5f1ea",
    inkSoft: "#8d8579",
    accent: "#d0a45f",
    accentSoft: "#d0a45f66",
    accentLine: "#d0a45f3d",
    onAccent: "#100e0c",
    line: "#2a2622",
    surface: "#1b1815",
    muted: "#6a635b",
  },
  midnight: {
    pageBg: radial("#151d2a", "#0b1119", "#05080d"),
    ink: "#eef2f7",
    inkSoft: "#8794a5",
    accent: "#cba15c",
    accentSoft: "#cba15c66",
    accentLine: "#cba15c3d",
    onAccent: "#05080d",
    line: "#232c3a",
    surface: "#161e2b",
    muted: "#65717f",
  },
  bone: {
    pageBg: radial("#faf7f1", "#f1eade", "#e3dac9"),
    ink: "#17140f",
    inkSoft: "#6f665a",
    accent: "#8a6a33",
    accentSoft: "#8a6a3366",
    accentLine: "#8a6a333d",
    onAccent: "#faf7f1",
    line: "#d9cfbc",
    surface: "#efe8db",
    muted: "#9a9184",
  },
  espresso: {
    pageBg: radial("#291d13", "#150e08", "#0a0604"),
    ink: "#f7efe3",
    inkSoft: "#a08d76",
    accent: "#e0a534",
    accentSoft: "#e0a53466",
    accentLine: "#e0a5343d",
    onAccent: "#150e08",
    line: "#3a2b1d",
    surface: "#241a11",
    muted: "#7c6b56",
  },
  forest: {
    pageBg: radial("#15211b", "#0c130f", "#060a08"),
    ink: "#eef5f0",
    inkSoft: "#86988d",
    accent: "#c9a35e",
    accentSoft: "#c9a35e66",
    accentLine: "#c9a35e3d",
    onAccent: "#060a08",
    line: "#26332c",
    surface: "#17241d",
    muted: "#63736a",
  },
  plum: {
    pageBg: radial("#211527", "#120a15", "#08050a"),
    ink: "#f4eef6",
    inkSoft: "#9b8aa1",
    accent: "#d8a37a",
    accentSoft: "#d8a37a66",
    accentLine: "#d8a37a3d",
    onAccent: "#08050a",
    line: "#302339",
    surface: "#221629",
    muted: "#75677c",
  },
  slate: {
    pageBg: radial("#191d21", "#0e1113", "#07090a"),
    ink: "#eef1f4",
    inkSoft: "#8b939b",
    accent: "#cfa768",
    accentSoft: "#cfa76866",
    accentLine: "#cfa7683d",
    onAccent: "#07090a",
    line: "#262c31",
    surface: "#1a1f23",
    muted: "#697178",
  },
  sand: {
    pageBg: radial("#f5efe3", "#eae0cf", "#dbcfb7"),
    ink: "#1b1710",
    inkSoft: "#6c6152",
    accent: "#9a6b2f",
    accentSoft: "#9a6b2f66",
    accentLine: "#9a6b2f3d",
    onAccent: "#f5efe3",
    line: "#d3c5ab",
    surface: "#ece2d0",
    muted: "#978c79",
  },
  oxblood: {
    pageBg: radial("#241211", "#130807", "#080404"),
    ink: "#f6ece9",
    inkSoft: "#a3897f",
    accent: "#d8a24f",
    accentSoft: "#d8a24f66",
    accentLine: "#d8a24f3d",
    onAccent: "#080404",
    line: "#3a1e1c",
    surface: "#251312",
    muted: "#7d675f",
  },
  teal: {
    pageBg: radial("#0f2024", "#081215", "#04090a"),
    ink: "#e9f4f5",
    inkSoft: "#7f9698",
    accent: "#cfa961",
    accentSoft: "#cfa96166",
    accentLine: "#cfa9613d",
    onAccent: "#04090a",
    line: "#1c3136",
    surface: "#102227",
    muted: "#5e7376",
  },
  indigo: {
    pageBg: radial("#12172b", "#0a0d18", "#05060d"),
    ink: "#eceef8",
    inkSoft: "#868da8",
    accent: "#d2ad63",
    accentSoft: "#d2ad6366",
    accentLine: "#d2ad633d",
    onAccent: "#05060d",
    line: "#222842",
    surface: "#141a2e",
    muted: "#666d85",
  },

  // --- Godly Raiment: paper and ink, one gold ---
  vellum: {
    pageBg: radial("#eff2e9", "#e5e9da", "#d5dbc7"),
    ink: "#14180f",
    inkSoft: "#616a57",
    accent: "#7a6a2f",
    accentSoft: "#7a6a2f66",
    accentLine: "#7a6a2f3d",
    onAccent: "#eff2e9",
    line: "#cdd4bd",
    surface: "#e7ecdc",
    muted: "#8d947f",
  },

  // --- MFBA: orange, on grounds that change with the episode ---
  mfbaGraphite: {
    pageBg: radial("#262320", "#141210", "#0a0908"),
    ink: "#ffffff",
    inkSoft: "#9b9188",
    accent: "#ff6a1f",
    accentSoft: "#ff6a1f66",
    accentLine: "#ff6a1f3d",
    onAccent: "#141210",
    line: "#2b2723",
    surface: "#1b1815",
    muted: "#6a635b",
  },
  mfbaMidnight: {
    pageBg: radial("#141d29", "#0a1017", "#05080d"),
    ink: "#f2f6fb",
    inkSoft: "#8593a4",
    accent: "#ff7a2f",
    accentSoft: "#ff7a2f66",
    accentLine: "#ff7a2f3d",
    onAccent: "#05080d",
    line: "#222c39",
    surface: "#151e2a",
    muted: "#606d7b",
  },
  mfbaOxblood: {
    pageBg: radial("#231110", "#120706", "#080403"),
    ink: "#fdf0ec",
    inkSoft: "#a48a81",
    accent: "#ffa023",
    accentSoft: "#ffa02366",
    accentLine: "#ffa0233d",
    onAccent: "#080403",
    line: "#391d1b",
    surface: "#241312",
    muted: "#7b665e",
  },
  mfbaOlive: {
    pageBg: radial("#1c2015", "#101308", "#070803"),
    ink: "#f4f7ea",
    inkSoft: "#94a081",
    accent: "#ff8a1f",
    accentSoft: "#ff8a1f66",
    accentLine: "#ff8a1f3d",
    onAccent: "#070803",
    line: "#2b3220",
    surface: "#1d2216",
    muted: "#6d7758",
  },
  mfbaBone: {
    pageBg: radial("#f7f3eb", "#ece4d6", "#ddd3c0"),
    ink: "#17140f",
    inkSoft: "#6b6357",
    accent: "#e35c12",
    accentSoft: "#e35c1266",
    accentLine: "#e35c123d",
    onAccent: "#fff8f1",
    line: "#d8cdb9",
    surface: "#efe7d9",
    muted: "#9a9184",
  },
};

export type PaletteName = keyof typeof PALETTES;

/** The CSS custom properties every kit paints from. */
export const paletteVars = (name: PaletteName): React.CSSProperties => {
  const p = PALETTES[name];
  return {
    "--page-bg": p.pageBg,
    "--ink": p.ink,
    "--ink-soft": p.inkSoft,
    "--accent": p.accent,
    "--accent-soft": p.accentSoft,
    "--accent-line": p.accentLine,
    "--on-accent": p.onAccent,
    "--line": p.line,
    "--surface": p.surface,
    "--muted": p.muted,
  } as React.CSSProperties;
};

export const INK = "var(--ink)";
export const INK_SOFT = "var(--ink-soft)";
export const ACCENT = "var(--accent)";
export const ACCENT_SOFT = "var(--accent-soft)";
export const ACCENT_LINE = "var(--accent-line)";
export const ON_ACCENT = "var(--on-accent)";
export const LINE = "var(--line)";
export const SURFACE = "var(--surface)";
export const MUTED = "var(--muted)";
export const PAGE_BG = "var(--page-bg)";
