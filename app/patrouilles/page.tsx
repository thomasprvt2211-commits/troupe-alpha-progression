import PatrolCard from "@/components/PatrolCard";
import PageHeader from "@/components/ui/PageHeader";
import {
  patrols,
  members,
  getCPForPatrol,
  getSPForPatrol,
} from "@/src/data/troupe-alpha";
import { getMembersByPatrol } from "@/src/lib/utils";

export const metadata = {
  title: "Patrouilles — Troupe Alpha",
};

export default function PatrouillesPage() {
  return (
    <div className="section-container py-10 sm:py-14 lg:py-16">
      <PageHeader
        badge="Organisation"
        title="Patrouilles"
        subtitle="Les 5 patrouilles de la Troupe Alpha — effectifs, CP et SP"
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {patrols.map((patrol, index) => (
          <PatrolCard
            key={patrol.id}
            patrol={patrol}
            memberCount={getMembersByPatrol(members, patrol.id).length}
            cpName={getCPForPatrol(patrol.id)?.fullName}
            spName={getSPForPatrol(patrol.id)?.fullName}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
