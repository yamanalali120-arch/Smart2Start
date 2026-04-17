import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown } from "lucide-react";
import { getMasteryLabel } from "@/lib/constants";

interface TopicEntry {
  mastery_score: number;
  topic: { name: string; slug: string };
}

interface WeakTopicsCardProps {
  topics: TopicEntry[];
}

export function WeakTopicsCard({ topics }: WeakTopicsCardProps) {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <TrendingDown size={18} className="text-orange-500" />
          Themen zum Üben
        </CardTitle>
      </CardHeader>
      <CardContent>
        {topics.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            Keine schwachen Themen – super! 🎉
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
                      className="h-full rounded-full bg-orange-400 transition-all"
                      style={{ width: `${t.mastery_score}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-orange-500 w-8 text-right">
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
