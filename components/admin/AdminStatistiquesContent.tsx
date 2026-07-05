"use client";

import StatsSection from "@/components/StatsSection";
import SupabaseDiagnosticsCard from "@/components/SupabaseDiagnosticsCard";
import AdminPanelHeader from "@/components/admin/AdminPanelHeader";
import {
  patrols,
  members,
  getAllCP,
  getAllSP,
} from "@/src/data/troupe-alpha";

export default function AdminStatistiquesContent() {
  return (
    <div className="section-container py-10 sm:py-14 lg:py-16">
      <AdminPanelHeader />

      <div className="mb-8">
        <span className="text-xs font-semibold uppercase tracking-widest text-scout-gold">
          Analytics
        </span>
        <h2 className="section-title mt-2">Statistiques</h2>
        <p className="section-subtitle">
          Vue d&apos;ensemble de la troupe — badges validés manuellement et effectifs
          par patrouille
        </p>
      </div>

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
