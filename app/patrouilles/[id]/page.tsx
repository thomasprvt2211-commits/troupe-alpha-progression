"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Crown, Shield, Users } from "lucide-react";
import MemberCard from "@/components/MemberCard";
import MemberDetailModal from "@/components/MemberDetailModal";
import PatrolBadge from "@/components/ui/PatrolBadge";
import { members, getPatrolById, getCPForPatrol, getSPForPatrol } from "@/src/data/troupe-alpha";
import { getMembersByPatrol } from "@/src/lib/utils";
import type { Member } from "@/src/types";

export default function PatrolDetailPage() {
  const params = useParams();
  const patrolId = params.id as string;
  const patrol = getPatrolById(patrolId);
  const patrolMembers = getMembersByPatrol(members, patrolId as Member["patrolId"]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  if (!patrol) {
    return (
      <div className="section-container py-20 text-center">
        <h1 className="font-display text-2xl font-bold text-scout-charcoal">
          Patrouille introuvable
        </h1>
        <Link href="/patrouilles" className="btn-primary mt-6">
          Retour aux patrouilles
        </Link>
      </div>
    );
  }

  return (
    <div className="section-container py-10 sm:py-14 lg:py-16">
      <Link
        href="/patrouilles"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-scout-forest"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour aux patrouilles
      </Link>

      <div className="mb-10 overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-card">
        <div
          className="h-32 sm:h-36"
          style={{
            background: `linear-gradient(135deg, ${patrol.colorDark}, ${patrol.color})`,
          }}
        />
        <div className="px-6 pb-8 sm:px-8">
          <div className="-mt-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div
                className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-white text-2xl font-bold text-white shadow-premium"
                style={{ backgroundColor: patrol.color }}
              >
                {patrol.name[0]}
              </div>
              <h1 className="font-display text-3xl font-bold tracking-tight text-scout-charcoal">
                Patrouille {patrol.name}
              </h1>
              <p className="mt-2 max-w-lg text-sm leading-relaxed text-gray-500">
                {patrol.description}
              </p>
              <div className="mt-3">
                <PatrolBadge patrolName={patrol.name} color={patrol.color} size="md" />
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3 sm:max-w-md">
            <div className="rounded-xl bg-scout-cream p-4 text-center">
              <Users className="mx-auto mb-1 h-5 w-5 text-gray-400" />
              <p className="text-2xl font-bold text-scout-charcoal">{patrolMembers.length}</p>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Membres
              </p>
            </div>
            <div className="rounded-xl bg-scout-cream p-4">
              <Crown className="mb-1 h-5 w-5 text-scout-gold" />
              <p className="truncate text-sm font-semibold">
                {getCPForPatrol(patrol.id)?.fullName ?? "—"}
              </p>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">CP</p>
            </div>
            <div className="rounded-xl bg-scout-cream p-4">
              <Shield className="mb-1 h-5 w-5 text-blue-500" />
              <p className="truncate text-sm font-semibold">
                {getSPForPatrol(patrol.id)?.fullName ?? "—"}
              </p>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">SP</p>
            </div>
          </div>
        </div>
      </div>

      <h2 className="mb-5 font-display text-xl font-semibold text-scout-charcoal">
        Membres de la patrouille
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {patrolMembers.map((member, index) => (
          <MemberCard
            key={member.id}
            member={member}
            patrol={patrol}
            onClick={() => setSelectedMember(member)}
            index={index}
          />
        ))}
      </div>

      {selectedMember && (
        <MemberDetailModal
          member={selectedMember}
          patrol={patrol}
          onClose={() => setSelectedMember(null)}
        />
      )}
    </div>
  );
}
