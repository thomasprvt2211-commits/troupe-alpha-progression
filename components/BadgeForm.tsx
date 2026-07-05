"use client";

import { useEffect, useState } from "react";
import type { BadgeDefinition, BadgeFormData } from "@/src/types";
import { BADGE_CATEGORY_OPTIONS, BADGE_ICON_OPTIONS } from "@/src/lib/badge-icons";
import BadgeIcon from "@/components/BadgeIcon";

const emptyForm: BadgeFormData = {
  name: "",
  description: "",
  category: "Autre",
  difficulty: "Moyen",
  icon: "Medal",
  color: "#2d6a4f",
  requirements: "",
};

interface BadgeFormProps {
  initial?: BadgeDefinition;
  onSubmit: (data: BadgeFormData) => void;
  onCancel: () => void;
  submitLabel?: string;
}

export default function BadgeForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel = "Enregistrer",
}: BadgeFormProps) {
  const [form, setForm] = useState<BadgeFormData>(
    initial
      ? {
          name: initial.name,
          description: initial.description,
          category: initial.category,
          difficulty: initial.difficulty,
          icon: initial.icon,
          color: initial.color,
          requirements: initial.requirements,
        }
      : emptyForm
  );

  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name,
        description: initial.description,
        category: initial.category,
        difficulty: initial.difficulty,
        icon: initial.icon,
        color: initial.color,
        requirements: initial.requirements,
      });
    } else {
      setForm(emptyForm);
    }
  }, [initial]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="card-base space-y-4">
      <h3 className="font-display font-semibold text-gray-900">
        {initial ? "Modifier le badge" : "Nouveau badge"}
      </h3>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-gray-500">
          Nom du badge *
        </label>
        <input
          type="text"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-scout-green focus:ring-2 focus:ring-scout-green/20"
          placeholder="Ex. Badge Orientation"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-gray-500">
          Description
        </label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={3}
          className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-scout-green focus:ring-2 focus:ring-scout-green/20"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-500">
            Catégorie
          </label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-scout-green focus:ring-2 focus:ring-scout-green/20"
          >
            {BADGE_CATEGORY_OPTIONS.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-500">
            Difficulté
          </label>
          <select
            value={form.difficulty}
            onChange={(e) =>
              setForm({
                ...form,
                difficulty: e.target.value as BadgeFormData["difficulty"],
              })
            }
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-scout-green focus:ring-2 focus:ring-scout-green/20"
          >
            <option value="Facile">Facile</option>
            <option value="Moyen">Moyen</option>
            <option value="Difficile">Difficile</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-500">
            Icône
          </label>
          <select
            value={form.icon}
            onChange={(e) => setForm({ ...form, icon: e.target.value })}
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-scout-green focus:ring-2 focus:ring-scout-green/20"
          >
            {BADGE_ICON_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-500">
            Couleur
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={form.color}
              onChange={(e) => setForm({ ...form, color: e.target.value })}
              className="h-10 w-14 cursor-pointer rounded-lg border border-gray-200"
            />
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${form.color}20` }}
            >
              <BadgeIcon icon={form.icon} className="h-5 w-5" style={{ color: form.color }} />
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-gray-500">
          Conditions / exigences
        </label>
        <textarea
          value={form.requirements}
          onChange={(e) => setForm({ ...form, requirements: e.target.value })}
          rows={2}
          className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-scout-green focus:ring-2 focus:ring-scout-green/20"
          placeholder="Critères pour obtenir ce badge..."
        />
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <button type="submit" className="btn-primary">
          {submitLabel}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">
          Annuler
        </button>
      </div>
    </form>
  );
}
