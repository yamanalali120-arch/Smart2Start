"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * Get team analytics (admin only)
 */
export async function getTeamAnalytics() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Nicht authentifiziert.", data: null };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    return { error: "Keine Admin-Berechtigung.", data: null };
  }

  // Total users
  const { count: totalUsers } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("role", "learner");

  // Users active today
  const today = new Date().toISOString().split("T")[0];
  const { count: activeToday } = await supabase
    .from("daily_activity")
    .select("id", { count: "exact", head: true })
    .eq("activity_date", today);

  // Average XP
  const { data: xpData } = await supabase
    .from("profiles")
    .select("total_xp")
    .eq("role", "learner");

  const averageXp =
    xpData && xpData.length > 0
      ? Math.round(xpData.reduce((sum, p) => sum + (p.total_xp || 0), 0) / xpData.length)
      : 0;

  // Weakest topics across all users
  const { data: topicData } = await supabase
    .from("user_topic_mastery")
    .select("topic_id, mastery_score, topic:topics(name)")
    .gt("total_questions_seen", 0);

  const topicAverages = new Map<string, { name: string; total: number; count: number }>();
  if (topicData) {
    for (const item of topicData) {
      const topicName = (item.topic as unknown as { name: string })?.name || "Unbekannt";
      const existing = topicAverages.get(item.topic_id) || { name: topicName, total: 0, count: 0 };
      existing.total += item.mastery_score;
      existing.count += 1;
      topicAverages.set(item.topic_id, existing);
    }
  }

  const topicList = Array.from(topicAverages.values())
    .map((t) => ({ topic_name: t.name, avg_mastery: Math.round(t.total / t.count) }));

  const weakestTopics = [...topicList].sort((a, b) => a.avg_mastery - b.avg_mastery).slice(0, 5);
  const strongestTopics = [...topicList].sort((a, b) => b.avg_mastery - a.avg_mastery).slice(0, 5);

  return {
    error: null,
    data: {
      totalUsers: totalUsers || 0,
      activeToday: activeToday || 0,
      activeThisWeek: 0,
      averageXp,
      averageMastery: topicList.length > 0 ? Math.round(topicList.reduce((s, t) => s + t.avg_mastery, 0) / topicList.length) : 0,
      weakestTopics,
      strongestTopics,
      completionRate: 0,
    },
  };
}
