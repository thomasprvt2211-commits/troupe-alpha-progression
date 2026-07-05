"use client";

import StatsSection from "@/components/StatsSection";
import SupabaseDiagnosticsCard from "@/components/SupabaseDiagnosticsCard";
import PageHeader from "@/components/ui/PageHeader";
import {
  patrols,
  members,
  getAllCP,
  getAllSP,
} from "@/src/data/troupe-alpha";

export default function StatistiquesPage() {
  return (
    <div className="section-container py-10 sm:py-14 lg:py-16">
      <PageHeader
        badge="Analytics"
        title="Statistiques"
        subtitle="Vue d'ensemble de la troupe — badges validés manuellement et effectifs par patrouille"
      />

      <SupabaseDiagnosticsCard />

      <StatsSection
        patrols={patrols}
        members={members}
        cpMembers={getAllCP()}
        spMembers={getAllSP()}
      />
    </div>
  );
}
