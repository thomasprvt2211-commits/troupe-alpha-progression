"use client";

import { Calendar } from "lucide-react";
import type { Member, Patrol } from "@/src/types";
import { formatDate, getInitials } from "@/src/lib/utils";
import { useMemberBadges } from "@/src/hooks/useMemberBadges";
import PatrolBadge from "@/components/ui/PatrolBadge";
import RoleBadge from "@/components/ui/RoleBadge";

interface MemberProfileHeaderProps {
  member: Member;
  patrol: Patrol | undefined;
}

export default function MemberProfileHeader({
  member,
  patrol,
}: MemberProfileHeaderProps) {
  const { getCount, isLoaded } = useMemberBadges();
  const badgeCount = isLoaded ? getCount(member.id) : 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-card">
      <div
        className="h-24 sm:h-28"
        style={{
          background: patrol
            ? `linear-gradient(135deg, ${patrol.colorDark}, ${patrol.color})`
            : "linear-gradient(135deg, #1b4332, #2d6a4f)",
        }}
      />
      <div className="relative px-6 pb-6 sm:px-8">
        <div className="-mt-10 flex flex-col gap-4 sm:-mt-12 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-4">
            <div
              className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-4 border-white text-xl font-bold text-white shadow-premium sm:h-24 sm:w-24"
              style={{ backgroundColor: patrol?.color ?? "#374151" }}
            >
              {getInitials(member.fullName)}
            </div>
            <div className="pb-1">
              <h1 className="font-display text-2xl font-bold tracking-tight text-scout-charcoal sm:text-3xl">
                {member.fullName}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {patrol && (
                  <PatrolBadge patrolName={patrol.name} color={patrol.color} size="md" />
                )}
                <RoleBadge role={member.role} size="md" />
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 sm:pb-1">
            <div className="rounded-xl bg-scout-cream px-4 py-2.5 text-center">
              <p className="text-2xl font-bold text-scout-forest">{badgeCount}</p>
              <p className="text-xs font-medium text-gray-500">Badges validés</p>
            </div>
          </div>
        </div>
        <p className="mt-4 flex items-center gap-1.5 text-xs text-gray-400">
          <Calendar className="h-3.5 w-3.5" />
          Dernière mise à jour : {formatDate(member.lastUpdate)}
        </p>
      </div>
    </div>
  );
}
