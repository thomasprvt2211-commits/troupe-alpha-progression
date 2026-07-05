"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, TreePine } from "lucide-react";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/patrouilles", label: "Patrouilles" },
  { href: "/membres", label: "Membres" },
  { href: "/badges", label: "Badges" },
  { href: "/statistiques", label: "Statistiques" },
];

const adminLink = { href: "/gestion-badges", label: "Gestion badges" };

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 glass-nav">
      <nav className="section-container flex h-[4.25rem] items-center justify-between">
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-scout-forest to-scout-green text-white shadow-sm transition-transform group-hover:scale-105">
            <TreePine className="h-5 w-5" />
            <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-scout-gold" />
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

        <ul className="hidden items-center gap-0.5 lg:flex">
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
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
