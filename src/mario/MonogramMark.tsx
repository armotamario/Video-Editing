import { serifFont } from "../fonts";
import { GOLD, INK } from "./theme";

/** Recreation of the MA mark: a gold rule-box holding a serif "MA". */
export const MonogramMark: React.FC<{ size: number }> = ({ size }) => {
  return (
    <div
      style={{ width: size, height: size, border: `${Math.round(size * 0.035)}px solid ${GOLD}` }}
      className="flex items-center justify-center rounded-[14%]"
    >
      <div style={{ fontFamily: serifFont, fontSize: size * 0.48, lineHeight: 1 }} className="flex">
        <span style={{ color: INK }}>M</span>
        <span style={{ color: GOLD }}>A</span>
      </div>
    </div>
  );
};
