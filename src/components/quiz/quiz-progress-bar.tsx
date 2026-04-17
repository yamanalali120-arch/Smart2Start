import { Progress } from "@/components/ui/progress";

interface QuizProgressBarProps {
  current: number;
  total: number;
}

export function QuizProgressBar({ current, total }: QuizProgressBarProps) {
  const percent = Math.round((current / total) * 100);

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Frage {current} von {total}</span>
        <span>{percent}%</span>
      </div>
      <Progress value={percent} className="h-2" />
    </div>
  );
}
