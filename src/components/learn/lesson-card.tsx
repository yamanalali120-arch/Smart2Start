"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { LessonWithProgress } from "@/types/database";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Brain,
  Layers,
  HelpCircle,
  Trophy,
  CheckCircle,
  Lock,
  ChevronRight,
  Zap,
} from "lucide-react";

interface LessonCardProps {
  lesson: LessonWithProgress;
  chapterSlug: string;
  index: number;
}

const lessonTypeConfig = {
  introduction: { icon: BookOpen, label: "Einführung", color: "text-blue-500" },
  knowledge: { icon: Brain, label: "Wissen", color: "text-purple-500" },
  flashcards: { icon: Layers, label: "Lernkarten", color: "text-green-500" },
  quiz: { icon: HelpCircle, label: "Quiz", color: "text-orange-500" },
  chapter_test: { icon: Trophy, label: "Kapiteltest", color: "text-yellow-600" },
  review: { icon: Brain, label: "Wiederholung", color: "text-red-500" },
};

export function LessonCard({ lesson, chapterSlug, index }: LessonCardProps) {
  const status = lesson.progress?.status || (index === 0 ? "available" : "available");
  const isCompleted = status === "completed" || status === "mastered";
  const isLocked = status === "locked";
  const typeConfig = lessonTypeConfig[lesson.type] || lessonTypeConfig.knowledge;
  const TypeIcon = typeConfig.icon;

  const content = (
    <Card
      className={cn(
        "transition-all duration-200 border",
        isCompleted && "bg-green-50/50 border-green-200",
        isLocked && "opacity-50 cursor-not-allowed",
        !isCompleted && !isLocked && "hover:shadow-md hover:border-brand-green-300 cursor-pointer"
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Number / Status */}
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold",
              isCompleted && "bg-brand-green-500 text-white",
              isLocked && "bg-muted text-muted-foreground",
              !isCompleted && !isLocked && "bg-brand-green-100 text-brand-green-700"
            )}
          >
            {isCompleted ? (
              <CheckCircle size={18} />
            ) : isLocked ? (
              <Lock size={16} />
            ) : (
              index + 1
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <TypeIcon size={14} className={typeConfig.color} />
              <span className="text-xs text-muted-foreground">{typeConfig.label}</span>
            </div>
            <h4 className="text-sm font-semibold truncate">{lesson.title}</h4>
            {lesson.description && (
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {lesson.description}
              </p>
            )}
          </div>

          {/* Meta */}
          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="outline" className="text-[10px] hidden sm:flex">
              <Zap size={10} className="mr-1" />
              {lesson.xp_reward} XP
            </Badge>
            <span className="text-xs text-muted-foreground hidden sm:block">
              ~{lesson.estimated_minutes} Min.
            </span>
            {!isLocked && <ChevronRight size={16} className="text-muted-foreground" />}
          </div>
        </div>

        {/* Score bar if completed */}
        {isCompleted && lesson.progress?.best_score !== undefined && (
          <div className="mt-2 ml-14">
            <div className="flex items-center gap-2 text-xs text-brand-green-600">
              <span>Beste Bewertung: {Math.round(lesson.progress.best_score)}%</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (isLocked) return content;

  return (
    <Link href={`/learn/${chapterSlug}/${lesson.slug}`} className="block">
      {content}
    </Link>
  );
}
