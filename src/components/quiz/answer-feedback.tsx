import { cn } from "@/lib/utils";
import { CheckCircle, XCircle } from "lucide-react";

interface AnswerFeedbackProps {
  isCorrect: boolean;
  explanation: string | null;
}

export function AnswerFeedback({ isCorrect, explanation }: AnswerFeedbackProps) {
  return (
    <div
      className={cn(
        "rounded-xl border-2 p-4 animate-slide-up-fade",
        isCorrect ? "border-green-300 bg-green-50" : "border-red-300 bg-red-50"
      )}
    >
      <div className="flex items-start gap-3">
        {isCorrect ? (
          <CheckCircle size={20} className="text-green-600 shrink-0 mt-0.5" />
        ) : (
          <XCircle size={20} className="text-red-600 shrink-0 mt-0.5" />
        )}
        <div>
          <p className={cn("font-semibold text-sm", isCorrect ? "text-green-700" : "text-red-700")}>
            {isCorrect ? "Richtig! Sehr gut! 🎉" : "Leider falsch. Nicht aufgeben! 💪"}
          </p>
          {explanation && (
            <p className="text-sm text-muted-foreground mt-1">{explanation}</p>
          )}
        </div>
      </div>
    </div>
  );
}
