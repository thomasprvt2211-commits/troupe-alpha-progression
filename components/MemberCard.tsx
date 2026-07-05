"use client";

import { motion } from "framer-motion";
import { ArrowRight, Award } from "lucide-react";
import type { Member, Patrol } from "@/src/types";
import { getInitials } from "@/src/lib/utils";
import { useMemberBadges } from "@/src/hooks/useMemberBadges";
import PatrolBadge from "@/components/ui/PatrolBadge";
import RoleBadge from "@/components/ui/RoleBadge";

interface MemberCardProps {
  member: Member;
  patrol: Patrol | undefined;
  onClick: () => void;
  index?: number;
}

export default function MemberCard({
  member,
  patrol,
  onClick,
  index = 0,
}: MemberCardProps) {
  const { getCount, isLoaded } = useMemberBadges();
  const badgeCount = isLoaded ? (getCount(member.id) ?? 0) : 0;

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.4 }}
      onClick={onClick}
      className="card-interactive group relative w-full cursor-pointer overflow-hidden text-left"
    >
      <div
        className="absolute left-0 top-0 h-full w-1"
        style={{ backgroundColor: patrol?.color ?? "#6b7280" }}
      />

      <div className="flex items-start gap-4 pl-3">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white shadow-sm ring-2 ring-white"
          style={{ backgroundColor: patrol?.color ?? "#374151" }}
        >
          {getInitials(member.fullName)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-base font-bold text-scout-charcoal transition-colors group-hover:text-scout-forest">
              {member.fullName}
            </h3>
            <RoleBadge role={member.role} />
          </div>

          {patrol && (
            <div className="mt-2">
              <PatrolBadge patrolName={patrol.name} color={patrol.color} />
            </div>
          )}

          <div className="mt-3 flex items-center gap-1.5 text-sm text-gray-500">
            <Award className="h-4 w-4 text-scout-gold" />
            <span>
              Badges validés :{" "}
              <span className="font-semibold text-scout-charcoal">{badgeCount}</span>
            </span>
          </div>

          <div className="mt-4 flex items-center justify-end border-t border-gray-100 pt-3">
            <span className="flex items-center gap-1.5 text-sm font-semibold text-scout-forest">
              Voir la fiche
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}
