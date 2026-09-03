import { Sequence } from "remotion";
import { OnPhoto } from "../photo";
import { Body, ExerciseCard, Film, Headline, Kicker, Outro, RowList, Section, SeriesTag } from "./kit";

const PER_LIFT = 52;

const LIFTS = [
  { name: "Dumbbell\nshoulder press", sets: "3 sets", targets: "Full shoulders · triceps" },
  { name: "Romanian\ndeadlifts", sets: "3 sets", targets: "Hamstrings · glutes" },
  { name: "Dumbbell\nbicep curls", sets: "3 sets", targets: "Biceps" },
  { name: "Weighted\ncrunches", sets: "3 sets", targets: "Upper abs" },
];

const Lifts: React.FC<{ duration: number }> = ({ duration }) => (
  <Section duration={duration} className="">
    {LIFTS.map((lift, i) => (
      <Sequence key={lift.name} from={i * PER_LIFT} durationInFrames={PER_LIFT}>
        <ExerciseCard
          index={i}
          name={lift.name}
          sets={lift.sets}
          targets={lift.targets}
          duration={PER_LIFT}
        />
      </Sequence>
    ))}
    <SeriesTag episode="03" label="Workout B" />
  </Section>
);

export const WorkoutB: React.FC = () => (
  <Film
    track="grind"
    palette="mfbaOlive"
    sections={[
      {
        key: "hook",
        duration: 78,
        node: (
          <OnPhoto src="gym.jpg" scrim={0.78} focus="center 30%">
            <Section duration={78}>
            <Kicker>The other night · 9:00–9:50 PM</Kicker>
            <div className="mt-10">
              <Headline lines={["Push day", "was easy.", "This one isn't."]} accentIndex={[2]} />
            </div>
            <div className="mt-10">
              <Body delay={22}>Shoulders, hamstrings, arms, abs. Same fifty minutes.</Body>
            </div>
          </Section>
          </OnPhoto>
        ),
      },
      { key: "lifts", duration: 208, node: <Lifts duration={208} /> },
      {
        key: "rules",
        duration: 99,
        node: (
          <Section duration={99}>
            <Kicker>Make it count</Kicker>
            <div className="mt-8">
              <RowList
                start={8}
                step={13}
                rows={[
                  { title: "Slow on the way down", note: "Three seconds lowering beats a heavier dumbbell." },
                  { title: "Add weight before reps", note: "Once you hit failure past twelve, go up." },
                  { title: "Never two hard days back to back", note: "A rest day is part of the program." },
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
