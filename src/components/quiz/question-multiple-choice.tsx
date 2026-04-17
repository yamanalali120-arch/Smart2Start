"use client";

import { useState } from "react";
import type { Question } from "@/types/database";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface Props {
  question: Question;
  onAnswer: (isCorrect: boolean) => void;
  disabled: boolean;
}

export function QuestionMultipleChoice({ question, onAnswer, disabled }: Props) {
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const answers = question.answers as unknown as { options: string[]; correct_indices: number[] };

  const toggleIndex = (index: number) => {
    if (disabled || submitted) return;
    const newSet = new Set(selectedIndices);
    if (newSet.has(index)) {
      newSet.delete(index);
    } else {
      newSet.add(index);
    }
    setSelectedIndices(newSet);
  };

  const handleSubmit = () => {
    if (submitted) return;
    setSubmitted(true);
    const correctSet = new Set(answers.correct_indices);
    const isCorrect =
      selectedIndices.size === correctSet.size &&
      [...selectedIndices].every((i) => correctSet.has(i));
    onAnswer(isCorrect);
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base leading-relaxed">{question.question_text}</CardTitle>
        <p className="text-xs text-muted-foreground">Mehrere Antworten möglich</p>
      </CardHeader>
      <CardContent className="space-y-2">
        {answers.options.map((option, index) => {
          const isSelected = selectedIndices.has(index);
          const isCorrect = answers.correct_indices.includes(index);

          return (
            <button
              key={index}
              onClick={() => toggleIndex(index)}
              disabled={disabled}
              className={cn(
                "w-full text-left rounded-xl border-2 p-4 text-sm transition-all",
                !disabled && "hover:border-brand-green-300 cursor-pointer",
                isSelected && !disabled && "border-brand-green-500 bg-brand-green-50",
                disabled && isSelected && isCorrect && "border-green-500 bg-green-50",
                disabled && isSelected && !isCorrect && "border-red-500 bg-red-50",
                disabled && !isSelected && isCorrect && "border-green-300 bg-green-50",
                !isSelected && !disabled && "border-gray-200"
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded border-2",
                    isSelected ? "border-brand-green-500 bg-brand-green-500" : "border-gray-300"
                  )}
                >
                  {isSelected && <Check size={14} className="text-white" />}
                </div>
                <span>{option}</span>
              </div>
            </button>
          );
        })}

        {!disabled && !submitted && selectedIndices.size > 0 && (
          <Button
            onClick={handleSubmit}
            className="w-full mt-2 bg-brand-green-500 hover:bg-brand-green-600 text-white"
          >
            Antworten bestätigen
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
