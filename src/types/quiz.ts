export interface QuizState {
  questions: QuizQuestion[];
  currentIndex: number;
  answers: QuizAnswer[];
  isComplete: boolean;
  score: number;
  totalXpEarned: number;
  startedAt: Date;
}

export interface QuizQuestion {
  id: string;
  type: string;
  difficulty: string;
  question_text: string;
  answers: Record<string, unknown>;
  explanation: string | null;
  wrong_answer_explanations: Record<string, string> | null;
  xp_value: number;
  topic_id: string | null;
  lesson_id: string;
  chapter_id: string;
}

export interface QuizAnswer {
  questionId: string;
  userAnswer: unknown;
  isCorrect: boolean;
  xpEarned: number;
  timeSpentSeconds: number;
}

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  score: number;
  totalXp: number;
  passed: boolean;
  answers: QuizAnswer[];
}
