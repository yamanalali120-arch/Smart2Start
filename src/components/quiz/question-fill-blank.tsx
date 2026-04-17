"use client";

import { useState } from "react";
import type { Question } from "@/types/database";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Props {
  question: Question;
  onAnswer: (isCorrect: boolean) => void;
  disabled: boolean;
}

export function QuestionFillBlank({ question, onAnswer, disabled }: Props) {
  const answers = question.answers as unknown as {
    text_with_blanks: string;
    answers: string[];
  };

  const [userInputs, setUserInputs] = useState<string[]>(
    new Array(answers.answers.length).fill("")
  );
  const [submitted, setSubmitted] = useState(false);

  const parts = answers.text_with_blanks.split("___");

  const handleSubmit = () => {
    setSubmitted(true);
    const isCorrect = userInputs.every(
      (input, i) => input.trim().toLowerCase() === answers.answers[i].toLowerCase()
    );
    onAnswer(isCorrect);
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base leading-relaxed">{question.question_text}</CardTitle>
        <p className="text-xs text-muted-foreground">Fülle die Lücken aus</p>
      </CardHeader>
      <CardContent>
        <div className="text-sm leading-relaxed flex flex-wrap items-center gap-1">
          {parts.map((part, index) => (
            <span key={index} className="inline-flex items-center gap-1">
              <span>{part}</span>
              {index < answers.answers.length && (
                <Input
                  value={userInputs[index]}
                  onChange={(e) => {
                    const newInputs = [...userInputs];
                    newInputs[index] = e.target.value;
                    setUserInputs(newInputs);
                  }}
                  disabled={disabled || submitted}
                  className={cn(
                    "inline-flex w-32 h-8 text-sm",
                    submitted &&
                      userInputs[index].trim().toLowerCase() ===
                        answers.answers[index].toLowerCase() &&
                      "border-green-500 bg-green-50",
                    submitted &&
                      userInputs[index].trim().toLowerCase() !==
                        answers.answers[index].toLowerCase() &&
                      "border-red-500 bg-red-50"
                  )}
                  placeholder="..."
                />
              )}
            </span>
          ))}
        </div>

        {submitted && (
          <div className="mt-3 rounded-lg bg-muted/50 p-3">
            <p className="text-xs font-semibold text-muted-foreground mb-1">Richtige Antworten:</p>
            <p className="text-sm">{answers.answers.join(", ")}</p>
          </div>
        )}

        {!disabled && !submitted && userInputs.some((i) => i.trim().length > 0) && (
          <Button
            onClick={handleSubmit}
            className="w-full mt-4 bg-brand-green-500 hover:bg-brand-green-600 text-white"
          >
            Antwort prüfen
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
