import Link from "next/link";
import { TreePine } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200/80 bg-white">
      <div className="section-container py-10">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-scout-forest text-white">
              <TreePine className="h-4 w-4" />
            </div>
            <div>
              <p className="font-display text-sm font-bold text-scout-forest">
                Troupe Alpha
              </p>
              <p className="text-xs text-gray-400">Progression personnelle</p>
            </div>
          </div>
          <div className="text-center sm:text-right">
            <p className="text-sm font-medium text-gray-600">
              © 2025-2026 Troupe Alpha — Progression personnelle
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Créé pour le suivi scout de la troupe.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
