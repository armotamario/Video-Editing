import { ACCENT } from "./theme";

/** Double forward chevron — a mark for "Moving Forward". */
export const ArrowMark: React.FC<{ size: number; color?: string }> = ({ size, color = ACCENT }) => {
  return (
    <svg width={size} height={size * 0.72} viewBox="0 0 100 72" fill="none">
      <path
        d="M6 8 L40 36 L6 64"
        stroke={color}
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M54 8 L88 36 L54 64"
        stroke={color}
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
