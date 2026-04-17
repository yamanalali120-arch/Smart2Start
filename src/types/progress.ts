export interface ProgressOverview {
  totalChapters: number;
  completedChapters: number;
  totalLessons: number;
  completedLessons: number;
  overallPercent: number;
  totalXp: number;
  currentLevel: number;
  currentStreak: number;
  longestStreak: number;
  totalCorrect: number;
  totalIncorrect: number;
  averageMastery: number;
}

export interface TopicMasteryDisplay {
  topicName: string;
  topicSlug: string;
  topicIcon: string | null;
  topicColor: string | null;
  masteryScore: number;
  masteryLabel: string;
  totalSeen: number;
  totalCorrect: number;
}
