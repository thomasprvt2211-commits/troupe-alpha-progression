import type { PatrolId } from "@/src/types";

interface PatrolBadgeProps {
  patrolName: string;
  patrolId?: PatrolId;
  color?: string;
  size?: "sm" | "md";
}

export default function PatrolBadge({
  patrolName,
  color,
  size = "sm",
}: PatrolBadgeProps) {
  const sizeClasses = size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${sizeClasses}`}
      style={{
        backgroundColor: color ? `${color}18` : "#f3f4f6",
        color: color ?? "#374151",
        border: color ? `1px solid ${color}30` : "1px solid #e5e7eb",
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: color ?? "#9ca3af" }}
      />
      {patrolName}
    </span>
  );
}
