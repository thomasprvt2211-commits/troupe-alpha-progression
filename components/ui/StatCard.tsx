"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  accent?: "green" | "gold" | "neutral";
  index?: number;
  compact?: boolean;
}

const accentStyles = {
  green: {
    icon: "bg-scout-forest/10 text-scout-forest",
    value: "text-scout-forest",
  },
  gold: {
    icon: "bg-scout-gold/15 text-scout-gold",
    value: "text-scout-charcoal",
  },
  neutral: {
    icon: "bg-gray-100 text-gray-600",
    value: "text-scout-charcoal",
  },
};

export default function StatCard({
  label,
  value,
  icon: Icon,
  accent = "green",
  index = 0,
  compact = false,
}: StatCardProps) {
  const styles = accentStyles[accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className={`card-base ${compact ? "p-4" : "p-5"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={`font-display text-2xl font-bold tracking-tight sm:text-3xl ${styles.value}`}>
            {value}
          </p>
          <p className="mt-1 text-sm font-medium text-gray-500">{label}</p>
        </div>
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${styles.icon}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </motion.div>
  );
}
