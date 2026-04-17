import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuizResultProps {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  totalXp: number;
  lessonTitle: string;
  onContinue: () => void;
}

export function QuizResult({
  totalQuestions,
  correctAnswers,
  score,
  totalXp,
  lessonTitle,
  onContinue,
}: QuizResultProps) {
  const passed = score >= 70;
  const incorrectAnswers = totalQuestions - correctAnswers;

  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      {/* Header */}
      <div
        className={cn(
          "p-8 text-center text-white",
          passed
            ? "bg-gradient-to-br from-brand-green-500 to-brand-green-600"
            : "bg-gradient-to-br from-orange-400 to-orange-500"
        )}
      >
        <div className="text-5xl mb-3">{passed ? "🎉" : "💪"}</div>
        <h2 className="text-2xl font-bold mb-1">
          {passed ? "Großartig!" : "Gut versucht!"}
        </h2>
        <p className="text-white/80 text-sm">{lessonTitle}</p>
      </div>

      <CardContent className="p-6 space-y-6">
        {/* Score circle */}
        <div className="text-center">
          <div className="relative inline-flex h-24 w-24 items-center justify-center">
            <svg className="h-24 w-24 -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-muted"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 42}`}
                strokeDashoffset={`${2 * Math.PI * 42 * (1 - score / 100)}`}
                className={passed ? "text-brand-green-500" : "text-orange-500"}
                style={{ transition: "stroke-dashoffset 1s ease" }}
              />
            </svg>
            <span className="absolute text-2xl font-bold">{score}%</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl bg-muted/50 p-3 text-center">
            <p className="text-xl font-bold">{totalQuestions}</p>
            <p className="text-xs text-muted-foreground">Fragen</p>
          </div>
          <div className="rounded-xl bg-green-50 p-3 text-center">
            <div className="flex items-center justify-center gap-1">
              <CheckCircle size={14} className="text-green-500" />
              <p className="text-xl font-bold text-green-700">{correctAnswers}</p>
            </div>
            <p className="text-xs text-green-600">Richtig</p>
          </div>
          <div className="rounded-xl bg-red-50 p-3 text-center">
            <div className="flex items-center justify-center gap-1">
              <XCircle size={14} className="text-red-500" />
              <p className="text-xl font-bold text-red-700">{incorrectAnswers}</p>
            </div>
            <p className="text-xs text-red-600">Falsch</p>
          </div>
        </div>

        {/* XP earned */}
        <div className="flex items-center justify-center gap-2 rounded-xl bg-yellow-50 border border-yellow-200 p-4">
          <Zap size={20} className="text-yellow-500" />
          <span className="text-lg font-bold text-yellow-700">+{totalXp} XP</span>
          <span className="text-sm text-yellow-600">verdient!</span>
        </div>

        {/* Message */}
        <p className="text-center text-sm text-muted-foreground">
          {passed
            ? "Super Arbeit! Du hast diese Lektion gemeistert."
            : "Kein Problem – falsche Fragen werden zur Wiederholung markiert. Versuch es bald nochmal!"}
        </p>

        {/* Continue button */}
        <Button
          onClick={onContinue}
          className="w-full bg-brand-green-500 hover:bg-brand-green-600 text-white"
          size="lg"
        >
          Weiter
        </Button>
      </CardContent>
    </Card>
  );
}
