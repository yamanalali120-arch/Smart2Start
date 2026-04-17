"use client";

import { useState } from "react";
import type { Question } from "@/types/database";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RotateCcw, ThumbsUp, ThumbsDown } from "lucide-react";

interface Props {
  question: Question;
  onAnswer: (isCorrect: boolean) => void;
  disabled: boolean;
}

export function QuestionFlashcard({ question, onAnswer, disabled }: Props) {
  const [isFlipped, setIsFlipped] = useState(false);
  const answers = question.answers as unknown as { front: string; back: string };

  return (
    <div className="space-y-4">
      {/* Card */}
      <div
        onClick={() => !disabled && setIsFlipped(!isFlipped)}
        className={cn("cursor-pointer perspective-1000", disabled && "pointer-events-none")}
      >
        <Card className="min-h-[200px] border-2 border-brand-green-200 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center p-8 text-center min-h-[200px]">
            {!isFlipped ? (
              <>
                <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">Frage</p>
                <p className="text-lg font-semibold">{answers.front}</p>
                <p className="text-xs text-muted-foreground mt-4">Tippen zum Umdrehen</p>
              </>
            ) : (
              <>
                <p className="text-xs text-brand-green-600 mb-3 uppercase tracking-wider">Antwort</p>
                <p className="text-lg font-semibold text-brand-green-700">{answers.back}</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Self-assessment buttons */}
      {isFlipped && !disabled && (
        <div className="flex gap-3 justify-center">
          <Button
            variant="outline"
            onClick={() => onAnswer(false)}
            className="border-red-300 text-red-600 hover:bg-red-50"
          >
            <ThumbsDown size={16} className="mr-2" />
            Wusste ich nicht
          </Button>
          <Button
            onClick={() => onAnswer(true)}
            className="bg-brand-green-500 hover:bg-brand-green-600 text-white"
          >
            <ThumbsUp size={16} className="mr-2" />
            Wusste ich!
          </Button>
        </div>
      )}

      {!isFlipped && !disabled && (
        <div className="text-center">
          <Button variant="ghost" onClick={() => setIsFlipped(true)}>
            <RotateCcw size={16} className="mr-2" />
            Antwort aufdecken
          </Button>
        </div>
      )}
    </div>
  );
}
