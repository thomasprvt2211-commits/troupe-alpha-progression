"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import type { Patrol, RoleFilter } from "@/src/types";

interface SearchFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  patrolFilter: string;
  onPatrolChange: (value: string) => void;
  roleFilter: RoleFilter;
  onRoleChange: (value: RoleFilter) => void;
  patrols: Patrol[];
}

export default function SearchFilters({
  search,
  onSearchChange,
  patrolFilter,
  onPatrolChange,
  roleFilter,
  onRoleChange,
  patrols,
}: SearchFiltersProps) {
  return (
    <div className="card-base">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-scout-charcoal">
        <SlidersHorizontal className="h-4 w-4 text-scout-forest" />
        Recherche et filtres
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher un membre par nom..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="input-field pl-11"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-400">
            Patrouille
          </label>
          <select
            value={patrolFilter}
            onChange={(e) => onPatrolChange(e.target.value)}
            className="input-field cursor-pointer"
          >
            <option value="tous">Toutes les patrouilles</option>
            {patrols.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-400">
            Rôle
          </label>
          <select
            value={roleFilter}
            onChange={(e) => onRoleChange(e.target.value as RoleFilter)}
            className="input-field cursor-pointer"
          >
            <option value="tous">Tous</option>
            <option value="CP">CP</option>
            <option value="SP">SP</option>
            <option value="Membre">Membres</option>
          </select>
        </div>
      </div>
    </div>
  );
}
