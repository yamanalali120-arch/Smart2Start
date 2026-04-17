"use client";

import { useState } from "react";
import type { Question } from "@/types/database";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

interface Props {
  question: Question;
  onAnswer: (isCorrect: boolean) => void;
  disabled: boolean;
}

export function QuestionTruefalse({ question, onAnswer, disabled }: Props) {
  const [selected, setSelected] = useState<boolean | null>(null);
  const answers = question.answers as unknown as { correct_answer: boolean };

  const handleSelect = (value: boolean) => {
    if (disabled) return;
    setSelected(value);
    onAnswer(value === answers.correct_answer);
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base leading-relaxed">{question.question_text}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {[true, false].map((value) => {
            const isSelected = selected === value;
            const isCorrect = value === answers.correct_answer;

            return (
              <button
                key={String(value)}
                onClick={() => handleSelect(value)}
                disabled={disabled}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-xl border-2 p-6 transition-all",
                  !disabled && "hover:border-brand-green-300 cursor-pointer",
                  !disabled && isSelected && "border-brand-green-500 bg-brand-green-50",
                  disabled && isSelected && isCorrect && "border-green-500 bg-green-50",
                  disabled && isSelected && !isCorrect && "border-red-500 bg-red-50",
                  disabled && !isSelected && isCorrect && "border-green-300 bg-green-50",
                  !isSelected && !disabled && "border-gray-200"
                )}
              >
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full",
                    value ? "bg-green-100" : "bg-red-100"
                  )}
                >
                  {value ? (
                    <Check size={24} className="text-green-600" />
                  ) : (
                    <X size={24} className="text-red-600" />
                  )}
                </div>
                <span className="text-sm font-semibold">
                  {value ? "Richtig" : "Falsch"}
                </span>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
