"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2, Plus, RotateCcw } from "lucide-react";
import { useBadges } from "@/src/hooks/useBadges";
import type { BadgeDefinition } from "@/src/types";
import BadgeForm from "@/components/BadgeForm";
import BadgeIcon from "@/components/BadgeIcon";

const difficultyColors: Record<BadgeDefinition["difficulty"], string> = {
  Facile: "bg-green-100 text-green-700",
  Moyen: "bg-amber-100 text-amber-700",
  Difficile: "bg-red-100 text-red-700",
};

export default function BadgeManager() {
  const { badges, isLoaded, addBadge, updateBadge, deleteBadge, resetToDefault } =
    useBadges();
  const [showForm, setShowForm] = useState(false);
  const [editingBadge, setEditingBadge] = useState<BadgeDefinition | null>(null);

  const handleAdd = (data: Parameters<typeof addBadge>[0]) => {
    addBadge(data);
    setShowForm(false);
  };

  const handleUpdate = (data: Parameters<typeof updateBadge>[1]) => {
    if (!editingBadge) return;
    updateBadge(editingBadge.id, data);
    setEditingBadge(null);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Supprimer le badge « ${name} » ?`)) {
      deleteBadge(id);
      if (editingBadge?.id === id) setEditingBadge(null);
    }
  };

  const handleReset = () => {
    if (
      window.confirm(
        "Réinitialiser tous les badges aux valeurs par défaut ? Les modifications seront perdues."
      )
    ) {
      resetToDefault();
      setEditingBadge(null);
      setShowForm(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="py-12 text-center text-gray-500">Chargement des badges...</div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-gray-500">
          {badges.length} badge{badges.length > 1 ? "s" : ""} · Modifications sauvegardées
          localement dans ce navigateur
        </p>
        <div className="flex flex-wrap gap-2">
          {!showForm && !editingBadge && (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              <Plus className="h-4 w-4" />
              Ajouter un badge
            </button>
          )}
          <button type="button" onClick={handleReset} className="btn-secondary">
            <RotateCcw className="h-4 w-4" />
            Réinitialiser
          </button>
        </div>
      </div>

      {showForm && (
        <BadgeForm
          onSubmit={handleAdd}
          onCancel={() => setShowForm(false)}
          submitLabel="Créer le badge"
        />
      )}

      {editingBadge && (
        <BadgeForm
          initial={editingBadge}
          onSubmit={handleUpdate}
          onCancel={() => setEditingBadge(null)}
          submitLabel="Mettre à jour"
        />
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {badges.map((badge, index) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            className="card-interactive group"
          >
            <div className="flex items-start gap-4">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${badge.color}20` }}
              >
                <BadgeIcon icon={badge.icon} className="h-6 w-6" style={{ color: badge.color }} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display font-bold text-gray-900">{badge.name}</h3>
                  <span className={`badge-pill ${difficultyColors[badge.difficulty]}`}>
                    {badge.difficulty}
                  </span>
                  <span className="badge-pill bg-gray-100 text-gray-600">
                    {badge.category}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500">{badge.description}</p>
                {badge.requirements && (
                  <p className="mt-1 text-xs text-gray-400">{badge.requirements}</p>
                )}
              </div>
            </div>
            <div className="mt-4 flex gap-2 border-t border-gray-100 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingBadge(badge);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-scout-green hover:bg-scout-green/10"
              >
                <Pencil className="h-4 w-4" />
                Modifier
              </button>
              <button
                type="button"
                onClick={() => handleDelete(badge.id, badge.name)}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                Supprimer
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {badges.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-200 py-16 text-center">
          <p className="text-gray-500">Aucun badge. Ajoutez-en un pour commencer.</p>
        </div>
      )}
    </div>
  );
}
