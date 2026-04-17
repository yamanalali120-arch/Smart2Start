import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { WelcomeCard } from "@/components/dashboard/welcome-card";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { XpLevelCard } from "@/components/dashboard/xp-level-card";
import { StreakCard } from "@/components/dashboard/streak-card";
import { StrongTopicsCard } from "@/components/dashboard/strong-topics-card";
import { WeakTopicsCard } from "@/components/dashboard/weak-topics-card";
import { DailyGoalCard } from "@/components/dashboard/daily-goal-card";

export const metadata = { title: "Dashboard – brillen.de Academy" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/login");

  // Fetch streak
  const { data: streak } = await supabase
    .from("user_streaks")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // Fetch today's activity
  const today = new Date().toISOString().split("T")[0];
  const { data: todayActivity } = await supabase
    .from("daily_activity")
    .select("*")
    .eq("user_id", user.id)
    .eq("activity_date", today)
    .single();

  // Fetch topic masteries
  const { data: topicMasteries } = await supabase
    .from("user_topic_mastery")
    .select("*, topic:topics(*)")
    .eq("user_id", user.id);

  // Count total correct/incorrect
  const { count: totalCorrect } = await supabase
    .from("quiz_attempts")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("is_correct", true);

  const { count: totalIncorrect } = await supabase
    .from("quiz_attempts")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("is_correct", false);

  // Review count
  const { count: reviewDueCount } = await supabase
    .from("review_queue")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .lte("next_review_at", new Date().toISOString())
    .neq("srs_status", "mastered");

  const masteryList = (topicMasteries || []) as Array<{
    mastery_score: number;
    total_questions_seen: number;
    topic: { name: string; slug: string };
  }>;

  const strongTopics = masteryList
    .filter((m) => m.mastery_score >= 70)
    .sort((a, b) => b.mastery_score - a.mastery_score)
    .slice(0, 5);

  const weakTopics = masteryList
    .filter((m) => m.total_questions_seen > 0 && m.mastery_score < 50)
    .sort((a, b) => a.mastery_score - b.mastery_score)
    .slice(0, 5);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <WelcomeCard displayName={profile.display_name} />

      <StatsGrid
        totalXp={profile.total_xp}
        level={profile.current_level}
        streak={streak?.current_streak || 0}
        totalCorrect={totalCorrect || 0}
        totalIncorrect={totalIncorrect || 0}
        reviewDue={reviewDueCount || 0}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <XpLevelCard totalXp={profile.total_xp} />
        <StreakCard
          currentStreak={streak?.current_streak || 0}
          longestStreak={streak?.longest_streak || 0}
        />
        <DailyGoalCard
          goalMinutes={profile.daily_goal_minutes}
          minutesSpent={todayActivity?.minutes_spent || 0}
          questionsAnswered={todayActivity?.questions_answered || 0}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <StrongTopicsCard topics={strongTopics} />
        <WeakTopicsCard topics={weakTopics} />
      </div>
    </div>
  );
}
