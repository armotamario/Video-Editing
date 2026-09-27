import { AbsoluteFill, Easing, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { monoFont, serifFont } from "../fonts";
import { BRAND_URL } from "../brand";

/**
 * Cream scripture card: cross, verse, reference, "Wear your faith" footer —
 * then a sign-off that shows the actual pieces instead of just the name.
 * Silent, no prices, no colour names.
 */

const BG = "#e9e0d0";
const BG_GLOW = "#eee6d7";
const GOLD = "#8a6532";
const INK = "#1c1712";
const MUTED = "#76695a";

const VERSE = ["Rejoice in hope,", "be patient in tribulation,", "be constant in prayer."];
const REFERENCE = "Romans 12:12";

const PIECES = [
  "store/black.png",
  "store/tee-black.png",
  "store/tee-white.png",
  "store/tee-desert-dust.png",
  "store/joggers-black.png",
  "store/shorts-front.png",
];

const VERSE_LEN = 240;
const CTA_LEN = 210;
export const VERSE_CARD_DURATION = VERSE_LEN + CTA_LEN;

const ease = { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) } as const;

const rise = (frame: number, start: number, len = 18) => interpolate(frame, [start, start + len], [0, 1], ease);

const Backdrop: React.FC = () => (
  <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, ${BG_GLOW} 0%, ${BG} 62%)` }} />
);

const CrossMark: React.FC<{ t: number }> = ({ t }) => (
  <div className="flex flex-col items-center">
    <svg width={48} height={104} viewBox="0 0 48 104">
      <rect x={21} y={0} width={6} height={100 * t} fill={GOLD} />
      <rect x={24 - 24 * t} y={32} width={48 * t} height={6} fill={GOLD} />
    </svg>
    <div style={{ width: 80 * t, height: 2, background: GOLD, marginTop: 20 }} />
  </div>
);

const Footer: React.FC<{ t: number }> = ({ t }) => (
  <div className="flex flex-col items-center" style={{ opacity: t }}>
    <div style={{ width: 80, height: 2, background: GOLD }} />
    <div style={{ fontFamily: monoFont, color: GOLD, fontSize: 28, letterSpacing: "0.55em", marginTop: 52, paddingLeft: "0.55em" }}>
      WEAR YOUR FAITH
    </div>
    <div style={{ fontFamily: monoFont, color: MUTED, fontSize: 24, letterSpacing: "0.55em", marginTop: 26, paddingLeft: "0.55em" }}>
      GODLY RAIMENT
    </div>
  </div>
);

const Verse: React.FC = () => {
  const frame = useCurrentFrame();
  const out = interpolate(frame, [VERSE_LEN - 16, VERSE_LEN], [1, 0], ease);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <AbsoluteFill className="items-center" style={{ paddingTop: 150 }}>
        <CrossMark t={rise(frame, 4, 22)} />
      </AbsoluteFill>
      <AbsoluteFill className="items-center justify-center" style={{ paddingBottom: 40 }}>
        {VERSE.map((line, i) => {
          const t = rise(frame, 26 + i * 16, 22);
          return (
            <div
              key={line}
              style={{
                fontFamily: serifFont,
                fontWeight: 700,
                fontSize: 66,
                lineHeight: 1.36,
                color: INK,
                opacity: t,
                transform: `translateY(${(1 - t) * 22}px)`,
              }}
            >
              {line}
            </div>
          );
        })}
        <div
          style={{
            fontFamily: serifFont,
            fontWeight: 500,
            fontSize: 34,
            color: MUTED,
            marginTop: 40,
            opacity: rise(frame, 86, 20),
          }}
        >
          {REFERENCE}
        </div>
      </AbsoluteFill>
      <AbsoluteFill className="items-center justify-end" style={{ paddingBottom: 170 }}>
        <Footer t={rise(frame, 100, 22)} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** The sign-off: the pieces themselves, on white cards, then the shop link. */
const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const head = rise(frame, 0, 18);
  return (
    <AbsoluteFill>
      <AbsoluteFill className="items-center" style={{ paddingTop: 130 }}>
        <div style={{ opacity: head, transform: `translateY(${(1 - head) * 18}px)` }} className="flex flex-col items-center">
          <CrossMark t={head} />
          <div style={{ fontFamily: serifFont, fontWeight: 700, fontSize: 76, color: INK, marginTop: 34 }}>
            Wear your faith.
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill className="items-center justify-center" style={{ paddingTop: 150 }}>
        <div className="grid grid-cols-2" style={{ gap: 28 }}>
          {PIECES.map((src, i) => {
            const p = spring({ frame: frame - 14 - i * 6, fps, config: { damping: 14, stiffness: 150 } });
            return (
              <div
                key={src}
                className="flex items-center justify-center overflow-hidden"
                style={{
                  width: 400,
                  height: 330,
                  borderRadius: 36,
                  background: "#ffffff",
                  boxShadow: "0 18px 40px rgba(60,45,25,0.12)",
                  opacity: Math.min(1, p * 1.3),
                  transform: `translateY(${(1 - p) * 40}px) scale(${interpolate(p, [0, 1], [0.9, 1])})`,
                  padding: 22,
                }}
              >
                <Img src={staticFile(`images/${src}`)} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
              </div>
            );
          })}
        </div>
      </AbsoluteFill>

      <AbsoluteFill className="items-center justify-end" style={{ paddingBottom: 120 }}>
        <div style={{ opacity: rise(frame, 60, 20) }} className="flex flex-col items-center">
          <div
            style={{
              fontFamily: monoFont,
              fontWeight: 700,
              color: "#f6efe2",
              background: GOLD,
              fontSize: 30,
              letterSpacing: "0.2em",
              padding: "22px 44px",
              borderRadius: 999,
            }}
          >
            {`SHOP ${BRAND_URL}`}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const VerseCard: React.FC = () => (
  <AbsoluteFill>
    <Backdrop />
    <Sequence durationInFrames={VERSE_LEN}>
      <Verse />
    </Sequence>
    <Sequence from={VERSE_LEN} durationInFrames={CTA_LEN}>
      <Cta />
    </Sequence>
  </AbsoluteFill>
);
