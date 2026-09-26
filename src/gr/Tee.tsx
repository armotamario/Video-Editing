import { Cross } from "./kit";

export type TeeColor = { color: string; ink: string; label: string };

/**
 * The tee, the same three colourways as the current drop. No product
 * photography exists for it yet, so this is a drawn silhouette carrying the
 * same cross + wordmark treatment as the cap embroidery — flat and clean
 * rather than a fake photo.
 */
export const TEE_COLORS: TeeColor[] = [
  { color: "#141210", ink: "#f3efe6", label: "Black" },
  { color: "#cdbb99", ink: "#2a2016", label: "Tan" },
  { color: "#f7f5f0", ink: "#141210", label: "White" },
];

const OUTLINE = "rgba(0,0,0,0.32)";

export const Tee: React.FC<{ width: number; color: string; ink: string; goldCross?: string }> = ({
  width,
  color,
  ink,
  goldCross = "#c9a24b",
}) => {
  const height = width;
  return (
    <svg width={width} height={height} viewBox="0 0 120 120" fill="none">
      <path
        d="M34,113 L34,42 L16,34 L4,14 L30,6 L48,10 Q60,20 72,10 L90,6 L116,14 L104,34 L86,42 L86,113 Z"
        fill={color}
        stroke={OUTLINE}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <g transform="translate(60, 56)">
        <g transform="translate(-8, -22)">
          <Cross size={16} color={goldCross} />
        </g>
        <text
          x="0"
          y="8"
          textAnchor="middle"
          fill={ink}
          fontFamily="'Inter', sans-serif"
          fontWeight={900}
          fontSize="8.4"
          letterSpacing="0.01em"
        >
          GODLY
        </text>
        <text
          x="0"
          y="19"
          textAnchor="middle"
          fill={ink}
          fontFamily="'Inter', sans-serif"
          fontWeight={900}
          fontSize="8.4"
          letterSpacing="0.01em"
        >
          RAIMENT
        </text>
      </g>
    </svg>
  );
};
