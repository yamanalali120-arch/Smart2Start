export type UserRole = "admin" | "learner";
export type LessonType = "introduction" | "knowledge" | "flashcards" | "quiz" | "chapter_test" | "review";
export type ContentBlockType = "text" | "mnemonic" | "definition" | "tip" | "warning" | "image" | "list" | "comparison" | "summary";
export type QuestionType = "single_choice" | "multiple_choice" | "true_false" | "matching" | "ordering" | "flashcard" | "fill_blank";
export type DifficultyLevel = "easy" | "medium" | "hard";
export type CompletionStatus = "locked" | "available" | "in_progress" | "completed" | "mastered";
export type SrsStatus = "new" | "learning" | "review" | "mastered";
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Profile {
  id: string;
  username: string;
  display_name: string;
  role: UserRole;
  avatar_url: string | null;
  total_xp: number;
  current_level: number;
  daily_goal_minutes: number;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Topic {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  sort_order: number;
  created_at: string;
}

export interface Chapter {
  id: string;
  title: string;
  slug: string;
  description: string;
  learning_objectives: string[];
  icon: string | null;
  color: string;
  sort_order: number;
  is_published: boolean;
  estimated_minutes: number;
  required_chapter_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ChapterWithProgress extends Chapter {
  progress: UserChapterProgress | null;
  lessons_count: number;
  completed_lessons: number;
  topics: Topic[];
}

export interface Lesson {
  id: string;
  chapter_id: string;
  title: string;
  slug: string;
  description: string | null;
  type: LessonType;
  sort_order: number;
  is_published: boolean;
  xp_reward: number;
  estimated_minutes: number;
  created_at: string;
  updated_at: string;
}

export interface LessonWithProgress extends Lesson {
  progress: UserLessonProgress | null;
  content_blocks: LessonContentBlock[];
  questions_count: number;
}

export interface LessonContentBlock {
  id: string;
  lesson_id: string;
  type: ContentBlockType;
  title: string | null;
  content: Json;
  sort_order: number;
  created_at: string;
}

export interface Question {
  id: string;
  lesson_id: string;
  chapter_id: string;
  topic_id: string | null;
  type: QuestionType;
  difficulty: DifficultyLevel;
  question_text: string;
  question_image_url: string | null;
  answers: Json;
  explanation: string | null;
  wrong_answer_explanations: Json | null;
  tags: string[];
  xp_value: number;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface SingleChoiceAnswers {
  options: string[];
  correct_index: number;
}

export interface MultipleChoiceAnswers {
  options: string[];
  correct_indices: number[];
}

export interface TrueFalseAnswers {
  correct_answer: boolean;
}

export interface MatchingAnswers {
  pairs: Array<{ left: string; right: string }>;
}

export interface OrderingAnswers {
  items: string[];
}

export interface FlashcardAnswers {
  front: string;
  back: string;
}

export interface FillBlankAnswers {
  text_with_blanks: string;
  answers: string[];
}

export interface UserChapterProgress {
  id: string;
  user_id: string;
  chapter_id: string;
  status: CompletionStatus;
  progress_percent: number;
  started_at: string | null;
  completed_at: string | null;
  chapter_test_score: number | null;
  chapter_test_passed: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserLessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  chapter_id: string;
  status: CompletionStatus;
  score: number | null;
  xp_earned: number;
  attempts: number;
  best_score: number;
  started_at: string | null;
  completed_at: string | null;
  last_accessed_at: string;
  created_at: string;
  updated_at: string;
}

export interface UserTopicMastery {
  id: string;
  user_id: string;
  topic_id: string;
  mastery_score: number;
  total_questions_seen: number;
  total_correct: number;
  total_incorrect: number;
  last_practiced_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface QuizAttempt {
  id: string;
  user_id: string;
  question_id: string;
  lesson_id: string;
  chapter_id: string;
  topic_id: string | null;
  user_answer: Json;
  is_correct: boolean;
  xp_earned: number;
  time_spent_seconds: number | null;
  attempted_at: string;
}

export interface ReviewQueueItem {
  id: string;
  user_id: string;
  question_id: string;
  srs_status: SrsStatus;
  ease_factor: number;
  interval_days: number;
  repetitions: number;
  next_review_at: string;
  last_reviewed_at: string | null;
  consecutive_correct: number;
  consecutive_incorrect: number;
  created_at: string;
  updated_at: string;
}

export interface ReviewQueueItemWithQuestion extends ReviewQueueItem {
  question: Question;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition_type: string;
  condition_value: Json;
  xp_reward: number;
  sort_order: number;
  created_at: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
  badge?: Badge;
}

export interface UserStreak {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface DailyActivity {
  id: string;
  user_id: string;
  activity_date: string;
  minutes_spent: number;
  xp_earned: number;
  questions_answered: number;
  questions_correct: number;
  lessons_completed: number;
  daily_goal_met: boolean;
  created_at: string;
  updated_at: string;
}

export interface DashboardData {
  profile: Profile;
  streak: UserStreak;
  todayActivity: DailyActivity | null;
  topicMasteries: (UserTopicMastery & { topic: Topic })[];
  recentChapter: ChapterWithProgress | null;
  recommendedLesson: LessonWithProgress | null;
  totalCorrect: number;
  totalIncorrect: number;
  reviewDueCount: number;
}
