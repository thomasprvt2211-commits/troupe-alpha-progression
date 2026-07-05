"use client";

import { useState } from "react";
import { Award, Pencil, Trash2, Check, X, Plus, AlertCircle, CloudOff } from "lucide-react";
import { useMemberBadges } from "@/src/hooks/useMemberBadges";
import { formatDate } from "@/src/lib/utils";
import EmptyState from "@/components/ui/EmptyState";

interface MemberBadgeEditorProps {
  memberId: string;
  memberName: string;
}

export default function MemberBadgeEditor({
  memberId,
  memberName,
}: MemberBadgeEditorProps) {
  const {
    getBadges,
    addMemberBadge,
    updateMemberBadge,
    deleteMemberBadge,
    isLoaded,
    isLoading,
    isSaving,
    error,
    configWarning,
    isSupabaseEnabled,
  } = useMemberBadges();

  const badges = getBadges(memberId);
  const [newName, setNewName] = useState("");
  const [newNote, setNewNote] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editNote, setEditNote] = useState("");
  const [editDate, setEditDate] = useState("");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newName.trim();
    if (!trimmed || isSaving) return;

    try {
      await addMemberBadge(memberId, {
        name: trimmed,
        note: newNote.trim() || undefined,
      });
      setNewName("");
      setNewNote("");
    } catch {
      // error state handled by hook
    }
  };

  const startEdit = (badge: { id: string; name: string; note?: string; date?: string }) => {
    setEditingId(badge.id);
    setEditName(badge.name);
    setEditNote(badge.note ?? "");
    setEditDate(badge.date ?? "");
  };

  const saveEdit = async () => {
    if (!editingId || !editName.trim() || isSaving) return;

    try {
      await updateMemberBadge(memberId, editingId, {
        name: editName.trim(),
        note: editNote.trim() || undefined,
        date: editDate || undefined,
      });
      setEditingId(null);
    } catch {
      // error state handled by hook
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditNote("");
    setEditDate("");
  };

  const handleDelete = async (badgeId: string, badgeName: string) => {
    if (!window.confirm(`Supprimer le badge « ${badgeName} » de ${memberName} ?`)) return;

    try {
      await deleteMemberBadge(memberId, badgeId);
      if (editingId === badgeId) cancelEdit();
    } catch {
      // error state handled by hook
    }
  };

  if (!isLoaded || isLoading) {
    return (
      <div className="card-base animate-pulse p-8 text-center text-sm text-gray-400">
        Chargement des badges...
      </div>
    );
  }

  return (
    <section className="card-base">
      <div className="mb-6 flex items-start gap-3 border-b border-gray-100 pb-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-scout-gold/15">
          <Award className="h-5 w-5 text-scout-gold" />
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold text-scout-charcoal">
            Badges validés
          </h3>
          <p className="mt-0.5 text-sm text-gray-500">
            Saisie manuelle ·{" "}
            {isSupabaseEnabled
              ? `synchronisé en ligne pour ${memberName}`
              : `sauvegardé localement pour ${memberName}`}
          </p>
        </div>
      </div>

      {configWarning && (
        <div className="mb-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <CloudOff className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{configWarning}</p>
        </div>
      )}

      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p>{error.message}</p>
            {error.detail && (
              <p className="mt-1 text-xs text-red-600/90">Détail : {error.detail}</p>
            )}
          </div>
        </div>
      )}

      {badges.length === 0 ? (
        <EmptyState
          icon={Award}
          title="Ce membre n'a pas encore de badges validés."
          description="Ajoutez un badge ci-dessous pour commencer le suivi."
        />
      ) : (
        <ul className="mb-6 space-y-2">
          {badges.map((badge) =>
            editingId === badge.id ? (
              <li
                key={badge.id}
                className="rounded-xl border border-scout-green/20 bg-scout-cream p-4"
              >
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="input-field"
                    placeholder="Nom du badge"
                    disabled={isSaving}
                  />
                  <input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="input-field"
                    disabled={isSaving}
                  />
                  <input
                    type="text"
                    value={editNote}
                    onChange={(e) => setEditNote(e.target.value)}
                    className="input-field"
                    placeholder="Note (optionnel)"
                    disabled={isSaving}
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => void saveEdit()}
                      disabled={isSaving}
                      className="btn-primary py-2 text-xs disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Check className="h-3.5 w-3.5" />
                      {isSaving ? "Enregistrement..." : "Enregistrer"}
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      disabled={isSaving}
                      className="btn-secondary py-2 text-xs disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <X className="h-3.5 w-3.5" />
                      Annuler
                    </button>
                  </div>
                </div>
              </li>
            ) : (
              <li
                key={badge.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-100 bg-scout-cream/60 px-4 py-3 transition-colors hover:border-scout-gold/30"
              >
                <div className="min-w-0 flex-1">
                  <span className="inline-flex items-center rounded-full border border-scout-gold/25 bg-scout-gold/10 px-3.5 py-1 text-sm font-semibold text-amber-900">
                    {badge.name}
                  </span>
                  {badge.date && (
                    <p className="mt-1.5 text-xs text-gray-500">{formatDate(badge.date)}</p>
                  )}
                  {badge.note && (
                    <p className="mt-0.5 text-xs italic text-gray-400">{badge.note}</p>
                  )}
                </div>
                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    onClick={() => startEdit(badge)}
                    disabled={isSaving}
                    className="inline-flex items-center gap-1 rounded-lg px-2.5 py-2 text-xs font-medium text-scout-forest hover:bg-scout-forest/5 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Modifier
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDelete(badge.id, badge.name)}
                    disabled={isSaving}
                    className="inline-flex items-center gap-1 rounded-lg px-2.5 py-2 text-xs font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Supprimer
                  </button>
                </div>
              </li>
            )
          )}
        </ul>
      )}

      <form onSubmit={(e) => void handleAdd(e)} className="space-y-3 rounded-xl border border-dashed border-gray-200 bg-white p-4">
        <p className="text-sm font-semibold text-scout-charcoal">Ajouter un badge</p>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Écrire le nom du badge…"
          className="input-field"
          disabled={isSaving}
        />
        <input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Note (optionnel)"
          className="input-field"
          disabled={isSaving}
        />
        <button
          type="submit"
          disabled={!newName.trim() || isSaving}
          className="btn-primary w-full sm:w-auto disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          {isSaving ? "Enregistrement..." : "Ajouter"}
        </button>
      </form>
    </section>
  );
}
