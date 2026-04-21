import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getLevelInfo } from "@/lib/xp";
import { formatDate } from "@/lib/utils";
import { Zap, Trophy, Calendar, Target, BookOpen, HelpCircle, Flame } from "lucide-react";
import { ProfileGoalSelector } from "@/components/profile/profile-goal-selector";

export const metadata = { title: "Profil – Brillen Optiker Academy" };

export default async function ProfilePage() {
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

  const { data: streak } = await supabase
    .from("user_streaks")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const { count: totalLessonsCompleted } = await supabase
    .from("user_lesson_progress")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "completed");

  const { count: totalQuestionsAnswered } = await supabase
    .from("quiz_attempts")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  const levelInfo = getLevelInfo(profile.total_xp);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <PageHeader title="Dein Profil" />

      {/* Profile Header */}
      <Card className="border-0 shadow-sm overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-brand-green-500 to-brand-green-600" />
        <CardContent className="-mt-12 pb-6">
          <div className="flex items-end gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white text-brand-green-700 text-2xl font-bold shadow-lg border-4 border-white">
              {profile.display_name.charAt(0).toUpperCase()}
            </div>
            <div className="pb-1">
              <h2 className="text-xl font-bold">{profile.display_name}</h2>
              <p className="text-sm text-muted-foreground">@{profile.username}</p>
              <Badge variant="outline" className="mt-1">
                {profile.role === "admin" ? "Administrator" : "Lernender"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 text-center">
            <Zap size={20} className="mx-auto text-yellow-500 mb-1" />
            <p className="text-xl font-bold">{profile.total_xp}</p>
            <p className="text-xs text-muted-foreground">XP gesamt</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 text-center">
            <Trophy size={20} className="mx-auto text-brand-green-500 mb-1" />
            <p className="text-xl font-bold">{levelInfo.level}</p>
            <p className="text-xs text-muted-foreground">Level</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 text-center">
            <Flame size={20} className="mx-auto text-orange-500 mb-1" />
            <p className="text-xl font-bold">{streak?.current_streak || 0}</p>
            <p className="text-xs text-muted-foreground">Tage-Streak</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 text-center">
            <BookOpen size={20} className="mx-auto text-blue-500 mb-1" />
            <p className="text-xl font-bold">{totalLessonsCompleted || 0}</p>
            <p className="text-xs text-muted-foreground">Lektionen</p>
          </CardContent>
        </Card>
      </div>

      {/* Details */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6 space-y-4">
          <h3 className="font-semibold text-base">Details</h3>
          <div className="grid gap-3">
            <div className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <HelpCircle size={16} />
                Fragen beantwortet
              </div>
              <span className="text-sm font-semibold">{totalQuestionsAnswered || 0}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Flame size={16} />
                Längste Serie
              </div>
              <span className="text-sm font-semibold">{streak?.longest_streak || 0} Tage</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar size={16} />
                Dabei seit
              </div>
              <span className="text-sm font-semibold">{formatDate(profile.created_at)}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Target size={16} />
                Tagesziel
              </div>
              <ProfileGoalSelector
                userId={profile.id}
                currentGoal={profile.daily_goal_minutes}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Level Progress */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <h3 className="font-semibold text-base mb-4">Level-Fortschritt</h3>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-green-400 to-brand-green-600 text-white text-xl font-bold shadow-md">
              {levelInfo.level}
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Level {levelInfo.level}</span>
                <span className="font-medium">Level {levelInfo.level + 1}</span>
              </div>
              <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-green-400 to-brand-green-600 transition-all duration-700"
                  style={{ width: `${levelInfo.percentToNextLevel}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {levelInfo.xpInCurrentLevel} / {levelInfo.xpNeededForNextLevel} XP
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
