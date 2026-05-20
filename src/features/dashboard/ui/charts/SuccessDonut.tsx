interface SuccessDonutProps {
  percent: number;
  size?: number;
}

export const SuccessDonut = ({ percent, size = 56 }: SuccessDonutProps) => {
  const clamped = Math.min(100, Math.max(0, percent));
  const stroke = 6;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-surface-variant/50"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="text-success transition-all duration-500"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-manrope text-[11px] font-bold text-on-surface">
        {clamped}%
      </span>
    </div>
  );
};
