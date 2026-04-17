"use server";

import { createClient } from "@/lib/supabase/server";
import { calculateSrsUpdate } from "@/lib/spaced-repetition";
import type { SrsStatus } from "@/types/database";

/**
 * Get items due for review
 */
export async function getReviewQueue(limit: number = 20) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Nicht authentifiziert.", data: null };

  const { data, error } = await supabase
    .from("review_queue")
    .select("*, question:questions(*)")
    .eq("user_id", user.id)
    .lte("next_review_at", new Date().toISOString())
    .neq("srs_status", "mastered")
    .order("next_review_at")
    .limit(limit);

  if (error) return { error: error.message, data: null };
  return { error: null, data };
}

/**
 * Update review queue item after answering
 */
export async function updateReviewItem(
  reviewId: string,
  questionId: string,
  isCorrect: boolean,
  currentStatus: SrsStatus,
  currentEaseFactor: number,
  currentInterval: number,
  currentRepetitions: number,
  consecutiveCorrect: number,
  consecutiveIncorrect: number
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Nicht authentifiziert." };

  const update = calculateSrsUpdate(
    isCorrect,
    currentStatus,
    currentEaseFactor,
    currentInterval,
    currentRepetitions,
    consecutiveCorrect,
    consecutiveIncorrect
  );

  const { error } = await supabase
    .from("review_queue")
    .update({
      srs_status: update.newStatus,
      ease_factor: update.newEaseFactor,
      interval_days: update.newInterval,
      repetitions: update.newRepetitions,
      next_review_at: update.nextReviewAt.toISOString(),
      last_reviewed_at: new Date().toISOString(),
      consecutive_correct: update.consecutiveCorrect,
      consecutive_incorrect: update.consecutiveIncorrect,
    })
    .eq("id", reviewId);

  if (error) return { error: error.message };

  // Add review XP
  if (isCorrect) {
    await supabase.rpc("add_xp", { p_user_id: user.id, p_xp: 3 });
  }

  return { success: true };
}

/**
 * Get review queue count
 */
export async function getReviewCount() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return 0;

  const { count } = await supabase
    .from("review_queue")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .lte("next_review_at", new Date().toISOString())
    .neq("srs_status", "mastered");

  return count || 0;
}
