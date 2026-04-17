"use client";

import { useState } from "react";
import type { ReviewQueueItemWithQuestion } from "@/types/database";
import { QuestionSingleChoice } from "@/components/quiz/question-single-choice";
import { QuestionTruefalse } from "@/components/quiz/question-true-false";
import { AnswerFeedback } from "@/components/quiz/answer-feedback";
import { updateReviewItem } from "@/actions/review";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface ReviewCardProps {
  item: ReviewQueueItemWithQuestion;
  onAnswer: (isCorrect: boolean) => void;
  onNext: () => void;
}

export function ReviewCard({ item, onAnswer, onNext }: ReviewCardProps) {
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleAnswer = async (correct: boolean) => {
    setAnswered(true);
    setIsCorrect(correct);
    onAnswer(correct);

    await updateReviewItem(
      item.id,
      item.question_id,
      correct,
      item.srs_status,
      item.ease_factor,
      item.interval_days,
      item.repetitions,
      item.consecutive_correct,
      item.consecutive_incorrect
    );
  };

  const question = item.question;

  return (
    <div className="space-y-4 animate-slide-up-fade">
      {question.type === "true_false" ? (
        <QuestionTruefalse
          question={question}
          onAnswer={handleAnswer}
          disabled={answered}
        />
      ) : (
        <QuestionSingleChoice
          question={question}
          onAnswer={handleAnswer}
          disabled={answered}
        />
      )}

      {answered && (
        <>
          <AnswerFeedback
            isCorrect={isCorrect}
            explanation={question.explanation}
          />
          <div className="flex justify-end">
            <Button
              onClick={onNext}
              className="bg-brand-green-500 hover:bg-brand-green-600 text-white"
            >
              Weiter <ArrowRight size={16} className="ml-1" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
