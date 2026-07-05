"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BarChart3,
  Users,
  Award,
  Crown,
  Shield,
  TrendingUp,
} from "lucide-react";
import type { Member, Patrol } from "@/src/types";
import { getMembersByPatrol } from "@/src/lib/utils";
import { useMemberBadges } from "@/src/hooks/useMemberBadges";
import StatCard from "@/components/ui/StatCard";
import EmptyState from "@/components/ui/EmptyState";

interface StatsSectionProps {
  patrols: Patrol[];
  members: Member[];
  cpMembers: Member[];
  spMembers: Member[];
}

export default function StatsSection({
  patrols,
  members,
  cpMembers,
  spMembers,
}: StatsSectionProps) {
  const { getTotalCount, getCount, isLoaded, store } = useMemberBadges();

  const totalValidated = isLoaded ? (getTotalCount() ?? 0) : 0;

  const membersWithMostBadges = isLoaded
    ? members
        .map((member) => ({ member, count: getCount(member.id) ?? 0 }))
        .filter((item) => item.count > 0)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
    : [];

  const maxPatrolBadges = Math.max(
    ...patrols.map((patrol) =>
      members
        .filter((m) => m.patrolId === patrol.id)
        .reduce((sum, m) => sum + (store[m.id]?.length ?? 0), 0)
    ),
    1
  );

  if (!isLoaded) {
    return (
      <div className="py-16 text-center text-gray-400">Chargement des statistiques...</div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
        <StatCard label="Patrouilles" value={patrols.length} icon={Users} index={0} />
        <StatCard label="Membres" value={members.length} icon={Users} index={1} />
        <StatCard label="CP" value={cpMembers.length} icon={Crown} accent="gold" index={2} />
        <StatCard label="SP" value={spMembers.length} icon={Shield} index={3} />
        <StatCard
          label="Badges validés"
          value={totalValidated}
          icon={Award}
          accent="gold"
          index={4}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-base"
        >
          <div className="mb-5 flex items-center gap-2 border-b border-gray-100 pb-4">
            <BarChart3 className="h-5 w-5 text-scout-forest" />
            <h3 className="font-display font-semibold text-scout-charcoal">
              Membres par patrouille
            </h3>
          </div>
          <div className="space-y-4">
            {patrols.map((patrol) => {
              const count = getMembersByPatrol(members, patrol.id).length;
              const maxCount = Math.max(
                ...patrols.map((p) => getMembersByPatrol(members, p.id).length)
              );
              return (
                <div key={patrol.id}>
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className="font-semibold text-scout-charcoal">{patrol.name}</span>
                    <span className="text-gray-500">{count} membres</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${maxCount > 0 ? (count / maxCount) * 100 : 0}%`,
                        backgroundColor: patrol.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="card-base"
        >
          <div className="mb-5 flex items-center gap-2 border-b border-gray-100 pb-4">
            <Award className="h-5 w-5 text-scout-gold" />
            <h3 className="font-display font-semibold text-scout-charcoal">
              Badges validés par patrouille
            </h3>
          </div>
          <div className="space-y-4">
            {patrols.map((patrol) => {
              const badgeCount = members
                .filter((m) => m.patrolId === patrol.id)
                .reduce((sum, m) => sum + (store[m.id]?.length ?? 0), 0);
              return (
                <div key={patrol.id}>
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className="font-semibold text-scout-charcoal">{patrol.name}</span>
                    <span className="font-medium text-gray-500">
                      {badgeCount} badge{badgeCount > 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${(badgeCount / maxPatrolBadges) * 100}%`,
                        backgroundColor: patrol.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {membersWithMostBadges.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="card-base"
        >
          <div className="mb-5 flex items-center gap-2 border-b border-gray-100 pb-4">
            <TrendingUp className="h-5 w-5 text-scout-forest" />
            <h3 className="font-display font-semibold text-scout-charcoal">
              Membres avec le plus de badges
            </h3>
          </div>
          <ol className="space-y-1">
            {membersWithMostBadges.map(({ member, count }, i) => {
              const patrol = patrols.find((p) => p.id === member.patrolId);
              return (
                <li key={member.id}>
                  <Link
                    href={`/membres/${member.id}`}
                    className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-scout-cream"
                  >
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-white"
                      style={{ backgroundColor: patrol?.color }}
                    >
                      {i + 1}
                    </span>
                    <span className="flex-1 text-sm font-semibold text-scout-charcoal">
                      {member.fullName}
                    </span>
                    <span className="rounded-full bg-scout-gold/15 px-2.5 py-0.5 text-xs font-bold text-amber-900">
                      {count} badge{count > 1 ? "s" : ""}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </motion.div>
      ) : (
        <EmptyState
          icon={Award}
          title="Aucun badge validé pour l'instant"
          description="Les badges ajoutés manuellement sur les fiches membres apparaîtront ici."
        />
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="card-base"
        >
          <h3 className="mb-4 flex items-center gap-2 font-display font-semibold text-scout-charcoal">
            <Crown className="h-5 w-5 text-scout-gold" />
            Chefs de patrouille
          </h3>
          <ul className="divide-y divide-gray-100">
            {cpMembers.map((member) => {
              const patrol = patrols.find((p) => p.id === member.patrolId);
              return (
                <li key={member.id}>
                  <Link
                    href={`/membres/${member.id}`}
                    className="flex items-center justify-between py-3 transition-colors hover:text-scout-forest"
                  >
                    <span className="text-sm font-semibold">{member.fullName}</span>
                    <span className="text-xs text-gray-400">Patrouille {patrol?.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-base"
        >
          <h3 className="mb-4 flex items-center gap-2 font-display font-semibold text-scout-charcoal">
            <Shield className="h-5 w-5 text-blue-600" />
            Seconds de patrouille
          </h3>
          <ul className="divide-y divide-gray-100">
            {spMembers.map((member) => {
              const patrol = patrols.find((p) => p.id === member.patrolId);
              return (
                <li key={member.id}>
                  <Link
                    href={`/membres/${member.id}`}
                    className="flex items-center justify-between py-3 transition-colors hover:text-scout-forest"
                  >
                    <span className="text-sm font-semibold">{member.fullName}</span>
                    <span className="text-xs text-gray-400">Patrouille {patrol?.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
