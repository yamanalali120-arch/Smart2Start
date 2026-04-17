import { cn } from "@/lib/utils";
import { getMasteryBgColor, getMasteryColor } from "@/lib/constants";
import type { TopicMasteryDisplay } from "@/types/progress";

interface TopicMasteryBarProps {
  topic: TopicMasteryDisplay;
}

export function TopicMasteryBar({ topic }: TopicMasteryBarProps) {
  const colorClass = getMasteryColor(topic.masteryScore);
  const bgClass = getMasteryBgColor(topic.masteryScore);

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-medium truncate">{topic.topicName}</p>
          <span className={cn("text-xs font-semibold", colorClass)}>
            {topic.masteryLabel}
          </span>
        </div>
        <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all duration-700", bgClass.replace("bg-", "bg-").replace("-100", "-400"))}
            style={{ width: `${topic.masteryScore}%`, backgroundColor: getBarColor(topic.masteryScore) }}
          />
        </div>
        <div className="flex justify-between mt-0.5">
          <span className="text-[10px] text-muted-foreground">
            {topic.totalSeen} Fragen beantwortet
          </span>
          <span className="text-[10px] font-medium">{Math.round(topic.masteryScore)}%</span>
        </div>
      </div>
    </div>
  );
}

function getBarColor(score: number): string {
  if (score >= 90) return "#eab308";
  if (score >= 75) return "#22c55e";
  if (score >= 55) return "#3b82f6";
  if (score >= 30) return "#f97316";
  return "#9ca3af";
}
