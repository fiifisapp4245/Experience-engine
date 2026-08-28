"use client";

type SparklineProps = {
  data: number[];
  color: string;
  width?: number;
  height?: number;
  className?: string;
};

export function Sparkline({ data, color, width = 64, height = 20, className }: SparklineProps) {
  if (data.length === 0) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1 || 1);

  const points = data.map((value, i) => {
    const x = i * step;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  });

  const linePath = `M${points.join(" L")}`;
  const areaPath = `M0,${height} L${points.join(" L")} L${width},${height} Z`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      aria-hidden="true"
    >
      <path d={areaPath} fill={color} opacity={0.12} />
      <path d={linePath} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
