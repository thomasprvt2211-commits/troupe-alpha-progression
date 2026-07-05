"use client";

import { motion } from "framer-motion";
import type { BadgeDefinition } from "@/src/types";
import BadgeIcon from "@/components/BadgeIcon";

interface BadgeCardProps {
  badge: BadgeDefinition;
  index?: number;
}

const difficultyColors: Record<BadgeDefinition["difficulty"], string> = {
  Facile: "bg-green-50 text-green-700 border-green-100",
  Moyen: "bg-amber-50 text-amber-800 border-amber-100",
  Difficile: "bg-red-50 text-red-700 border-red-100",
};

export default function BadgeCard({ badge, index = 0 }: BadgeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="card-interactive group"
    >
      <div className="flex items-start gap-4">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-sm transition-transform group-hover:scale-105"
          style={{ backgroundColor: `${badge.color}18` }}
        >
          <BadgeIcon icon={badge.icon} className="h-7 w-7" style={{ color: badge.color }} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-lg font-bold text-scout-charcoal">
              {badge.name}
            </h3>
            <span
              className={`badge-pill border ${difficultyColors[badge.difficulty]}`}
            >
              {badge.difficulty}
            </span>
          </div>
          <span className="mt-2 inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600">
            {badge.category}
          </span>
          <p className="mt-3 text-sm leading-relaxed text-gray-500">
            {badge.description}
          </p>
          {badge.requirements && (
            <p className="mt-2 text-xs text-gray-400">
              <span className="font-semibold text-gray-500">Exigences :</span>{" "}
              {badge.requirements}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
