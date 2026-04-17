"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/providers/auth-provider";
import type { UserChapterProgress, UserLessonProgress } from "@/types/database";

export function useChapterProgress(chapterId?: string) {
  const [progress, setProgress] = useState<UserChapterProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const supabase = createClient();

  useEffect(() => {
    if (!user || !chapterId) {
      setIsLoading(false);
      return;
    }

    const fetch = async () => {
      const { data } = await supabase
        .from("user_chapter_progress")
        .select("*")
        .eq("user_id", user.id)
        .eq("chapter_id", chapterId)
        .single();

      setProgress(data as UserChapterProgress | null);
      setIsLoading(false);
    };

    fetch();
  }, [user, chapterId, supabase]);

  return { progress, isLoading };
}

export function useLessonProgress(lessonId?: string) {
  const [progress, setProgress] = useState<UserLessonProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const supabase = createClient();

  useEffect(() => {
    if (!user || !lessonId) {
      setIsLoading(false);
      return;
    }

    const fetch = async () => {
      const { data } = await supabase
        .from("user_lesson_progress")
        .select("*")
        .eq("user_id", user.id)
        .eq("lesson_id", lessonId)
        .single();

      setProgress(data as UserLessonProgress | null);
      setIsLoading(false);
    };

    fetch();
  }, [user, lessonId, supabase]);

  return { progress, isLoading };
}
