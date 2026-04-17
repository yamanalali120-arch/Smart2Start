/**
 * XP & Level calculation utilities
 * Level formula: level = floor(sqrt(totalXP / 100)) + 1
 * This gives a satisfying curve where early levels come fast
 * but later levels require more XP.
 */

import { XP_PER_LEVEL_BASE } from "./constants";

export interface LevelInfo {
  level: number;
  totalXp: number;
  xpInCurrentLevel: number;
  xpNeededForNextLevel: number;
  percentToNextLevel: number;
}

export function getLevelInfo(totalXp: number): LevelInfo {
  const level = Math.max(1, Math.floor(Math.sqrt(totalXp / XP_PER_LEVEL_BASE)) + 1);
  const currentLevelStartXp = Math.pow(level - 1, 2) * XP_PER_LEVEL_BASE;
  const nextLevelStartXp = Math.pow(level, 2) * XP_PER_LEVEL_BASE;
  const xpInCurrentLevel = totalXp - currentLevelStartXp;
  const xpNeededForNextLevel = nextLevelStartXp - currentLevelStartXp;
  const percentToNextLevel =
    xpNeededForNextLevel > 0 ? Math.min(100, (xpInCurrentLevel / xpNeededForNextLevel) * 100) : 100;

  return {
    level,
    totalXp,
    xpInCurrentLevel,
    xpNeededForNextLevel,
    percentToNextLevel,
  };
}

/**
 * Calculate XP reward based on question difficulty and correctness
 */
export function calculateQuestionXp(
  difficulty: "easy" | "medium" | "hard",
  isCorrect: boolean,
  isReview: boolean = false
): number {
  if (!isCorrect) return 0;
  if (isReview) return 3;

  switch (difficulty) {
    case "easy":
      return 3;
    case "medium":
      return 5;
    case "hard":
      return 10;
    default:
      return 5;
  }
}
