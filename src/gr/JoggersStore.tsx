import { AbsoluteFill, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { monoFont, serifFont } from "../fonts";
import { INK, LINE, ON_ACCENT, PAGE_BG, SURFACE, paletteVars } from "../palettes";
import { BRAND_URL } from "../brand";
import { Cross, GOLD, Headline, Outro, Section, useRise } from "./kit";

/**
 * Same shape as TeeStore/ShortsStore — hook, product, cart, sign-off — for
 * the joggers. Only one product shot exists (no back view, single
 * colourway), so there's no carousel beat here. No prices, no labels, no
 * audio bed.
 */

const JOGGERS_SRC = "store/joggers-black.png";
/** Pure white — the crop carries its own white background, so the plate
 * has to match it exactly or the card shows a seam around the photo. */
const PLATE = "#ffffff";

const Hook: React.FC<{ duration: number }> = ({ duration }) => {
  const markIn = useRise(0, 14);
  const tagIn = useRise(22, 14);
  return (
    <Section duration={duration} className="items-center justify-center px-16 text-center">
      <div style={{ transform: `scale(${markIn})`, opacity: markIn }}>
        <Cross size={80} />
      </div>
      <div className="mt-14">
        <Headline lines={["Wear your", "faith."]} goldIndex={[1]} size={126} delay={6} align="center" />
      </div>
      <div
        style={{
          opacity: tagIn,
          fontFamily: monoFont,
          color: GOLD,
          border: `2px solid ${GOLD}`,
        }}
        className="mt-14 rounded-full px-10 py-4 text-[28px] font-bold uppercase tracking-[0.3em]"
      >
        Out now
      </div>
    </Section>
  );
};

/** The product, floated on the ground — no price line this time. */
const Product: React.FC<{ duration: number }> = ({ duration }) => {
  const joggersIn = useRise(0, 15);
  const nameIn = useRise(10, 16);

  return (
    <Section duration={duration} className="">
      <AbsoluteFill className="items-center justify-center pb-[300px]">
        <div
          style={{
            transform: `scale(${interpolate(joggersIn, [0, 1], [0.86, 1])}) translateY(${interpolate(
              joggersIn,
              [0, 1],
              [40, 0],
            )}px)`,
            opacity: joggersIn,
            background: PLATE,
          }}
          className="w-[760px] rounded-[56px] p-14"
        >
          <Img src={staticFile(`images/${JOGGERS_SRC}`)} className="w-full object-contain" />
        </div>
      </AbsoluteFill>

      <AbsoluteFill className="items-center justify-end px-20 pb-[160px] text-center">
        <div
          style={{
            opacity: nameIn,
            transform: `translateY(${interpolate(nameIn, [0, 1], [24, 0])}px)`,
            fontFamily: serifFont,
            color: INK,
          }}
          className="text-[82px] font-bold leading-none tracking-[-0.02em]"
        >
          Godly Raiment Joggers
        </div>
      </AbsoluteFill>
    </Section>
  );
};

/** The cart line — no price, no colour name, just the item and the button. */
const Cart: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const rowIn = useRise(0, 16);
  const fill = interpolate(frame, [22, 46], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const added = interpolate(frame, [48, 56], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Section duration={duration} className="items-center justify-center px-20">
      <div
        style={{
          opacity: rowIn,
          transform: `translateY(${interpolate(rowIn, [0, 1], [30, 0])}px)`,
          background: SURFACE,
          border: `1px solid ${LINE}`,
        }}
        className="w-full rounded-[36px] px-14 py-12"
      >
        <div className="flex items-center gap-10">
          <div style={{ background: PLATE }} className="w-[190px] flex-none rounded-[26px] p-5">
            <Img src={staticFile(`images/${JOGGERS_SRC}`)} className="w-full object-contain" />
          </div>
          <div className="flex-1">
            <div
              style={{ fontFamily: serifFont, color: INK }}
              className="text-[52px] font-bold leading-tight"
            >
              Godly Raiment Joggers
            </div>
          </div>
        </div>

        <div
          style={{ background: `${GOLD}2e` }}
          className="relative mt-12 h-[112px] w-full overflow-hidden rounded-full"
        >
          <div
            style={{ background: GOLD, width: `${fill * 100}%` }}
            className="absolute inset-y-0 left-0"
          />
          <div
            style={{ fontFamily: monoFont, color: fill > 0.55 ? ON_ACCENT : INK }}
            className="absolute inset-0 flex items-center justify-center text-[34px] font-bold uppercase tracking-[0.24em]"
          >
            {added > 0.5 ? "Added" : "Add to cart"}
          </div>
        </div>
      </div>
    </Section>
  );
};

const SECTIONS = [
  { key: "hook", duration: 58, node: <Hook duration={58} /> },
  { key: "product", duration: 96, node: <Product duration={96} /> },
  { key: "cart", duration: 74, node: <Cart duration={74} /> },
  { key: "outro", duration: 100, node: <Outro cta={`Shop ${BRAND_URL}`} scrim={0.4} mark={false} /> },
];

export const JoggersStore: React.FC = () => {
  let at = 0;
  return (
    <AbsoluteFill style={{ ...paletteVars("graphite"), background: PAGE_BG }}>
      {SECTIONS.map((section) => {
        const from = at;
        at += section.duration;
        return (
          <Sequence key={section.key} from={from} durationInFrames={section.duration}>
            {section.node}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

export const JOGGERS_STORE_DURATION = SECTIONS.reduce((a, s) => a + s.duration, 0);
