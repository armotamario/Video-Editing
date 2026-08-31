export const LogoMark: React.FC<{ size: number; color?: string }> = ({ size, color = "#fbbf24" }) => {
  return (
    <svg width={size} height={(size * 145) / 100} viewBox="0 0 100 145" fill={color}>
      <circle cx="50" cy="9" r="9" />
      <rect x="41" y="9" width="18" height="91" />
      <circle cx="14" cy="41" r="9" />
      <circle cx="86" cy="41" r="9" />
      <rect x="14" y="32" width="72" height="18" />
      <polygon points="41,100 59,100 50,145" />
    </svg>
  );
};
