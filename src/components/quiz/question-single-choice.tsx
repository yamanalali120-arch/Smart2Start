"use client";

import { useState } from "react";
import type { Question, Json } from "@/types/database";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle } from "lucide-react";

interface Props {
  question: Question;
  onAnswer: (isCorrect: boolean) => void;
  disabled: boolean;
}

export function QuestionSingleChoice({ question, onAnswer, disabled }: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const answers = question.answers as unknown as { options: string[]; correct_index: number };

  const handleSelect = (index: number) => {
    if (disabled) return;
    setSelectedIndex(index);
    onAnswer(index === answers.correct_index);
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base leading-relaxed">{question.question_text}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {answers.options.map((option, index) => {
          const isSelected = selectedIndex === index;
          const isCorrect = index === answers.correct_index;
          const showResult = disabled && (isSelected || isCorrect);

          return (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              disabled={disabled}
              className={cn(
                "w-full text-left rounded-xl border-2 p-4 text-sm transition-all",
                !disabled && "hover:border-brand-green-300 hover:bg-brand-green-50 cursor-pointer",
                !disabled && isSelected && "border-brand-green-500 bg-brand-green-50",
                disabled && !showResult && "opacity-50",
                disabled && isSelected && isCorrect && "border-green-500 bg-green-50",
                disabled && isSelected && !isCorrect && "border-red-500 bg-red-50",
                disabled && !isSelected && isCorrect && "border-green-500 bg-green-50",
                !isSelected && !showResult && "border-gray-200"
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold",
                    !disabled && isSelected && "border-brand-green-500 bg-brand-green-500 text-white",
                    !disabled && !isSelected && "border-gray-300",
                    disabled && isCorrect && "border-green-500 bg-green-500 text-white",
                    disabled && isSelected && !isCorrect && "border-red-500 bg-red-500 text-white"
                  )}
                >
                  {disabled && isCorrect ? (
                    <CheckCircle size={14} />
                  ) : disabled && isSelected && !isCorrect ? (
                    <XCircle size={14} />
                  ) : (
                    String.fromCharCode(65 + index)
                  )}
                </div>
                <span>{option}</span>
              </div>
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
}
