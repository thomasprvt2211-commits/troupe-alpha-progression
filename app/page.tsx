import Link from "next/link";
import Hero from "@/components/Hero";
import PatrolCard from "@/components/PatrolCard";
import {
  patrols,
  members,
  getCPForPatrol,
  getSPForPatrol,
} from "@/src/data/troupe-alpha";
import { getMembersByPatrol } from "@/src/lib/utils";
import { ArrowRight, Users, Award, BarChart3, Layers, Info } from "lucide-react";

export default function HomePage() {
  const cpCount = members.filter((m) => m.role === "CP").length;
  const spCount = members.filter((m) => m.role === "SP").length;

  const quickLinks = [
    {
      href: "/patrouilles",
      icon: Layers,
      title: "Patrouilles",
      description: "Consulter les 5 patrouilles et leurs effectifs",
      color: "from-scout-forest/10 to-scout-green/5",
    },
    {
      href: "/membres",
      icon: Users,
      title: "Membres",
      description: "Rechercher et gérer tous les scouts",
      color: "from-blue-50 to-blue-100/30",
    },
    {
      href: "/badges",
      icon: Award,
      title: "Badges",
      description: "Idées de badges à attribuer manuellement",
      color: "from-amber-50 to-scout-gold/10",
    },
    {
      href: "/statistiques",
      icon: BarChart3,
      title: "Statistiques",
      description: "Tableau de bord analytique de la troupe",
      color: "from-gray-50 to-gray-100/50",
    },
  ];

  return (
    <>
      <Hero
        patrolCount={patrols.length}
        memberCount={members.length}
        cpCount={cpCount}
        spCount={spCount}
      />

      <section className="section-container py-16 lg:py-20">
        <div className="mb-10 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-scout-gold">
            Navigation
          </span>
          <h2 className="section-title mt-2">Accès rapide</h2>
          <p className="section-subtitle mx-auto">
            Toutes les sections du tableau de bord en un clic
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="card-interactive group flex flex-col"
            >
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${link.color} text-scout-forest transition-transform group-hover:scale-105`}
              >
                <link.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display font-bold text-scout-charcoal">
                {link.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-500">
                {link.description}
              </p>
              <span className="mt-4 flex items-center gap-1 text-sm font-semibold text-scout-forest">
                Accéder
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section-container pb-16 lg:pb-20">
        <div className="card-base mx-auto max-w-2xl border-scout-forest/10 bg-gradient-to-br from-white to-scout-forest/[0.03] px-6 py-5">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-scout-forest/10 text-scout-forest">
              <Info className="h-4 w-4" />
            </div>
            <h2 className="font-display text-base font-semibold text-scout-charcoal">
              À propos du site
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-gray-600">
            Cette plateforme a été créée pour aider la Troupe Alpha à suivre les
            patrouilles, les membres et les badges validés. Elle est réservée aux
            Scouts du Liban — Groupe SSCC Batroun.
          </p>
          <p className="mt-3 text-xs font-medium text-scout-forest">
            Créé par Thomas Fadi Abdallah pour le suivi de la progression personnelle
            de la Troupe Alpha.
          </p>
        </div>
      </section>

      <section className="border-t border-gray-200/60 bg-white py-16 lg:py-20">
        <div className="section-container">
          <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-scout-gold">
                Effectifs
              </span>
              <h2 className="section-title mt-2">Nos patrouilles</h2>
              <p className="section-subtitle">
                {patrols.length} patrouilles · {members.length} membres actifs
              </p>
            </div>
            <Link href="/patrouilles" className="btn-secondary">
              Voir toutes les patrouilles
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
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
      </section>
    </>
  );
}
