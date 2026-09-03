import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { PhoneCard } from "../Frames";
import { SITES } from "../sites";
import {
  Body,
  Film,
  GOLD,
  Headline,
  Kicker,
  Outro,
  PointList,
  Section,
  monoFont,
  useRise,
} from "../kit";

const PhoneScene: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const phoneIn = useRise(0, 15);
  const scroll = interpolate(frame, [14, duration - 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Section duration={duration} className="items-center justify-center">
      <AbsoluteFill className="items-center justify-start pt-[170px]">
        <div
          style={{ opacity: phoneIn, fontFamily: monoFont, color: GOLD }}
          className="text-[27px] font-bold uppercase tracking-[0.34em]"
        >
          Live on a phone
        </div>
      </AbsoluteFill>
      <AbsoluteFill className="items-center justify-center pt-[80px]">
        <div
          style={{
            transform: `translateY(${interpolate(phoneIn, [0, 1], [80, 0])}px) scale(${interpolate(
              phoneIn,
              [0, 1],
              [0.9, 1],
            )})`,
            opacity: phoneIn,
          }}
        >
          <PhoneCard site={SITES.cafe} height={1220} scroll={scroll} />
        </div>
      </AbsoluteFill>
    </Section>
  );
};

export const MobilePreview: React.FC = () => (
  <Film
    track="lofi"
    palette="sand"
    sections={[
      {
        key: "hook",
        duration: 100,
        node: (
          <Section duration={100}>
            <Kicker>Mobile preview</Kicker>
            <div className="mt-10">
              <Headline lines={["Most customers", "never see the", "desktop version."]} goldIndex={[2]} />
            </div>
            <div className="mt-10">
              <Body delay={24}>They find you on a phone, in the car, deciding in seconds.</Body>
            </div>
          </Section>
        ),
      },
      { key: "phone", duration: 190, node: <PhoneScene duration={190} /> },
      {
        key: "points",
        duration: 95,
        node: (
          <Section duration={95}>
            <Kicker>So it's built for a thumb</Kicker>
            <div className="mt-10">
              <PointList
                start={12}
                step={16}
                points={[
                  { title: "Tap to call", note: "Your number is one tap, not a copy-paste." },
                  { title: "Buttons you can hit", note: "Big targets, reachable one-handed." },
                  { title: "Loads on 4G", note: "No heavy sliders, no waiting." },
                ]}
              />
            </div>
          </Section>
        ),
      },
      { key: "outro", duration: 95, node: <Outro /> },
    ]}
  />
);
