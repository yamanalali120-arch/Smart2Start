"use client";

import { useState } from "react";
import type { Question } from "@/types/database";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GripVertical, ArrowUp, ArrowDown } from "lucide-react";

interface Props {
  question: Question;
  onAnswer: (isCorrect: boolean) => void;
  disabled: boolean;
}

export function QuestionOrdering({ question, onAnswer, disabled }: Props) {
  const answers = question.answers as unknown as { items: string[] };

  // Shuffle initial order
  const [items, setItems] = useState<string[]>(() => {
    const shuffled = [...answers.items];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  });
  const [submitted, setSubmitted] = useState(false);

  const moveUp = (index: number) => {
    if (index === 0 || disabled || submitted) return;
    const newItems = [...items];
    [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
    setItems(newItems);
  };

  const moveDown = (index: number) => {
    if (index === items.length - 1 || disabled || submitted) return;
    const newItems = [...items];
    [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    setItems(newItems);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const isCorrect = items.every((item, index) => item === answers.items[index]);
    onAnswer(isCorrect);
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base leading-relaxed">{question.question_text}</CardTitle>
        <p className="text-xs text-muted-foreground">Bringe die Schritte in die richtige Reihenfolge</p>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.map((item, index) => {
          const isCorrectPosition = submitted && item === answers.items[index];
          const isWrongPosition = submitted && item !== answers.items[index];

          return (
            <div
              key={`${item}-${index}`}
              className={cn(
                "flex items-center gap-2 rounded-xl border-2 p-3 transition-all",
                !submitted && "border-gray-200",
                isCorrectPosition && "border-green-400 bg-green-50",
                isWrongPosition && "border-red-400 bg-red-50"
              )}
            >
              <GripVertical size={16} className="text-muted-foreground shrink-0" />
              <span className="flex-1 text-sm">{item}</span>
              {!disabled && !submitted && (
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className="rounded p-1 hover:bg-muted disabled:opacity-30"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    onClick={() => moveDown(index)}
                    disabled={index === items.length - 1}
                    className="rounded p-1 hover:bg-muted disabled:opacity-30"
                  >
                    <ArrowDown size={14} />
                  </button>
                </div>
              )}
              {submitted && (
                <span className="text-xs font-semibold shrink-0">
                  {isCorrectPosition ? "✓" : `→ ${answers.items.indexOf(item) + 1}`}
                </span>
              )}
            </div>
          );
        })}

        {!disabled && !submitted && (
          <Button
            onClick={handleSubmit}
            className="w-full mt-2 bg-brand-green-500 hover:bg-brand-green-600 text-white"
          >
            Reihenfolge bestätigen
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
