export type PatrolId = "loup" | "hyene" | "serpent" | "requin" | "aigle";

export type MemberRole = "CP" | "SP" | "Membre";

export type ProgressionStatus = "Non commencé" | "En cours" | "Validé";

export type BadgeDifficulty = "Facile" | "Moyen" | "Difficile";

export type RoleFilter = "tous" | "CP" | "SP" | "Membre";

export interface Patrol {
  id: PatrolId;
  name: string;
  color: string;
  colorLight: string;
  colorDark: string;
  description: string;
}

export interface ProgressionCategory {
  id: string;
  name: string;
  status: ProgressionStatus;
  description: string;
  validatedDate?: string;
}

export interface BadgeDefinition {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: string;
  difficulty: BadgeDifficulty;
  color: string;
  requirements: string;
}

/** Badge validé manuellement pour un membre (localStorage) */
export interface MemberManualBadge {
  id: string;
  name: string;
  note?: string;
  date?: string;
}

export type MemberBadgesStore = Record<string, MemberManualBadge[]>;

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  patrolId: PatrolId;
  role: MemberRole;
  progressionCategories: ProgressionCategory[];
  notes: string;
  lastUpdate: string;
}

export interface TroupeData {
  patrols: Patrol[];
  members: Member[];
  badgeDefinitions: BadgeDefinition[];
}

export type BadgeFormData = Omit<BadgeDefinition, "id">;
