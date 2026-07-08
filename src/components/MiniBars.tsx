'use client';

// Small, dependency-free SVG bar chart for weekly/periodic series.
export default function MiniBars({
  data,
  height = 120,
  label,
}: {
  data: { label: string; value: number }[];
  height?: number;
  label?: string;
}) {
  if (data.length === 0) {
    return <p className="text-sm opacity-50">No data yet — activity will appear here as it happens.</p>;
  }
  const max = Math.max(1, ...data.map((d) => d.value));
  const barW = 100 / data.length;

  return (
    <div className="flex flex-col gap-2">
      {label && <div className="text-xs font-semibold uppercase tracking-wide opacity-60">{label}</div>}
      <svg viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" className="w-full" style={{ height }}>
        <defs>
          <linearGradient id="bar-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#e879f9" />
          </linearGradient>
        </defs>
        {data.map((d, i) => {
          const h = (d.value / max) * (height - 20);
          const x = i * barW + barW * 0.15;
          const w = barW * 0.7;
          return (
            <g key={d.label + i}>
              <rect x={x} y={height - h - 12} width={w} height={Math.max(h, 0.5)} rx="1.5" fill="url(#bar-grad)" />
              <text x={x + w / 2} y={height - h - 15} fontSize="4" fill="white" textAnchor="middle" opacity="0.8">
                {d.value}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="flex justify-between text-[10px] opacity-50">
        {data.map((d, i) => (
          <span key={i} className="truncate" style={{ width: `${barW}%`, textAlign: 'center' }}>{d.label}</span>
        ))}
      </div>
    </div>
  );
}
