/**
 * ============================================================================
 * TROUPE ALPHA — FICHIER DE DONNÉES PRINCIPAL
 * ============================================================================
 *
 * Patrouilles et membres : modifiez ce fichier.
 * Badges éditables : page /gestion-badges (localStorage).
 *
 * ── MODIFIER PLUS TARD ──────────────────────────────────────────────────────
 *
 * 1. PROGRESSION D'UN MEMBRE
 *    - Trouvez le membre dans `rawMembers` ou le résultat dans `members`
 *    - Modifiez `progressionCategories` : status =
 *      "Non commencé" | "En cours" | "Validé"
 *    - Ajoutez `validatedDate: "YYYY-MM-DD"` si Validé
 *
 * 2. BADGES D'UN MEMBRE (quand vous serez prêt)
 *    - badges: [{ badgeId: "orientation", status: "completed", completedDate: "2025-03-15" }]
 *    - badges en cours: { badgeId: "...", status: "inProgress" }
 *
 * 3. BADGES PRÉFÉRÉS
 *    - favoriteBadgeIds: ["orientation", "campisme"]
 *
 * 4. NOTES — modifiez le champ `notes`
 * 5. DERNIÈRE MISE À JOUR — modifiez `lastUpdate`
 *
 * ============================================================================
 */

import type {
  BadgeDefinition,
  Member,
  MemberRole,
  Patrol,
  ProgressionCategory,
  TroupeData,
} from "@/src/types";
import { slugify } from "@/src/lib/utils";

export const patrols: Patrol[] = [
  {
    id: "loup",
    name: "Loup",
    color: "#374151",
    colorLight: "#6b7280",
    colorDark: "#111827",
    description: "Patrouille du Loup — force, endurance et esprit de meute.",
  },
  {
    id: "hyene",
    name: "Hyène",
    color: "#ca8a04",
    colorLight: "#facc15",
    colorDark: "#854d0e",
    description: "Patrouille de l'Hyène — agilité, ruse et bonne humeur.",
  },
  {
    id: "serpent",
    name: "Serpent",
    color: "#dc2626",
    colorLight: "#f87171",
    colorDark: "#991b1b",
    description: "Patrouille du Serpent — discrétion, stratégie et détermination.",
  },
  {
    id: "requin",
    name: "Requin",
    color: "#2563eb",
    colorLight: "#60a5fa",
    colorDark: "#1e40af",
    description: "Patrouille du Requin — audace, leadership et esprit d'équipe.",
  },
  {
    id: "aigle",
    name: "Aigle",
    color: "#16a34a",
    colorLight: "#4ade80",
    colorDark: "#15803d",
    description: "Patrouille de l'Aigle — vision, autonomie et hauteur de vue.",
  },
];

