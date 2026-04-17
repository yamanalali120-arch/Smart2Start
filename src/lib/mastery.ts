/**
 * Mastery calculation utilities
 * Mastery is calculated per-topic based on:
 * - Overall correct rate (70% weight)
 * - Recent performance (last 10 answers, 20% weight)
 * - Volume of practice (10% weight, capped at 20 questions)
 */

import { getMasteryLabel, type MasteryLabel } from "./constants";

export interface MasteryCalculation {
  score: number;
  label: MasteryLabel;
  totalSeen: number;
  totalCorrect: number;
  recentCorrectRate: number;
}

export function calculateMastery(
  totalSeen: number,
  totalCorrect: number,
  recentCorrect: number, // out of last 10
  recentTotal: number    // how many recent answers we have (max 10)
): MasteryCalculation {
  if (totalSeen === 0) {
    return {
      score: 0,
      label: "Anfänger",
      totalSeen: 0,
      totalCorrect: 0,
      recentCorrectRate: 0,
    };
  }

  // Overall accuracy (70% weight)
  const overallRate = totalCorrect / totalSeen;

  // Recent accuracy (20% weight)
  const recentRate = recentTotal > 0 ? recentCorrect / recentTotal : 0;

  // Volume bonus (10% weight, max at 20 questions seen)
  const volumeBonus = Math.min(totalSeen, 20) / 20;

  const score = Math.min(100, Math.round(
    overallRate * 70 + recentRate * 20 + volumeBonus * 10
  ));

  return {
    score,
    label: getMasteryLabel(score),
    totalSeen,
    totalCorrect,
    recentCorrectRate: recentRate * 100,
  };
}
