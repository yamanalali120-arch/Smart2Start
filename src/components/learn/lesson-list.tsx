"use client";

import { LessonCard } from "./lesson-card";
import type { LessonWithProgress } from "@/types/database";

interface LessonListProps {
  lessons: LessonWithProgress[];
  chapterSlug: string;
}

export function LessonList({ lessons, chapterSlug }: LessonListProps) {
  return (
    <div className="space-y-3">
      {lessons.map((lesson, index) => (
        <LessonCard
          key={lesson.id}
          lesson={lesson}
          chapterSlug={chapterSlug}
          index={index}
        />
      ))}
      {lessons.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          Noch keine Lektionen in diesem Kapitel.
        </p>
      )}
    </div>
  );
}
