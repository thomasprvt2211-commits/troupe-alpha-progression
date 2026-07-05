"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/patrouilles", label: "Patrouilles" },
  { href: "/membres", label: "Membres" },
  { href: "/badges", label: "Badges" },
  { href: "/statistiques", label: "Statistiques" },
];

const adminLink = { href: "/gestion-badges", label: "Gestion badges" };

function TroupeAlphaLogo({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gray-200/80 bg-white p-1 shadow-card sm:h-12 sm:w-12 ${className}`}
      aria-hidden
    >
      <Image
        src="/images/branding/troupe-alpha-logo.png"
        alt="Logo Troupe Alpha SSCC Batroun"
        width={44}
        height={44}
        className="h-9 w-9 object-contain sm:h-10 sm:w-10"
      />
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 glass-nav">
      <nav className="section-container flex h-[4.25rem] items-center justify-between">
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gray-200/80 bg-white p-1 shadow-sm transition-transform group-hover:scale-105 sm:h-12 sm:w-12">
            <Image
              src="/images/branding/scouts-du-liban-logo.png"
              alt="Logo Scouts du Liban"
              width={44}
              height={44}
              className="h-9 w-9 object-contain sm:h-10 sm:w-10"
              priority
            />
          </div>
          <div className="hidden sm:block">
            <span className="font-display text-base font-bold tracking-tight text-scout-forest">
              Troupe Alpha
            </span>
            <span className="block text-[11px] font-medium uppercase tracking-widest text-gray-400">
              Progression personnelle
            </span>
          </div>
        </Link>

        <div className="hidden items-center gap-3 lg:flex">
          <ul className="flex items-center gap-0.5">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`relative rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? "text-scout-forest"
                      : "text-gray-600 hover:bg-scout-cream hover:text-scout-forest"
                  }`}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute inset-x-2 -bottom-[1.125rem] h-0.5 rounded-full bg-scout-gold"
                    />
                  )}
                </Link>
              </li>
            ))}
            <li className="ml-2 border-l border-gray-200 pl-2">
              <Link
                href={adminLink.href}
                className={`rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wide transition-colors ${
                  isActive(adminLink.href)
                    ? "text-scout-gold"
                    : "text-gray-400 hover:text-scout-gold"
                }`}
              >
                {adminLink.label}
              </Link>
            </li>
          </ul>
          <TroupeAlphaLogo />
        </div>

        <button
          type="button"
          className="rounded-xl border border-gray-200 p-2.5 text-gray-600 transition-colors hover:bg-scout-cream lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-gray-100 bg-white/95 backdrop-blur-xl lg:hidden"
          >
            <ul className="section-container space-y-1 py-4">
              {[...navLinks, adminLink].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                      isActive(link.href)
                        ? "bg-scout-forest/5 text-scout-forest"
                        : "text-gray-600 hover:bg-scout-cream"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="flex justify-center border-t border-gray-100 pt-4">
                <TroupeAlphaLogo />
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
