/** XP thresholds and level calculation constants */
export const XP_PER_LEVEL_BASE = 100; // XP needed for level 2

/** Level formula: level = floor(sqrt(totalXP / 100)) + 1 */
export function calculateLevel(totalXp: number): number {
  return Math.max(1, Math.floor(Math.sqrt(totalXp / XP_PER_LEVEL_BASE)) + 1);
}

/** XP required to reach a given level */
export function xpForLevel(level: number): number {
  return Math.pow(level - 1, 2) * XP_PER_LEVEL_BASE;
}

/** XP required to reach the next level from current total */
export function xpToNextLevel(totalXp: number): {
  currentLevel: number;
  currentLevelXp: number;
  nextLevelXp: number;
  progressXp: number;
  progressPercent: number;
} {
  const currentLevel = calculateLevel(totalXp);
  const currentLevelXp = xpForLevel(currentLevel);
  const nextLevelXp = xpForLevel(currentLevel + 1);
  const progressXp = totalXp - currentLevelXp;
  const neededXp = nextLevelXp - currentLevelXp;
  const progressPercent = neededXp > 0 ? (progressXp / neededXp) * 100 : 100;

  return { currentLevel, currentLevelXp, nextLevelXp, progressXp, progressPercent };
}

/** Mastery labels based on score 0-100 */
export type MasteryLabel = "Anfänger" | "Solide" | "Sicher" | "Sehr sicher" | "Meisterhaft";

export function getMasteryLabel(score: number): MasteryLabel {
  if (score >= 90) return "Meisterhaft";
  if (score >= 75) return "Sehr sicher";
  if (score >= 55) return "Sicher";
  if (score >= 30) return "Solide";
  return "Anfänger";
}

export function getMasteryColor(score: number): string {
  if (score >= 90) return "text-yellow-500";
  if (score >= 75) return "text-brand-green-500";
  if (score >= 55) return "text-blue-500";
  if (score >= 30) return "text-orange-500";
  return "text-gray-400";
}

export function getMasteryBgColor(score: number): string {
  if (score >= 90) return "bg-yellow-100";
  if (score >= 75) return "bg-green-100";
  if (score >= 55) return "bg-blue-100";
  if (score >= 30) return "bg-orange-100";
  return "bg-gray-100";
}

/** Daily goal options in minutes */
export const DAILY_GOAL_OPTIONS = [5, 10, 15, 20] as const;

/** XP rewards */
export const XP_REWARDS = {
  CORRECT_ANSWER: 5,
  CORRECT_ANSWER_HARD: 10,
  LESSON_COMPLETE: 15,
  CHAPTER_TEST_PASS: 50,
  CHAPTER_COMPLETE: 100,
  STREAK_BONUS_3: 20,
  STREAK_BONUS_7: 50,
  STREAK_BONUS_30: 200,
  REVIEW_CORRECT: 3,
} as const;

/** App routes */
export const ROUTES = {
  LOGIN: "/login",
  RESET_PASSWORD: "/reset-password",
  SET_PASSWORD: "/set-password",
  DASHBOARD: "/dashboard",
  LEARN: "/learn",
  REVIEW: "/review",
  PROGRESS: "/progress",
  PROFILE: "/profile",
  ADMIN: "/admin",
  ADMIN_USERS: "/admin/users",
  ADMIN_CONTENT: "/admin/content",
  ADMIN_ANALYTICS: "/admin/analytics",
} as const;

/** Topic slugs matching the handbook */
export const TOPIC_SLUGS = [
  "workflow",
  "check-in",
  "beratungsterminal",
  "remote-refraktion",
  "remote-optiker",
  "fehlsichtigkeiten",
  "korrektionsglaeser",
  "presbyopie",
  "brillenpass",
  "versorgungsmoeglichkeiten",
  "zentrierung",
  "upgrades",
  "beschichtungen",
  "toenungen",
  "glasindex",
  "fassungsarten",
  "gravuren",
  "durchmesserschablone",
  "werkstatt",
  "anpassung",
  "reklamation",
  "nachbestellung",
] as const;
