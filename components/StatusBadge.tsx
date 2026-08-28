import { statusColor, statusLabel, type ExperienceStatus } from "@/lib/theme";

type StatusBadgeProps = {
  status: ExperienceStatus;
  label?: string;
};

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const color = statusColor[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap"
      style={{
        borderColor: `${color}55`,
        color,
        backgroundColor: `${color}1a`,
      }}
    >
      <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
      {label ?? statusLabel[status]}
    </span>
  );
}