export const badgeDefinitions: BadgeDefinition[] = [
  {
    id: "orientation",
    name: "Badge Orientation",
    icon: "Compass",
    description: "Maîtriser la lecture de carte, la boussole et l'orientation en nature.",
    category: "Orientation",
    difficulty: "Moyen",
    color: "#2563eb",
    requirements: "Réussir 3 parcours d'orientation et lire une carte IGN.",
  },
  {
    id: "secourisme",
    name: "Badge Secourisme",
    icon: "HeartPulse",
    description: "Apprendre les gestes de premiers secours et la sécurité en camp.",
    category: "Secourisme",
    difficulty: "Difficile",
    color: "#dc2626",
    requirements: "Valider les gestes PSE1 et participer à une mise en situation.",
  },
  {
    id: "campisme",
    name: "Badge Campisme",
    icon: "Tent",
    description: "Monter un camp, installer une tente et vivre en pleine nature.",
    category: "Campisme",
    difficulty: "Moyen",
    color: "#16a34a",
    requirements: "Participer à 2 camps et monter une tente seul.",
  },
  {
    id: "cuisine",
    name: "Badge Cuisine",
    icon: "ChefHat",
    description: "Préparer des repas en camp et connaître les règles d'hygiène.",
    category: "Campisme",
    difficulty: "Facile",
    color: "#ca8a04",
    requirements: "Préparer un repas complet pour la patrouille en camp.",
  },
  {
    id: "feu",
    name: "Badge Feu",
    icon: "Flame",
    description: "Allumer un feu en toute sécurité et le maîtriser.",
    category: "Technique",
    difficulty: "Moyen",
    color: "#ea580c",
    requirements: "Allumer un feu sans allumettes et respecter les consignes de sécurité.",
  },
  {
    id: "noeuds",
    name: "Badge Nœuds",
    icon: "Link",
    description: "Connaître et réaliser les nœuds scouts essentiels.",
    category: "Technique",
    difficulty: "Facile",
    color: "#7c3aed",
    requirements: "Maîtriser au moins 8 nœuds scouts courants.",
  },
  {
    id: "froissartage",
    name: "Badge Froissartage",
    icon: "Hammer",
    description: "Construire des structures en bois avec la technique du froissartage.",
    category: "Technique",
    difficulty: "Difficile",
    color: "#92400e",
    requirements: "Construire une structure utilitaire en froissartage en camp.",
  },
  {
    id: "nature",
    name: "Badge Nature",
    icon: "Leaf",
    description: "Observer la faune, la flore et respecter l'environnement.",
    category: "Nature",
    difficulty: "Facile",
    color: "#15803d",
    requirements: "Identifier 10 espèces locales et participer à une action écologique.",
  },
  {
    id: "service",
    name: "Badge Service",
    icon: "HandHeart",
    description: "Participer à des actions de service et d'entraide.",
    category: "Service",
    difficulty: "Moyen",
    color: "#0891b2",
    requirements: "Réaliser 3 actions de service au profit de la communauté.",
  },
  {
    id: "leadership",
    name: "Badge Leadership",
    icon: "Crown",
    description: "Encadrer une activité et guider les plus jeunes.",
    category: "Leadership",
    difficulty: "Difficile",
    color: "#b45309",
    requirements: "Animer une activité de patrouille et encadrer les plus jeunes.",
  },
  {
    id: "sport",
    name: "Badge Sport",
    icon: "Medal",
    description: "Développer l'endurance, la force et l'esprit sportif.",
    category: "Sport",
    difficulty: "Moyen",
    color: "#be185d",
    requirements: "Participer aux activités sportives et valider les épreuves de la troupe.",
  },
  {
    id: "communication",
    name: "Badge Communication",
    icon: "MessageCircle",
    description: "S'exprimer clairement et animer des discussions de patrouille.",
    category: "Communication",
    difficulty: "Facile",
    color: "#4f46e5",
    requirements: "Animer un conseil de patrouille et présenter un sujet devant la troupe.",
  },
];

const CATEGORY_TEMPLATES: { id: string; name: string; description: string }[] = [
  { id: "promesse", name: "Promesse", description: "Découvrir et vivre la promesse scoute." },
  { id: "vie-patrouille", name: "Vie de patrouille", description: "Participation active aux activités de patrouille." },
  { id: "techniques-scouts", name: "Techniques scouts", description: "Maîtrise des techniques de base du scoutisme." },
  { id: "orientation", name: "Orientation", description: "Compétences en cartographie et boussole." },
  { id: "secourisme", name: "Secourisme", description: "Gestes de premiers secours et prévention." },
  { id: "campisme", name: "Campisme", description: "Organisation et vie en camp." },
  { id: "feu-cuisine", name: "Feu et cuisine", description: "Allumage du feu et préparation des repas." },
  { id: "noeuds-froissartage", name: "Nœuds et froissartage", description: "Nœuds scouts et constructions en bois." },
  { id: "service", name: "Service", description: "Actions de service envers les autres." },
  { id: "esprit-scout", name: "Esprit scout", description: "Vivre les valeurs et la loi scoute au quotidien." },
];

export function createDefaultProgression(): ProgressionCategory[] {
  return CATEGORY_TEMPLATES.map((cat) => ({
    ...cat,
    status: "Non commencé",
  }));
}

interface RawMember {
  fullName: string;
  patrolId: Member["patrolId"];
  role: MemberRole;
  notes?: string;
}

function buildMember(raw: RawMember): Member {
  const parts = raw.fullName.split(" ");
  const firstName = parts[0];
  const lastName = parts.slice(1).join(" ");

  return {
    id: slugify(raw.fullName),
    firstName,
    lastName,
    fullName: raw.fullName,
    patrolId: raw.patrolId,
    role: raw.role,
    progressionCategories: createDefaultProgression(),
    notes: raw.notes ?? "",
    lastUpdate: "2025-07-05",
  };
}

