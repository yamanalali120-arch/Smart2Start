"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Update lesson progress when a user starts or completes a lesson
 */
export async function updateLessonProgress(
  lessonId: string,
  chapterId: string,
  status: "in_progress" | "completed",
  score?: number,
  xpEarned?: number
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Nicht authentifiziert." };

  const now = new Date().toISOString();

  const updateData: Record<string, unknown> = {
    user_id: user.id,
    lesson_id: lessonId,
    chapter_id: chapterId,
    status,
    last_accessed_at: now,
  };

  if (status === "in_progress") {
    updateData.started_at = now;
  }

  if (status === "completed") {
    updateData.completed_at = now;
    if (score !== undefined) updateData.score = score;
    if (xpEarned !== undefined) updateData.xp_earned = xpEarned;
  }

  const { error } = await supabase
    .from("user_lesson_progress")
    .upsert(updateData, { onConflict: "user_id,lesson_id" });

  if (error) return { error: error.message };

  // Update best_score if applicable
  if (score !== undefined) {
    await supabase.rpc("update_best_score_if_higher", {
      p_user_id: user.id,
      p_lesson_id: lessonId,
      p_score: score,
    });
  }

  // Update chapter progress
  await recalculateChapterProgress(user.id, chapterId);

  // Add XP
  if (xpEarned && xpEarned > 0) {
    await supabase.rpc("add_xp", { p_user_id: user.id, p_xp: xpEarned });
  }

  // Update streak
  await supabase.rpc("update_streak", { p_user_id: user.id });

  revalidatePath("/dashboard");
  revalidatePath("/learn");

  return { success: true };
}

/**
 * Recalculate chapter progress based on lesson completions
 */
async function recalculateChapterProgress(userId: string, chapterId: string) {
  const supabase = await createClient();

  // Count total and completed lessons
  const { data: lessons } = await supabase
    .from("lessons")
    .select("id")
    .eq("chapter_id", chapterId)
    .eq("is_published", true);

  if (!lessons) return;

  const { data: completedLessons } = await supabase
    .from("user_lesson_progress")
    .select("id")
    .eq("user_id", userId)
    .eq("chapter_id", chapterId)
    .eq("status", "completed");

  const totalCount = lessons.length;
  const completedCount = completedLessons?.length || 0;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  let status: "available" | "in_progress" | "completed" = "available";
  if (completedCount > 0 && completedCount < totalCount) status = "in_progress";
  if (completedCount >= totalCount) status = "completed";

  const updateData: Record<string, unknown> = {
    user_id: userId,
    chapter_id: chapterId,
    status,
    progress_percent: progressPercent,
  };

  if (status === "in_progress" || status === "completed") {
    updateData.started_at = new Date().toISOString();
  }
  if (status === "completed") {
    updateData.completed_at = new Date().toISOString();
  }

  await supabase
    .from("user_chapter_progress")
    .upsert(updateData, { onConflict: "user_id,chapter_id" });

  // If chapter completed, unlock next chapter
  if (status === "completed") {
    const { data: nextChapters } = await supabase
      .from("chapters")
      .select("id")
      .eq("required_chapter_id", chapterId);

    if (nextChapters) {
      for (const next of nextChapters) {
        await supabase
          .from("user_chapter_progress")
          .upsert(
            { user_id: userId, chapter_id: next.id, status: "available" },
            { onConflict: "user_id,chapter_id" }
          );
      }
    }
  }
}
