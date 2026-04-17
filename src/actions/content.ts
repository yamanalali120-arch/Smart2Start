"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * Get all chapters with their progress for the current user
 */
export async function getChaptersWithProgress() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Nicht authentifiziert.", data: null };

  // Get chapters
  const { data: chapters, error } = await supabase
    .from("chapters")
    .select("*")
    .eq("is_published", true)
    .order("sort_order");

  if (error) return { error: error.message, data: null };

  // Get user chapter progress
  const { data: progressData } = await supabase
    .from("user_chapter_progress")
    .select("*")
    .eq("user_id", user.id);

  // Get lesson counts per chapter
  const { data: lessonCounts } = await supabase
    .from("lessons")
    .select("chapter_id")
    .eq("is_published", true);

  // Get completed lessons per chapter
  const { data: completedLessons } = await supabase
    .from("user_lesson_progress")
    .select("chapter_id")
    .eq("user_id", user.id)
    .eq("status", "completed");

  const progressMap = new Map((progressData || []).map((p) => [p.chapter_id, p]));
  const lessonCountMap = new Map<string, number>();
  const completedMap = new Map<string, number>();

  (lessonCounts || []).forEach((l) => {
    lessonCountMap.set(l.chapter_id, (lessonCountMap.get(l.chapter_id) || 0) + 1);
  });

  (completedLessons || []).forEach((l) => {
    completedMap.set(l.chapter_id, (completedMap.get(l.chapter_id) || 0) + 1);
  });

  const chaptersWithProgress = (chapters || []).map((chapter) => ({
    ...chapter,
    progress: progressMap.get(chapter.id) || null,
    lessons_count: lessonCountMap.get(chapter.id) || 0,
    completed_lessons: completedMap.get(chapter.id) || 0,
    topics: [],
  }));

  return { error: null, data: chaptersWithProgress };
}

/**
 * Get lessons for a chapter with progress
 */
export async function getChapterLessons(chapterSlug: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Nicht authentifiziert.", data: null, chapter: null };

  // Get chapter
  const { data: chapter } = await supabase
    .from("chapters")
    .select("*")
    .eq("slug", chapterSlug)
    .single();

  if (!chapter) return { error: "Kapitel nicht gefunden.", data: null, chapter: null };

  // Get lessons
  const { data: lessons } = await supabase
    .from("lessons")
    .select("*")
    .eq("chapter_id", chapter.id)
    .eq("is_published", true)
    .order("sort_order");

  // Get progress for each lesson
  const { data: progressData } = await supabase
    .from("user_lesson_progress")
    .select("*")
    .eq("user_id", user.id)
    .eq("chapter_id", chapter.id);

  const progressMap = new Map((progressData || []).map((p) => [p.lesson_id, p]));

  const lessonsWithProgress = (lessons || []).map((lesson) => ({
    ...lesson,
    progress: progressMap.get(lesson.id) || null,
    content_blocks: [],
    questions_count: 0,
  }));

  return { error: null, data: lessonsWithProgress, chapter };
}

/**
 * Get lesson content and questions
 */
export async function getLessonContent(chapterSlug: string, lessonSlug: string) {
  const supabase = await createClient();

  // Get chapter
  const { data: chapter } = await supabase
    .from("chapters")
    .select("*")
    .eq("slug", chapterSlug)
    .single();

  if (!chapter) return { error: "Kapitel nicht gefunden.", data: null };

  // Get lesson
  const { data: lesson } = await supabase
    .from("lessons")
    .select("*")
    .eq("chapter_id", chapter.id)
    .eq("slug", lessonSlug)
    .single();

  if (!lesson) return { error: "Lektion nicht gefunden.", data: null };

  // Get content blocks
  const { data: contentBlocks } = await supabase
    .from("lesson_content_blocks")
    .select("*")
    .eq("lesson_id", lesson.id)
    .order("sort_order");

  // Get questions
  const { data: questions } = await supabase
    .from("questions")
    .select("*")
    .eq("lesson_id", lesson.id)
    .eq("is_published", true)
    .order("sort_order");

  return {
    error: null,
    data: {
      chapter,
      lesson,
      contentBlocks: contentBlocks || [],
      questions: questions || [],
    },
  };
}
