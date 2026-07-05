import BadgeManager from "@/components/BadgeManager";
import PageHeader from "@/components/ui/PageHeader";

export const metadata = {
  title: "Gestion badges — Troupe Alpha",
};

export default function GestionBadgesPage() {
  return (
    <div className="section-container py-10 sm:py-14 lg:py-16">
      <PageHeader
        badge="Administration"
        title="Gestion badges"
        subtitle="Ajoutez, modifiez ou supprimez les idées de badges. Les changements sont enregistrés localement dans votre navigateur."
      />

      <BadgeManager />
    </div>
  );
}
