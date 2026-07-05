"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Users, Crown, Shield } from "lucide-react";
import type { Patrol } from "@/src/types";
import PatrolBadge from "@/components/ui/PatrolBadge";

interface PatrolCardProps {
  patrol: Patrol;
  memberCount: number;
  cpName?: string;
  spName?: string;
  index?: number;
}

export default function PatrolCard({
  patrol,
  memberCount,
  cpName,
  spName,
  index = 0,
}: PatrolCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.45 }}
      className="card-interactive group relative flex flex-col overflow-hidden"
    >
      <div
        className="absolute inset-x-0 top-0 h-1"
        style={{ backgroundColor: patrol.color }}
      />

      <div className="flex items-start justify-between gap-4">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-xl font-bold text-white shadow-sm"
          style={{ backgroundColor: patrol.color }}
        >
          {patrol.name[0]}
        </div>
        <PatrolBadge patrolName={patrol.name} color={patrol.color} size="md" />
      </div>

      <h3 className="mt-5 font-display text-xl font-bold tracking-tight text-scout-charcoal">
        Patrouille {patrol.name}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-500">
        {patrol.description}
      </p>

      <div className="mt-6 grid grid-cols-3 gap-2">
        <div className="rounded-xl bg-scout-cream px-3 py-3 text-center">
          <Users className="mx-auto mb-1 h-4 w-4 text-gray-400" />
          <p className="text-lg font-bold text-scout-charcoal">{memberCount}</p>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
            Membres
          </p>
        </div>
        <div className="rounded-xl bg-scout-cream px-3 py-3">
          <Crown className="mb-1 h-4 w-4 text-scout-gold" />
          <p className="truncate text-xs font-semibold text-scout-charcoal">
            {cpName ?? "—"}
          </p>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
            CP
          </p>
        </div>
        <div className="rounded-xl bg-scout-cream px-3 py-3">
          <Shield className="mb-1 h-4 w-4 text-blue-500" />
          <p className="truncate text-xs font-semibold text-scout-charcoal">
            {spName ?? "—"}
          </p>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
            SP
          </p>
        </div>
      </div>

      <Link
        href={`/patrouilles/${patrol.id}`}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all"
        style={{
          backgroundColor: `${patrol.color}12`,
          color: patrol.colorDark,
          border: `1px solid ${patrol.color}25`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = patrol.color;
          e.currentTarget.style.color = "#fff";
          e.currentTarget.style.borderColor = patrol.color;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = `${patrol.color}12`;
          e.currentTarget.style.color = patrol.colorDark;
          e.currentTarget.style.borderColor = `${patrol.color}25`;
        }}
      >
        Voir la patrouille
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </motion.article>
  );
}
