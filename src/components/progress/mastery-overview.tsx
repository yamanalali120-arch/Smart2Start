import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TopicMasteryBar } from "./topic-mastery-bar";
import { BarChart3 } from "lucide-react";
import type { TopicMasteryDisplay } from "@/types/progress";

interface MasteryOverviewProps {
  topics: TopicMasteryDisplay[];
}

export function MasteryOverview({ topics }: MasteryOverviewProps) {
  const averageMastery =
    topics.length > 0
      ? Math.round(topics.reduce((s, t) => s + t.masteryScore, 0) / topics.length)
      : 0;

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 size={20} className="text-brand-green-500" />
            Themenmeisterung
          </CardTitle>
          <div className="text-right">
            <p className="text-2xl font-bold text-brand-green-600">{averageMastery}%</p>
            <p className="text-xs text-muted-foreground">Durchschnitt</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {topics.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Beantworte Fragen, um deine Themenmeisterung zu sehen.
          </p>
        ) : (
          <div className="space-y-3">
            {topics.map((topic) => (
              <TopicMasteryBar key={topic.topicSlug} topic={topic} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
