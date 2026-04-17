/**
 * Spaced Repetition System (SRS) - Simplified SM-2 variant
 *
 * States:
 * - new: Question never seen or just added to review
 * - learning: Currently being learned (short intervals)
 * - review: In regular review cycle
 * - mastered: Consistently correct, long intervals
 *
 * After correct answer: increase interval, move toward mastered
 * After incorrect answer: reset to learning, short interval
 */

import type { SrsStatus } from "@/types/database";

export interface SrsUpdate {
  newStatus: SrsStatus;
  newEaseFactor: number;
  newInterval: number;
  newRepetitions: number;
  nextReviewAt: Date;
  consecutiveCorrect: number;
  consecutiveIncorrect: number;
}

export function calculateSrsUpdate(
  isCorrect: boolean,
  currentStatus: SrsStatus,
  currentEaseFactor: number,
  currentInterval: number,
  currentRepetitions: number,
  consecutiveCorrect: number,
  consecutiveIncorrect: number
): SrsUpdate {
  let newStatus: SrsStatus = currentStatus;
  let newEaseFactor = currentEaseFactor;
  let newInterval = currentInterval;
  let newRepetitions = currentRepetitions;
  let newConsecutiveCorrect = consecutiveCorrect;
  let newConsecutiveIncorrect = consecutiveIncorrect;

  if (isCorrect) {
    newConsecutiveCorrect += 1;
    newConsecutiveIncorrect = 0;
    newRepetitions += 1;

    // Increase ease factor slightly
    newEaseFactor = Math.min(3.0, newEaseFactor + 0.1);

    switch (currentStatus) {
      case "new":
        newStatus = "learning";
        newInterval = 1; // Review tomorrow
        break;

      case "learning":
        if (newConsecutiveCorrect >= 2) {
          newStatus = "review";
          newInterval = 3; // 3 days
        } else {
          newInterval = 1;
        }
        break;

      case "review":
        if (newConsecutiveCorrect >= 5) {
          newStatus = "mastered";
          newInterval = Math.round(currentInterval * newEaseFactor);
        } else {
          newInterval = Math.round(currentInterval * newEaseFactor);
        }
        break;

      case "mastered":
        // Keep mastered, extend interval
        newInterval = Math.min(90, Math.round(currentInterval * newEaseFactor));
        break;
    }
  } else {
    // Incorrect answer
    newConsecutiveCorrect = 0;
    newConsecutiveIncorrect += 1;

    // Decrease ease factor
    newEaseFactor = Math.max(1.3, newEaseFactor - 0.2);

    if (currentStatus === "mastered" || currentStatus === "review") {
      newStatus = "learning";
      newInterval = 1;
      newRepetitions = 0;
    } else {
      newStatus = "learning";
      newInterval = 0; // Review today / immediately
    }
  }

  // Calculate next review date
  const nextReviewAt = new Date();
  nextReviewAt.setDate(nextReviewAt.getDate() + newInterval);
  // For interval 0, set to a few minutes from now
  if (newInterval === 0) {
    nextReviewAt.setMinutes(nextReviewAt.getMinutes() + 10);
  }

  return {
    newStatus,
    newEaseFactor,
    newInterval,
    newRepetitions,
    nextReviewAt,
    consecutiveCorrect: newConsecutiveCorrect,
    consecutiveIncorrect: newConsecutiveIncorrect,
  };
}

/**
 * Get the number of items due for review
 */
export function isDueForReview(nextReviewAt: string | Date): boolean {
  return new Date(nextReviewAt) <= new Date();
}
