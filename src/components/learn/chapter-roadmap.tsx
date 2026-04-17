"use client";

import { ChapterNode } from "./chapter-node";
import type { ChapterWithProgress } from "@/types/database";

interface ChapterRoadmapProps {
  chapters: ChapterWithProgress[];
}

export function ChapterRoadmap({ chapters }: ChapterRoadmapProps) {
  return (
    <div className="relative">
      {/* Connecting line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border hidden md:block" />

      <div className="space-y-4">
        {chapters.map((chapter, index) => (
          <ChapterNode
            key={chapter.id}
            chapter={chapter}
            index={index}
            isFirst={index === 0}
            isLast={index === chapters.length - 1}
          />
        ))}
      </div>

      {chapters.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground">
            Noch keine Kapitel verfügbar. Bitte wende dich an deinen Admin.
          </p>
        </div>
      )}
    </div>
  );
}
