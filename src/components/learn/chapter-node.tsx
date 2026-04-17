"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ChapterWithProgress, CompletionStatus } from "@/types/database";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Lock, CheckCircle, BookOpen, Star, ChevronRight } from "lucide-react";

interface ChapterNodeProps {
  chapter: ChapterWithProgress;
  index: number;
  isFirst: boolean;
  isLast: boolean;
}

function getStatusConfig(status: CompletionStatus | null) {
  switch (status) {
    case "completed":
      return {
        icon: CheckCircle,
        color: "text-brand-green-500",
        bgColor: "bg-brand-green-50 border-brand-green-200",
        badgeVariant: "success" as const,
        badgeText: "Abgeschlossen",
        clickable: true,
      };
    case "mastered":
      return {
        icon: Star,
        color: "text-yellow-500",
        bgColor: "bg-yellow-50 border-yellow-200",
        badgeVariant: "warning" as const,
        badgeText: "Gemeistert",
        clickable: true,
      };
    case "in_progress":
      return {
        icon: BookOpen,
        color: "text-blue-500",
        bgColor: "bg-blue-50 border-blue-200",
        badgeVariant: "outline" as const,
        badgeText: "In Bearbeitung",
        clickable: true,
      };
    case "available":
      return {
        icon: BookOpen,
        color: "text-brand-green-500",
        bgColor: "bg-white border-brand-green-200",
        badgeVariant: "outline" as const,
        badgeText: "Verfügbar",
        clickable: true,
      };
    case "locked":
    default:
      return {
        icon: Lock,
        color: "text-muted-foreground",
        bgColor: "bg-muted/50 border-muted",
        badgeVariant: "outline" as const,
        badgeText: "Gesperrt",
        clickable: false,
      };
  }
}

export function ChapterNode({ chapter, index }: ChapterNodeProps) {
  const status = chapter.progress?.status || (index === 0 ? "available" : "locked");
  const config = getStatusConfig(status);
  const Icon = config.icon;
  const progressPercent = chapter.progress?.progress_percent || 0;

  const content = (
    <Card
      className={cn(
        "relative transition-all duration-200 border",
        config.bgColor,
        config.clickable && "hover:shadow-md hover:scale-[1.01] cursor-pointer",
        !config.clickable && "opacity-60 cursor-not-allowed"
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          {/* Status icon */}
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
              status === "locked" ? "bg-muted" : "bg-white shadow-sm"
            )}
          >
            <Icon size={22} className={config.color} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Kapitel {index + 1}
              </span>
              <Badge variant={config.badgeVariant} className="text-[10px]">
                {config.badgeText}
              </Badge>
            </div>
            <h3 className="text-base font-semibold truncate">{chapter.title}</h3>
            <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
              {chapter.description}
            </p>

            {/* Progress */}
            {status !== "locked" && (
              <div className="mt-3 space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    {chapter.completed_lessons} / {chapter.lessons_count} Lektionen
                  </span>
                  <span>{Math.round(progressPercent)}%</span>
                </div>
                <Progress value={progressPercent} className="h-2" />
              </div>
            )}

            {/* Meta */}
            <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
              <span>~{chapter.estimated_minutes} Min.</span>
              <span>{chapter.lessons_count} Lektionen</span>
            </div>
          </div>

          {/* Arrow */}
          {config.clickable && (
            <ChevronRight size={20} className="shrink-0 text-muted-foreground mt-1" />
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (config.clickable) {
    return (
      <Link href={`/learn/${chapter.slug}`} className="block">
        {content}
      </Link>
    );
  }

  return content;
}
