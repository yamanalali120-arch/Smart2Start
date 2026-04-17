import type { TeamAnalytics } from "@/types/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, Zap, BarChart3, TrendingDown, TrendingUp } from "lucide-react";

interface AnalyticsDashboardProps {
  analytics: TeamAnalytics;
}

export function AnalyticsDashboard({ analytics }: AnalyticsDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Top stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <Users size={20} className="text-blue-500 mb-2" />
            <p className="text-2xl font-bold">{analytics.totalUsers}</p>
            <p className="text-xs text-muted-foreground">Lernende gesamt</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <UserCheck size={20} className="text-green-500 mb-2" />
            <p className="text-2xl font-bold">{analytics.activeToday}</p>
            <p className="text-xs text-muted-foreground">Heute aktiv</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <Zap size={20} className="text-yellow-500 mb-2" />
            <p className="text-2xl font-bold">{analytics.averageXp}</p>
            <p className="text-xs text-muted-foreground">⌀ XP pro Nutzer</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <BarChart3 size={20} className="text-purple-500 mb-2" />
            <p className="text-2xl font-bold">{analytics.averageMastery}%</p>
            <p className="text-xs text-muted-foreground">⌀ Meisterung</p>
          </CardContent>
        </Card>
      </div>

      {/* Weak & Strong topics */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingDown size={18} className="text-red-500" />
              Schwächste Themen im Team
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.weakestTopics.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Noch nicht genug Daten.
              </p>
            ) : (
              <div className="space-y-3">
                {analytics.weakestTopics.map((topic) => (
                  <div key={topic.topic_name} className="flex items-center justify-between">
                    <span className="text-sm">{topic.topic_name}</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-20 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-red-400"
                          style={{ width: `${topic.avg_mastery}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-red-600 w-8 text-right">
                        {topic.avg_mastery}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp size={18} className="text-green-500" />
              Stärkste Themen im Team
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.strongestTopics.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Noch nicht genug Daten.
              </p>
            ) : (
              <div className="space-y-3">
                {analytics.strongestTopics.map((topic) => (
                  <div key={topic.topic_name} className="flex items-center justify-between">
                    <span className="text-sm">{topic.topic_name}</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-20 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-green-400"
                          style={{ width: `${topic.avg_mastery}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-green-600 w-8 text-right">
                        {topic.avg_mastery}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
