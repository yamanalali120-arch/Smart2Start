import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";

interface DailyGoalCardProps {
  goalMinutes: number;
  minutesSpent: number;
  questionsAnswered: number;
}

export function DailyGoalCard({ goalMinutes, minutesSpent, questionsAnswered }: DailyGoalCardProps) {
  const percent = Math.min(100, Math.round((minutesSpent / goalMinutes) * 100));
  const isGoalMet = minutesSpent >= goalMinutes;

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Target size={18} className="text-blue-500" />
          Tagesziel
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-4">
          {/* Circular progress */}
          <div className="relative inline-flex h-20 w-20 items-center justify-center">
            <svg className="h-20 w-20 -rotate-90" viewBox="0 0 80 80">
              <circle
                cx="40"
                cy="40"
                r="34"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                className="text-muted"
              />
              <circle
                cx="40"
                cy="40"
                r="34"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 34}`}
                strokeDashoffset={`${2 * Math.PI * 34 * (1 - percent / 100)}`}
                className={isGoalMet ? "text-brand-green-500" : "text-blue-500"}
                style={{ transition: "stroke-dashoffset 0.5s ease" }}
              />
            </svg>
            <span className="absolute text-lg font-bold">{percent}%</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {minutesSpent} / {goalMinutes} Minuten
          </p>
        </div>
        <div className="rounded-lg bg-muted/50 p-3 text-center">
          <p className="text-xs text-muted-foreground">Fragen heute</p>
          <p className="text-lg font-bold">{questionsAnswered}</p>
        </div>
        {isGoalMet && (
          <p className="mt-3 text-center text-sm text-brand-green-600 font-medium">
            ✅ Tagesziel erreicht!
          </p>
        )}
      </CardContent>
    </Card>
  );
}