"use client";

import type { Chapter, Lesson } from "@/types/database";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, FileText, HelpCircle, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ContentManagerProps {
  chapters: Chapter[];
  lessons: Lesson[];
  totalQuestions: number;
}

export function ContentManager({ chapters, lessons, totalQuestions }: ContentManagerProps) {
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);

  const getLessonsForChapter = (chapterId: string) =>
    lessons.filter((l) => l.chapter_id === chapterId);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 text-center">
            <BookOpen size={20} className="mx-auto text-brand-green-500 mb-1" />
            <p className="text-xl font-bold">{chapters.length}</p>
            <p className="text-xs text-muted-foreground">Kapitel</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 text-center">
            <FileText size={20} className="mx-auto text-blue-500 mb-1" />
            <p className="text-xl font-bold">{lessons.length}</p>
            <p className="text-xs text-muted-foreground">Lektionen</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 text-center">
            <HelpCircle size={20} className="mx-auto text-orange-500 mb-1" />
            <p className="text-xl font-bold">{totalQuestions}</p>
            <p className="text-xs text-muted-foreground">Fragen</p>
          </CardContent>
        </Card>
      </div>

      {/* Chapter list */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Kapitelstruktur</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {chapters.map((chapter, index) => {
            const chapterLessons = getLessonsForChapter(chapter.id);
            const isExpanded = expandedChapter === chapter.id;

            return (
              <div key={chapter.id} className="border-b last:border-0">
                <button
                  onClick={() =>
                    setExpandedChapter(isExpanded ? null : chapter.id)
                  }
                  className="w-full flex items-center gap-3 p-4 hover:bg-muted/30 transition-colors text-left"
                >
                  {isExpanded ? (
                    <ChevronDown size={16} className="shrink-0 text-muted-foreground" />
                  ) : (
                    <ChevronRight size={16} className="shrink-0 text-muted-foreground" />
                  )}
                  <span className="text-xs font-semibold text-muted-foreground w-6">
                    {index + 1}.
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{chapter.title}</p>
                  </div>
                  <Badge variant="outline" className="text-xs shrink-0">
                    {chapterLessons.length} Lektionen
                  </Badge>
                  <Badge
                    variant={chapter.is_published ? "success" : "outline"}
                    className="text-xs shrink-0"
                  >
                    {chapter.is_published ? "Veröffentlicht" : "Entwurf"}
                  </Badge>
                </button>

                {isExpanded && chapterLessons.length > 0 && (
                  <div className="bg-muted/20 px-4 pb-3 space-y-1">
                    {chapterLessons.map((lesson, li) => (
                      <div
                        key={lesson.id}
                        className="flex items-center gap-3 rounded-lg p-2.5 text-sm"
                      >
                        <span className="text-xs text-muted-foreground w-8">
                          {index + 1}.{li + 1}
                        </span>
                        <span className="flex-1 truncate">{lesson.title}</span>
                        <Badge variant="outline" className="text-[10px]">
                          {lesson.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {lesson.xp_reward} XP
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {chapters.length === 0 && (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Noch keine Kapitel vorhanden. Führe die Seed-Migration aus.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
