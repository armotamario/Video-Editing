import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { monoFont, serifFont } from "../fonts";
import { ACCENT_LINE } from "../palettes";
import { Film, GOLD, INK, INK_SOFT, Outro, Section, useSectionFade } from "./kit";

/** The hour, laid out as a route, with a marker travelling down it. */
const STOPS: { at: string; name: string; note: string }[] = [
  { at: "0:00", name: "Entrance", note: "Everyone stands. You'll know when to sit." },
  { at: "0:05", name: "Readings", note: "Two, then a psalm. Just listen." },
  { at: "0:15", name: "Gospel", note: "Stand. This is the part to hold onto." },
  { at: "0:20", name: "Homily", note: "Ten minutes. Sit." },
  { at: "0:35", name: "The Eucharist", note: "The centre of it. Kneel when they kneel." },
  { at: "0:50", name: "Communion", note: "Not yet? Cross your arms for a blessing." },
  { at: "0:58", name: "Sent out", note: "That's it. You did the whole thing." },
];

const STEP = 148;
const PER_STOP = 30;

const Route: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const fade = useSectionFade(duration, 8);
  const active = Math.min(Math.floor(frame / PER_STOP), STOPS.length - 1);
  const progress = interpolate(frame, [0, PER_STOP * STOPS.length], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const top = 130;
  const lineH = (STOPS.length - 1) * STEP;

  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <div className="absolute left-[118px]" style={{ top }}>
        <div style={{ background: ACCENT_LINE, height: lineH }} className="w-[4px] rounded-full" />
        <div
          style={{ background: GOLD, height: lineH * progress }}
          className="absolute left-0 top-0 w-[4px] rounded-full"
        />
      </div>

      {STOPS.map((stop, i) => {
        const on = i <= active;
        const pop = interpolate(frame, [i * PER_STOP, i * PER_STOP + 10], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <div
            key={stop.name}
            className="absolute left-[64px] right-[70px] flex items-start gap-9"
            style={{ top: top + i * STEP - 30 }}
          >
            <div
              style={{
                background: on ? GOLD : "transparent",
                border: `4px solid ${on ? GOLD : ACCENT_LINE}`,
                transform: `scale(${interpolate(pop, [0, 1], [0.6, 1])})`,
              }}
              className="mt-2 h-[54px] w-[54px] flex-none rounded-full"
            />
            <div style={{ opacity: on ? 1 : 0.32 }}>
              <div
                style={{ fontFamily: monoFont, color: on ? GOLD : INK_SOFT }}
                className="text-[24px] font-bold tracking-[0.2em]"
              >
                {stop.at}
              </div>
              <div
                style={{ fontFamily: serifFont, color: INK }}
                className="mt-1 text-[62px] font-bold leading-none"
              >
                {stop.name}
              </div>
              <div
                style={{ fontFamily: monoFont, color: INK_SOFT }}
                className="mt-3 text-[26px] leading-snug"
              >
                {stop.note}
              </div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export const MassMap: React.FC = () => (
  <Film
    track="hymn"
    palette="bone"
    sections={[
      {
        key: "hook",
        duration: 66,
        node: (
          <Section duration={66} className="justify-center px-16">
            <div
              style={{ fontFamily: monoFont, color: GOLD }}
              className="text-[26px] font-bold uppercase tracking-[0.34em]"
            >
              If you haven't been in years
            </div>
            <div
              style={{ fontFamily: serifFont, color: INK }}
              className="mt-10 text-[116px] font-bold leading-[1.02]"
            >
              Here's the
              <br />
              whole hour,
              <br />
              <span style={{ color: GOLD }}>start to finish.</span>
            </div>
          </Section>
        ),
      },
      { key: "route", duration: 250, node: <Route duration={250} /> },
      {
        key: "close",
        duration: 96,
        node: (
          <Section duration={96} className="items-center justify-center px-16 text-center">
            <div
              style={{ fontFamily: serifFont, color: INK }}
              className="text-[100px] font-bold leading-[1.08]"
            >
              Nobody is watching
              <br />
              to see if you
              <br />
              get it right.
            </div>
            <div
              style={{ fontFamily: monoFont, color: GOLD }}
              className="mt-12 text-[30px] font-bold uppercase tracking-[0.2em]"
            >
              Sit at the back. Come as you are.
            </div>
          </Section>
        ),
      },
      { key: "outro", duration: 68, node: <Outro cta="See you Sunday" /> },
    ]}
  />
);
