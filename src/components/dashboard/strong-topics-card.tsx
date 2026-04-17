import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { getMasteryLabel } from "@/lib/constants";

interface TopicEntry {
  mastery_score: number;
  topic: { name: string; slug: string };
}

interface StrongTopicsCardProps {
  topics: TopicEntry[];
}

export function StrongTopicsCard({ topics }: StrongTopicsCardProps) {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <TrendingUp size={18} className="text-brand-green-500" />
          Stärkste Themen
        </CardTitle>
      </CardHeader>
      <CardContent>
        {topics.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            Beantworte Fragen, um deine Stärken zu sehen.
          </p>
        ) : (
          <div className="space-y-3">
            {topics.map((t) => (
              <div key={t.topic.slug} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{t.topic.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {getMasteryLabel(t.mastery_score)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-16 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-brand-green-500 transition-all"
                      style={{ width: `${t.mastery_score}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-brand-green-600 w-8 text-right">
                    {Math.round(t.mastery_score)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
