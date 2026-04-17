export interface ChapterSeed {
  title: string;
  slug: string;
  description: string;
  learning_objectives: string[];
  icon: string;
  color: string;
  sort_order: number;
  estimated_minutes: number;
  topics: string[];
}

export interface LessonSeed {
  chapter_slug: string;
  title: string;
  slug: string;
  description: string;
  type: "introduction" | "knowledge" | "flashcards" | "quiz" | "chapter_test";
  sort_order: number;
  xp_reward: number;
  estimated_minutes: number;
}

export interface ContentBlockSeed {
  lesson_slug: string;
  chapter_slug: string;
  type: "text" | "mnemonic" | "definition" | "tip" | "warning" | "list" | "comparison" | "summary";
  title?: string;
  content: Record<string, unknown>;
  sort_order: number;
}

export interface QuestionSeed {
  lesson_slug: string;
  chapter_slug: string;
  topic_slug: string;
  type: "single_choice" | "multiple_choice" | "true_false" | "matching" | "ordering" | "flashcard" | "fill_blank";
  difficulty: "easy" | "medium" | "hard";
  question_text: string;
  answers: Record<string, unknown>;
  explanation: string;
  wrong_answer_explanations?: Record<string, string>;
  tags: string[];
  xp_value: number;
  sort_order: number;
}
