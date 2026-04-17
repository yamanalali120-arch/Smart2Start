import type { Profile, UserStreak } from "./database";

export interface AdminUserView extends Profile {
  streak: UserStreak | null;
  total_lessons_completed: number;
  total_questions_answered: number;
  average_mastery: number;
  last_active: string | null;
}

export interface TeamAnalytics {
  totalUsers: number;
  activeToday: number;
  activeThisWeek: number;
  averageXp: number;
  averageMastery: number;
  weakestTopics: Array<{ topic_name: string; avg_mastery: number }>;
  strongestTopics: Array<{ topic_name: string; avg_mastery: number }>;
  completionRate: number;
}
