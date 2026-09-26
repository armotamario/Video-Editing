import { AbsoluteFill, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { monoFont, serifFont } from "../fonts";
import { INK, LINE, ON_ACCENT, PAGE_BG, SURFACE, paletteVars } from "../palettes";
import { BRAND_URL } from "../brand";
import { Cross, GOLD, Headline, Kicker, Outro, Section, useRise } from "./kit";

/**
 * Same shape as the hat's Store.tsx — hook, product, colourway carousel,
 * cart, sign-off — but for the tee, with the real product photos (cropped
 * from his site screenshots) instead of the drawn placeholder. No prices,
 * no colour names on screen, and no audio bed per his notes.
 */

const TEE_COLOURS = [
  { src: "store/tee-black.png", label: "Black" },
  { src: "store/tee-white.png", label: "White" },
  { src: "store/tee-desert-dust.png", label: "Desert Dust" },
];

const PER_TEE = 54;
/** Pure white — the crops carry their own white background, so the plate
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
  const teeIn = useRise(0, 15);
  const nameIn = useRise(10, 16);

  return (
    <Section duration={duration} className="">
      <AbsoluteFill className="items-center justify-center pb-[420px]">
        <div
          style={{
            transform: `scale(${interpolate(teeIn, [0, 1], [0.86, 1])}) translateY(${interpolate(
              teeIn,
              [0, 1],
              [40, 0],
            )}px)`,
            opacity: teeIn,
            background: PLATE,
          }}
          className="w-[860px] rounded-[56px] p-16"
        >
          <Img src={staticFile(`images/${TEE_COLOURS[0].src}`)} className="w-full object-contain" />
        </div>
      </AbsoluteFill>

      <AbsoluteFill className="items-center justify-end px-20 pb-[220px] text-center">
        <div
          style={{
            opacity: nameIn,
            transform: `translateY(${interpolate(nameIn, [0, 1], [24, 0])}px)`,
            fontFamily: serifFont,
            color: INK,
          }}
          className="text-[82px] font-bold leading-none tracking-[-0.02em]"
        >
          Godly Raiment Tee
        </div>
      </AbsoluteFill>
    </Section>
  );
};

/** One colourway, held for twenty frames — no label underneath. */
const Colourway: React.FC<{ index: number }> = ({ index }) => {
  const { src } = TEE_COLOURS[index];
  const pop = useRise(0, 13);
  return (
    <AbsoluteFill className="items-center justify-center pt-[120px]">
      <div
        style={{
          transform: `scale(${interpolate(pop, [0, 1], [0.92, 1])})`,
          opacity: pop,
          background: PLATE,
        }}
        className="w-[680px] rounded-[56px] p-14"
      >
        <Img src={staticFile(`images/${src}`)} className="w-full object-contain" />
      </div>
    </AbsoluteFill>
  );
};

const Colourways: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const active = Math.min(Math.floor(frame / PER_TEE), TEE_COLOURS.length - 1);

  return (
    <Section duration={duration} className="">
      <AbsoluteFill style={{ background: PAGE_BG }} />
      {TEE_COLOURS.map((c, i) => (
        <Sequence key={c.label} from={i * PER_TEE} durationInFrames={PER_TEE}>
          <Colourway index={i} />
        </Sequence>
      ))}

      <AbsoluteFill className="items-center justify-start pt-[280px]">
        <Kicker>Three colourways</Kicker>
        <div className="mt-8 flex gap-3">
          {TEE_COLOURS.map((c, i) => (
            <div
              key={c.label}
              style={{ background: i === active ? GOLD : `${GOLD}44` }}
              className={`h-[7px] rounded-full ${i === active ? "w-[64px]" : "w-[26px]"}`}
            />
          ))}
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
            <Img src={staticFile(`images/${TEE_COLOURS[0].src}`)} className="w-full object-contain" />
          </div>
          <div className="flex-1">
            <div
              style={{ fontFamily: serifFont, color: INK }}
              className="text-[52px] font-bold leading-tight"
            >
              Godly Raiment Tee
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
  { key: "product", duration: 86, node: <Product duration={86} /> },
  { key: "colourways", duration: 162, node: <Colourways duration={162} /> },
  { key: "cart", duration: 74, node: <Cart duration={74} /> },
  { key: "outro", duration: 100, node: <Outro cta={`Shop ${BRAND_URL}`} scrim={0.4} mark={false} /> },
];

export const TeeStore: React.FC = () => {
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
