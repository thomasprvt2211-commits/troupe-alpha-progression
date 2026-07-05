import type { MemberRole } from "@/src/types";

interface RoleBadgeProps {
  role: MemberRole;
  size?: "sm" | "md";
}

const roleConfig: Record<
  MemberRole,
  { label: string; className: string }
> = {
  CP: {
    label: "CP",
    className: "bg-scout-gold/15 text-amber-900 border border-scout-gold/30",
  },
  SP: {
    label: "SP",
    className: "bg-blue-50 text-blue-800 border border-blue-200/80",
  },
  Membre: {
    label: "Membre",
    className: "bg-gray-100 text-gray-700 border border-gray-200",
  },
};

export default function RoleBadge({ role, size = "sm" }: RoleBadgeProps) {
  const config = roleConfig[role];
  const sizeClasses = size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm";

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold tracking-wide ${sizeClasses} ${config.className}`}
    >
      {config.label}
    </span>
  );
}
