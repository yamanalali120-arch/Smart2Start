"use client";

import { useState, useCallback } from "react";
import type { QuizState, QuizQuestion, QuizAnswer, QuizResult } from "@/types/quiz";
import { calculateQuestionXp } from "@/lib/xp";

export function useQuiz(questions: QuizQuestion[]) {
  const [state, setState] = useState<QuizState>({
    questions,
    currentIndex: 0,
    answers: [],
    isComplete: false,
    score: 0,
    totalXpEarned: 0,
    startedAt: new Date(),
  });

  const currentQuestion = state.questions[state.currentIndex] || null;

  const submitAnswer = useCallback(
    (userAnswer: unknown, isCorrect: boolean, timeSpentSeconds: number) => {
      const question = state.questions[state.currentIndex];
      if (!question) return;

      const xpEarned = calculateQuestionXp(
        question.difficulty as "easy" | "medium" | "hard",
        isCorrect
      );

      const answer: QuizAnswer = {
        questionId: question.id,
        userAnswer,
        isCorrect,
        xpEarned,
        timeSpentSeconds,
      };

      const newAnswers = [...state.answers, answer];
      const newIndex = state.currentIndex + 1;
      const isComplete = newIndex >= state.questions.length;
      const correctCount = newAnswers.filter((a) => a.isCorrect).length;
      const score = newAnswers.length > 0 ? Math.round((correctCount / newAnswers.length) * 100) : 0;

      setState((prev) => ({
        ...prev,
        answers: newAnswers,
        currentIndex: newIndex,
        isComplete,
        score,
        totalXpEarned: prev.totalXpEarned + xpEarned,
      }));
    },
    [state.currentIndex, state.questions, state.answers]
  );

  const getResult = useCallback((): QuizResult => {
    const correctAnswers = state.answers.filter((a) => a.isCorrect).length;
    const incorrectAnswers = state.answers.length - correctAnswers;
    const score = state.answers.length > 0 ? Math.round((correctAnswers / state.answers.length) * 100) : 0;

    return {
      totalQuestions: state.questions.length,
      correctAnswers,
      incorrectAnswers,
      score,
      totalXp: state.totalXpEarned,
      passed: score >= 70,
      answers: state.answers,
    };
  }, [state.answers, state.questions.length, state.totalXpEarned]);

  const reset = useCallback(() => {
    setState({
      questions,
      currentIndex: 0,
      answers: [],
      isComplete: false,
      score: 0,
      totalXpEarned: 0,
      startedAt: new Date(),
    });
  }, [questions]);

  return {
    state,
    currentQuestion,
    currentIndex: state.currentIndex,
    totalQuestions: state.questions.length,
    isComplete: state.isComplete,
    submitAnswer,
    getResult,
    reset,
  };
}
