"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Submit a single quiz answer
 */
export async function submitQuizAnswer(data: {
  questionId: string;
  lessonId: string;
  chapterId: string;
  topicId: string | null;
  userAnswer: unknown;
  isCorrect: boolean;
  xpEarned: number;
  timeSpentSeconds?: number;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Nicht authentifiziert." };

  // Insert quiz attempt
  const { error } = await supabase.from("quiz_attempts").insert({
    user_id: user.id,
    question_id: data.questionId,
    lesson_id: data.lessonId,
    chapter_id: data.chapterId,
    topic_id: data.topicId,
    user_answer: data.userAnswer as Record<string, unknown>,
    is_correct: data.isCorrect,
    xp_earned: data.xpEarned,
    time_spent_seconds: data.timeSpentSeconds || null,
  });

  if (error) return { error: error.message };

  // Add XP
  if (data.xpEarned > 0) {
    await supabase.rpc("add_xp", { p_user_id: user.id, p_xp: data.xpEarned });
  }

  // Update topic mastery
  if (data.topicId) {
    await supabase.rpc("recalculate_topic_mastery", {
      p_user_id: user.id,
      p_topic_id: data.topicId,
    });
  }

  // If incorrect, add to review queue
  if (!data.isCorrect) {
    await supabase.from("review_queue").upsert(
      {
        user_id: user.id,
        question_id: data.questionId,
        srs_status: "learning",
        next_review_at: new Date().toISOString(),
      },
      { onConflict: "user_id,question_id" }
    );
  }

  // Update daily activity
  const today = new Date().toISOString().split("T")[0];
  await supabase.rpc("increment_daily_activity", {
    p_user_id: user.id,
    p_date: today,
    p_xp: data.xpEarned,
    p_correct: data.isCorrect ? 1 : 0,
  });

  return { success: true };
}

/**
 * Get questions for a lesson quiz
 */
export async function getLessonQuestions(lessonId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .eq("lesson_id", lessonId)
    .eq("is_published", true)
    .order("sort_order");

  if (error) return { error: error.message, data: null };
  return { error: null, data };
}
