import { AbsoluteFill, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { hatColors } from "../hatColors";
import { GOLD, INK, PAGE_BG } from "../theme";
import { monoFont, serifFont } from "../fonts";
import { Benefits, Body, Film, Headline, Kicker, Outro, Proof, Section, useRise } from "./kit";

const PER_HAT = 8;

const HatFrame: React.FC<{ src: string }> = ({ src }) => {
  const pop = useRise(0, 13);
  return (
    <AbsoluteFill className="items-center justify-center px-24 pb-[300px] pt-[300px]">
      <div
        style={{ transform: `scale(${interpolate(pop, [0, 1], [0.93, 1])})`, opacity: pop }}
        className="flex h-full w-full items-center justify-center"
      >
        <Img src={staticFile(`images/${src}`)} className="h-full w-full object-contain" />
      </div>
    </AbsoluteFill>
  );
};

/** A fast run through all seven colourways under one standing caption. */
const Colourways: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const active = Math.min(Math.floor(frame / PER_HAT), hatColors.length - 1);

  return (
    <Section duration={duration} className="">
      <AbsoluteFill style={{ background: PAGE_BG }} />
      {hatColors.map((color, i) => (
        <Sequence key={color.src} from={i * PER_HAT} durationInFrames={PER_HAT}>
          <HatFrame src={color.src} />
        </Sequence>
      ))}

      <AbsoluteFill className="items-center justify-start pt-[250px]">
        <div
          style={{ fontFamily: monoFont, color: GOLD }}
          className="text-[26px] font-bold uppercase tracking-[0.34em]"
        >
          Seven colourways
        </div>
        <div className="mt-6 flex gap-2.5">
          {hatColors.map((color, i) => (
            <div
              key={color.src}
              style={{ background: i === active ? GOLD : `${GOLD}44` }}
              className={`h-1.5 rounded-full ${i === active ? "w-10" : "w-4"}`}
            />
          ))}
        </div>
      </AbsoluteFill>

      <AbsoluteFill className="items-center justify-end pb-[240px]">
        <div style={{ fontFamily: serifFont, color: INK }} className="text-[74px] font-bold">
          $28.95
        </div>
      </AbsoluteFill>
    </Section>
  );
};

export const Products: React.FC = () => (
  <Film
    track="hymn"
    palette="bone"
    sections={[
      {
        key: "hook",
        duration: 78,
        node: (
          <Section duration={78}>
            <Kicker>Wear your faith</Kicker>
            <div className="mt-10">
              <Headline lines={["Your clothes", "already say", "something."]} goldIndex={[2]} />
            </div>
            <div className="mt-10">
              <Body delay={22}>Make them say the right thing.</Body>
            </div>
          </Section>
        ),
      },
      {
        key: "proof-1",
        duration: 78,
        node: (
          <Proof
            duration={78}
            size={78}
            quote="Put on the Lord Jesus Christ."
            cite="Romans 13:14 · NRSV"
          />
        ),
      },
      {
        key: "proof-2",
        duration: 78,
        node: (
          <Proof
            duration={78}
            size={52}
            quote="The disciple of Christ must not only keep the faith and live on it, but also profess it, confidently bear witness to it, and spread it."
            cite="Catechism 1816"
          />
        ),
      },
      {
        key: "benefits",
        duration: 96,
        node: (
          <Section duration={96}>
            <Kicker>The cap</Kicker>
            <div className="mt-8">
              <Benefits
                start={10}
                step={13}
                points={[
                  { title: "100% chino cotton twill", note: "Soft, structured enough to hold its shape." },
                  { title: "Unstructured 6-panel", note: "Curved visor, sits low and easy." },
                  { title: "Antique-buckle strap", note: "Adjusts properly. No plastic snap." },
                ]}
              />
            </div>
          </Section>
        ),
      },
      { key: "colours", duration: 55, node: <Colourways duration={55} /> },
      { key: "outro", duration: 95, node: <Outro cta="Shop the cap" /> },
    ]}
  />
);
