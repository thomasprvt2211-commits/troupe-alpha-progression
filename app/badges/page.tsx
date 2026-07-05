"use client";

import { useBadges } from "@/src/hooks/useBadges";
import BadgeCard from "@/components/BadgeCard";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";
import { Lightbulb, Award } from "lucide-react";

export default function BadgesPage() {
  const { badges, isLoaded } = useBadges();

  return (
    <div className="section-container py-10 sm:py-14 lg:py-16">
      <PageHeader
        badge="Référence"
        title="Idées de badges"
        subtitle="Ces badges peuvent être ajoutés manuellement aux membres depuis leur fiche."
      />

      <div className="mb-10 flex items-start gap-4 rounded-2xl border border-scout-gold/20 bg-gradient-to-r from-scout-gold/5 to-transparent p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-scout-gold/15">
          <Lightbulb className="h-5 w-5 text-scout-gold" />
        </div>
        <p className="text-sm leading-relaxed text-gray-600">
          <span className="font-semibold text-scout-charcoal">
            Aucune attribution automatique.
          </span>{" "}
          Utilisez cette liste comme catalogue de référence. Pour valider un badge
          à un scout, ouvrez sa fiche et saisissez-le dans la section « Badges
          validés ».
        </p>
      </div>

      {!isLoaded ? (
        <div className="py-16 text-center text-gray-400">Chargement...</div>
      ) : badges.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {badges.map((badge, index) => (
            <BadgeCard key={badge.id} badge={badge} index={index} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Award}
          title="Aucune idée de badge"
          description="Ajoutez des idées depuis la page Gestion badges."
        />
      )}
    </div>
  );
}
