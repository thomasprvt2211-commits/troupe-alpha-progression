"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Users, Shield, Crown, Award, Layers } from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import { useMemberBadges } from "@/src/hooks/useMemberBadges";

interface HeroProps {
  patrolCount: number;
  memberCount: number;
  cpCount: number;
  spCount: number;
}

export default function Hero({
  patrolCount,
  memberCount,
  cpCount,
  spCount,
}: HeroProps) {
  const { getTotalCount, isLoaded } = useMemberBadges();
  const badgeTotal = isLoaded ? getTotalCount() : 0;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-scout-forest via-[#234d3a] to-scout-green">
      <div className="absolute inset-0 bg-hero-pattern" />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="absolute -right-24 top-0 h-96 w-96 rounded-full bg-scout-gold/10 blur-3xl" />
      <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-white/5 blur-3xl" />

      <div className="section-container relative py-20 sm:py-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-scout-gold" />
            Scoutisme — Troupe Alpha
          </div>
          <h1 className="font-display text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-[3.25rem]">
            Progression personnelle — Troupe Alpha
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/75 sm:text-xl">
            Suivi moderne des patrouilles, membres et badges scouts
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/membres"
              className="btn-gold min-w-[180px] shadow-premium"
            >
              Voir les membres
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/patrouilles"
              className="inline-flex min-w-[180px] items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/15"
            >
              <Users className="h-4 w-4" />
              Voir les patrouilles
            </Link>
          </div>
        </motion.div>

        <div className="mt-16 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
          <StatCard label="Patrouilles" value={patrolCount} icon={Layers} index={0} compact />
          <StatCard label="Membres" value={memberCount} icon={Users} index={1} compact />
          <StatCard label="Chefs de patrouille" value={cpCount} icon={Crown} accent="gold" index={2} compact />
          <StatCard label="Seconds de patrouille" value={spCount} icon={Shield} index={3} compact />
          <StatCard
            label="Badges validés"
            value={badgeTotal}
            icon={Award}
            accent="gold"
            index={4}
            compact
          />
        </div>
      </div>
    </section>
  );
}