const rawMembers: RawMember[] = [
  // PATROUILLE LOUP
  { fullName: "Antonio Nohra", patrolId: "loup", role: "CP" },
  { fullName: "Daniel Chlela", patrolId: "loup", role: "Membre" },
  { fullName: "Jad Samarany", patrolId: "loup", role: "Membre" },
  { fullName: "Charbel Tarraf", patrolId: "loup", role: "Membre" },
  { fullName: "Ryan Nesrallah", patrolId: "loup", role: "Membre" },
  { fullName: "François Hanna", patrolId: "loup", role: "Membre" },
  { fullName: "Richy Germanos", patrolId: "loup", role: "Membre" },
  { fullName: "James Zeeny", patrolId: "loup", role: "SP" },
  // PATROUILLE HYÈNE
  { fullName: "Elias Tabet", patrolId: "hyene", role: "CP" },
  { fullName: "Peter Chahine", patrolId: "hyene", role: "Membre" },
  { fullName: "Christopher Abi Rached", patrolId: "hyene", role: "Membre" },
  { fullName: "Charbel Nassar", patrolId: "hyene", role: "Membre" },
  { fullName: "Joe-Philippe Bassil", patrolId: "hyene", role: "Membre" },
  { fullName: "Bendy Ouwainy", patrolId: "hyene", role: "Membre" },
  { fullName: "Nicolas Nasrallah", patrolId: "hyene", role: "Membre" },
  { fullName: "Elie Chlela", patrolId: "hyene", role: "SP" },
  // PATROUILLE SERPENT
  { fullName: "Pio Salem", patrolId: "serpent", role: "CP" },
  { fullName: "Martin Bassil", patrolId: "serpent", role: "Membre" },
  { fullName: "Elio Karam", patrolId: "serpent", role: "Membre" },
  { fullName: "Charbel Chahine", patrolId: "serpent", role: "Membre" },
  { fullName: "Joe Nahry", patrolId: "serpent", role: "Membre" },
  { fullName: "Salim Maalouf", patrolId: "serpent", role: "SP" },
  // PATROUILLE REQUIN
  { fullName: "Charbel Khalife", patrolId: "requin", role: "CP" },
  { fullName: "Georgio Saade", patrolId: "requin", role: "Membre" },
  { fullName: "Raymond Aawad", patrolId: "requin", role: "Membre" },
  { fullName: "Edwin Sabagha", patrolId: "requin", role: "Membre" },
  { fullName: "Maroun Tannous", patrolId: "requin", role: "Membre" },
  { fullName: "Tony Kamel", patrolId: "requin", role: "Membre" },
  { fullName: "Thomas Abdallah", patrolId: "requin", role: "Membre" },
  { fullName: "Etienne El Aalam", patrolId: "requin", role: "SP" },
  // PATROUILLE AIGLE
  { fullName: "Yvan Rizk", patrolId: "aigle", role: "CP" },
  { fullName: "Youssef Antoun", patrolId: "aigle", role: "Membre" },
  { fullName: "Etief Khoury", patrolId: "aigle", role: "Membre" },
  { fullName: "Christopher Moufarej", patrolId: "aigle", role: "Membre" },
  { fullName: "Antonio Bassil", patrolId: "aigle", role: "Membre" },
  { fullName: "Johnny Fajloun", patrolId: "aigle", role: "SP" },
];

export const members: Member[] = rawMembers.map(buildMember);

export const troupeData: TroupeData = {
  patrols,
  members,
  badgeDefinitions,
};

export function getPatrolById(id: string) {
  return patrols.find((p) => p.id === id);
}

export function getBadgeById(id: string) {
  return badgeDefinitions.find((b) => b.id === id);
}

export function getCPForPatrol(patrolId: Member["patrolId"]): Member | undefined {
  return members.find((m) => m.patrolId === patrolId && m.role === "CP");
}

export function getSPForPatrol(patrolId: Member["patrolId"]): Member | undefined {
  return members.find((m) => m.patrolId === patrolId && m.role === "SP");
}

export function getAllCP(): Member[] {
  return members.filter((m) => m.role === "CP");
}

export function getAllSP(): Member[] {
  return members.filter((m) => m.role === "SP");
}
