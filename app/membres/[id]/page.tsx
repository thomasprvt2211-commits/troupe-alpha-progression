import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  Circle,
  StickyNote,
  ArrowLeft,
} from "lucide-react";
import MemberProfileHeader from "@/components/MemberProfileHeader";
import MemberBadgeEditor from "@/components/MemberBadgeEditor";
import { members, getPatrolById } from "@/src/data/troupe-alpha";
import { countValidatedCategories } from "@/src/lib/utils";
import type { ProgressionStatus } from "@/src/types";

const statusIcons = {
  Validé: CheckCircle2,
  "En cours": Clock,
  "Non commencé": Circle,
};

const statusColors: Record<ProgressionStatus, string> = {
  Validé: "text-green-700 bg-green-50 border-green-100",
  "En cours": "text-amber-700 bg-amber-50 border-amber-100",
  "Non commencé": "text-gray-500 bg-gray-50 border-gray-100",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return members.map((member) => ({ id: member.id }));
}

export default async function MemberDetailPage({ params }: PageProps) {
  const { id } = await params;
  const member = members.find((m) => m.id === id);

  if (!member) {
    notFound();
  }

  const patrol = getPatrolById(member.patrolId);
  const validatedCount = countValidatedCategories(member);

  return (
    <div className="section-container py-10 sm:py-14 lg:py-16">
      <Link
        href="/membres"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-scout-forest"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour aux membres
      </Link>

      <div className="space-y-6">
        <MemberProfileHeader member={member} patrol={patrol} />
        <MemberBadgeEditor memberId={member.id} memberName={member.fullName} />

        <section className="card-base">
          <h2 className="mb-5 font-display text-lg font-semibold text-scout-charcoal">
            Étapes de progression
          </h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {member.progressionCategories.map((cat) => {
              const Icon = statusIcons[cat.status];
              return (
                <div
                  key={cat.id}
                  className={`flex items-center gap-3 rounded-xl border p-3.5 ${statusColors[cat.status]}`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{cat.name}</p>
                    <p className="mt-0.5 text-xs opacity-70">{cat.description}</p>
                  </div>
                  <span className="badge-pill shrink-0 bg-white/70 text-[10px]">
                    {cat.status}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {member.notes && (
          <section className="card-base">
            <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold text-scout-charcoal">
              <StickyNote className="h-5 w-5 text-gray-400" />
              Notes du chef
            </h2>
            <p className="leading-relaxed text-gray-600">{member.notes}</p>
          </section>
        )}

        <div className="rounded-xl border border-scout-green/20 bg-scout-green/5 py-4 text-center text-sm font-semibold text-scout-forest">
          {validatedCount}/{member.progressionCategories.length} catégories validées
        </div>
      </div>
    </div>
  );
}
