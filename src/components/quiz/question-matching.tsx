"use client";

import { useState } from "react";
import type { Question } from "@/types/database";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  question: Question;
  onAnswer: (isCorrect: boolean) => void;
  disabled: boolean;
}

export function QuestionMatching({ question, onAnswer, disabled }: Props) {
  const answers = question.answers as unknown as {
    pairs: Array<{ left: string; right: string }>;
  };

  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [matches, setMatches] = useState<Map<number, number>>(new Map());
  const [submitted, setSubmitted] = useState(false);

  // Shuffle right side
  const [shuffledRight] = useState(() => {
    const indices = answers.pairs.map((_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices;
  });

  const handleLeftClick = (index: number) => {
    if (disabled || submitted) return;
    setSelectedLeft(index);
  };

  const handleRightClick = (shuffledIndex: number) => {
    if (disabled || submitted || selectedLeft === null) return;
    const newMatches = new Map(matches);
    newMatches.set(selectedLeft, shuffledRight[shuffledIndex]);
    setMatches(newMatches);
    setSelectedLeft(null);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const isCorrect = matches.size === answers.pairs.length &&
      Array.from(matches.entries()).every(([left, right]) => left === right);
    onAnswer(isCorrect);
  };

  const isLeftMatched = (index: number) => matches.has(index);
  const isRightMatched = (originalIndex: number) =>
    Array.from(matches.values()).includes(originalIndex);

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base leading-relaxed">{question.question_text}</CardTitle>
        <p className="text-xs text-muted-foreground">Verbinde die zusammengehörigen Begriffe</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {/* Left column */}
          <div className="space-y-2">
            {answers.pairs.map((pair, index) => (
              <button
                key={`left-${index}`}
                onClick={() => handleLeftClick(index)}
                disabled={disabled || submitted || isLeftMatched(index)}
                className={cn(
                  "w-full rounded-lg border-2 p-3 text-sm text-left transition-all",
                  selectedLeft === index && "border-brand-green-500 bg-brand-green-50",
                  isLeftMatched(index) && "border-blue-300 bg-blue-50 opacity-70",
                  !isLeftMatched(index) && selectedLeft !== index && "border-gray-200 hover:border-gray-300"
                )}
              >
                {pair.left}
              </button>
            ))}
          </div>

          {/* Right column (shuffled) */}
          <div className="space-y-2">
            {shuffledRight.map((originalIndex, shuffledIdx) => (
              <button
                key={`right-${shuffledIdx}`}
                onClick={() => handleRightClick(shuffledIdx)}
                disabled={disabled || submitted || isRightMatched(originalIndex)}
                className={cn(
                  "w-full rounded-lg border-2 p-3 text-sm text-left transition-all",
                  selectedLeft !== null && !isRightMatched(originalIndex) && "border-brand-green-300 hover:bg-brand-green-50 cursor-pointer",
                  isRightMatched(originalIndex) && "border-blue-300 bg-blue-50 opacity-70",
                  !isRightMatched(originalIndex) && selectedLeft === null && "border-gray-200"
                )}
              >
                {answers.pairs[originalIndex].right}
              </button>
            ))}
          </div>
        </div>

        {!disabled && !submitted && matches.size === answers.pairs.length && (
          <Button
            onClick={handleSubmit}
            className="w-full mt-4 bg-brand-green-500 hover:bg-brand-green-600 text-white"
          >
            Zuordnung bestätigen
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
