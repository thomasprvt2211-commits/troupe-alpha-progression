"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CheckCircle2,
  Clock,
  Circle,
  StickyNote,
} from "lucide-react";
import type { Member, Patrol, ProgressionStatus } from "@/src/types";
import { countValidatedCategories } from "@/src/lib/utils";
import MemberProfileHeader from "@/components/MemberProfileHeader";
import MemberBadgeEditor from "@/components/MemberBadgeEditor";

interface MemberDetailModalProps {
  member: Member | null;
  patrol: Patrol | undefined;
  onClose: () => void;
}

const statusIcons = {
  Validé: CheckCircle2,
  "En cours": Clock,
  "Non commencé": Circle,
};

const statusColors: Record<ProgressionStatus, string> = {
  Validé: "text-green-700 bg-green-50 border-green-100",
  "En cours": "text-amber-700 bg-amber-50 border-amber-100",
  "Non commencé": "text-gray-500 bg-gray-50 border-gray-100",
};

export default function MemberDetailModal({
  member,
  patrol,
  onClose,
}: MemberDetailModalProps) {
  if (!member) return null;

  const validatedCount = countValidatedCategories(member);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end justify-center bg-scout-charcoal/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ type: "spring", damping: 28, stiffness: 320 }}
          className="relative max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-scout-sand sm:rounded-3xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 z-10 flex justify-end bg-scout-sand/90 p-3 backdrop-blur-md sm:absolute sm:right-3 sm:top-3 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 bg-white p-2 text-gray-400 shadow-sm hover:text-gray-600"
              aria-label="Fermer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-5 p-4 sm:p-6">
            <MemberProfileHeader member={member} patrol={patrol} />
            <MemberBadgeEditor memberId={member.id} memberName={member.fullName} />

            <section className="card-base">
              <h3 className="mb-4 font-display text-lg font-semibold text-scout-charcoal">
                Étapes de progression
              </h3>
              <div className="space-y-2">
                {member.progressionCategories.map((cat) => {
                  const Icon = statusIcons[cat.status];
                  return (
                    <div
                      key={cat.id}
                      className={`flex items-center gap-3 rounded-xl border p-3 ${statusColors[cat.status]}`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{cat.name}</p>
                      </div>
                      <span className="badge-pill shrink-0 bg-white/60">
                        {cat.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>

            {member.notes && (
              <section className="card-base">
                <h3 className="mb-3 flex items-center gap-2 font-display font-semibold text-scout-charcoal">
                  <StickyNote className="h-5 w-5 text-gray-400" />
                  Notes du chef
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">{member.notes}</p>
              </section>
            )}

            <div className="rounded-xl border border-scout-green/20 bg-scout-green/5 py-3 text-center text-sm font-medium text-scout-forest">
              {validatedCount}/{member.progressionCategories.length} catégories validées
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
