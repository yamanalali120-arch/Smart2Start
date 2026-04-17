"use client";

import { useState, useCallback } from "react";
import type { Question } from "@/types/database";
import { QuestionSingleChoice } from "./question-single-choice";
import { QuestionMultipleChoice } from "./question-multiple-choice";
import { QuestionTruefalse } from "./question-true-false";
import { QuestionFlashcard } from "./question-flashcard";
import { QuizProgressBar } from "./quiz-progress-bar";
import { QuizResult } from "./quiz-result";
import { AnswerFeedback } from "./answer-feedback";
import { submitQuizAnswer } from "@/actions/quiz";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface QuizEngineProps {
  questions: Question[];
  lessonId: string;
  chapterId: string;
  lessonTitle: string;
  xpReward: number;
  onComplete: () => void;
}

interface AnswerState {
  submitted: boolean;
  isCorrect: boolean;
  explanation: string | null;
}

export function QuizEngine({
  questions,
  lessonId,
  chapterId,
  lessonTitle,
  xpReward,
  onComplete,
}: QuizEngineProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalXp, setTotalXp] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [answerState, setAnswerState] = useState<AnswerState>({
    submitted: false,
    isCorrect: false,
    explanation: null,
  });
  const [questionStartTime] = useState(Date.now());

  const currentQuestion = questions[currentIndex];

  const handleAnswer = useCallback(
    async (isCorrect: boolean) => {
      if (!currentQuestion) return;

      const timeSpent = Math.round((Date.now() - questionStartTime) / 1000);
      const xpEarned = isCorrect ? currentQuestion.xp_value : 0;

      setAnswerState({
        submitted: true,
        isCorrect,
        explanation: currentQuestion.explanation,
      });

      if (isCorrect) {
        setTotalCorrect((prev) => prev + 1);
        setTotalXp((prev) => prev + xpEarned);
      }

      // Submit to server
      await submitQuizAnswer({
        questionId: currentQuestion.id,
        lessonId,
        chapterId,
        topicId: currentQuestion.topic_id,
        userAnswer: { answered: true },
        isCorrect,
        xpEarned,
        timeSpentSeconds: timeSpent,
      });
    },
    [currentQuestion, lessonId, chapterId, questionStartTime]
  );

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      setIsComplete(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
      setAnswerState({ submitted: false, isCorrect: false, explanation: null });
    }
  };

  if (questions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Keine Fragen für diese Lektion verfügbar.</p>
        <Button onClick={onComplete} className="mt-4">Weiter</Button>
      </div>
    );
  }

  if (isComplete) {
    const score = Math.round((totalCorrect / questions.length) * 100);
    return (
      <QuizResult
        totalQuestions={questions.length}
        correctAnswers={totalCorrect}
        score={score}
        totalXp={totalXp + xpReward}
        lessonTitle={lessonTitle}
        onContinue={onComplete}
      />
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <QuizProgressBar current={currentIndex + 1} total={questions.length} />

      {/* Question */}
      <div className="animate-slide-up-fade">
        {currentQuestion.type === "single_choice" && (
          <QuestionSingleChoice
            question={currentQuestion}
            onAnswer={handleAnswer}
            disabled={answerState.submitted}
          />
        )}
        {currentQuestion.type === "multiple_choice" && (
          <QuestionMultipleChoice
            question={currentQuestion}
            onAnswer={handleAnswer}
            disabled={answerState.submitted}
          />
        )}
        {currentQuestion.type === "true_false" && (
          <QuestionTruefalse
            question={currentQuestion}
            onAnswer={handleAnswer}
            disabled={answerState.submitted}
          />
        )}
        {currentQuestion.type === "flashcard" && (
          <QuestionFlashcard
            question={currentQuestion}
            onAnswer={handleAnswer}
            disabled={answerState.submitted}
          />
        )}
        {/* Fallback for other types */}
        {!["single_choice", "multiple_choice", "true_false", "flashcard"].includes(currentQuestion.type) && (
          <QuestionSingleChoice
            question={currentQuestion}
            onAnswer={handleAnswer}
            disabled={answerState.submitted}
          />
        )}
      </div>

      {/* Feedback */}
      {answerState.submitted && (
        <AnswerFeedback
          isCorrect={answerState.isCorrect}
          explanation={answerState.explanation}
        />
      )}

      {/* Next button */}
      {answerState.submitted && (
        <div className="flex justify-end">
          <Button
            onClick={handleNext}
            className="bg-brand-green-500 hover:bg-brand-green-600 text-white"
          >
            {currentIndex + 1 >= questions.length ? "Ergebnis anzeigen" : "Nächste Frage"}
            <ArrowRight size={16} className="ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
