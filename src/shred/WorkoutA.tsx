import { Sequence } from "remotion";
import { OnPhoto } from "../photo";
import { Body, ExerciseCard, Film, Headline, Kicker, Outro, RowList, Section, SeriesTag } from "./kit";

const PER_LIFT = 52;

const LIFTS = [
  { name: "Weighted\npush-ups", sets: "3 sets", targets: "Chest · front delts · triceps" },
  { name: "Weighted\nlunges", sets: "3 × 12.5kg", targets: "Quads · glutes" },
  { name: "Dumbbell\nrows", sets: "3 sets", targets: "Lats · upper back · biceps" },
  { name: "Leg raises", sets: "3 sets", targets: "Lower abs · hip flexors" },
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
    <SeriesTag episode="02" label="Workout A" />
  </Section>
);

export const WorkoutA: React.FC = () => (
  <Film
    track="drive"
    palette="mfbaOxblood"
    sections={[
      {
        key: "hook",
        duration: 78,
        node: (
          <OnPhoto src="gym.jpg" scrim={0.78} focus="center 40%">
            <Section duration={78}>
            <Kicker>Three nights a week · 9:00–9:50 PM</Kicker>
            <div className="mt-10">
              <Headline lines={["Train to", "failure.", "Then go home."]} accentIndex={[1]} />
            </div>
            <div className="mt-10">
              <Body delay={22}>Fifty minutes. Four movements. Nothing clever.</Body>
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
            <Kicker>The only rules</Kicker>
            <div className="mt-8">
              <RowList
                start={8}
                step={13}
                rows={[
                  { title: "The last rep should be ugly", note: "If it's clean, the set finished early." },
                  { title: "Phone face down", note: "Fifty minutes. It'll survive." },
                  { title: "Same three nights, every week", note: "Alternate this with Workout B." },
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
