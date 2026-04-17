import { Card, CardContent } from "@/components/ui/card";
import { Zap, Flame, CheckCircle, XCircle, RotateCcw, Trophy } from "lucide-react";

interface StatsGridProps {
  totalXp: number;
  level: number;
  streak: number;
  totalCorrect: number;
  totalIncorrect: number;
  reviewDue: number;
}

export function StatsGrid({ totalXp, level, streak, totalCorrect, totalIncorrect, reviewDue }: StatsGridProps) {
  const stats = [
    { label: "XP gesamt", value: totalXp, icon: Zap, color: "text-yellow-500", bg: "bg-yellow-50" },
    { label: "Level", value: level, icon: Trophy, color: "text-brand-green-500", bg: "bg-green-50" },
    { label: "Streak", value: `${streak} Tage`, icon: Flame, color: "text-orange-500", bg: "bg-orange-50" },
    { label: "Richtig", value: totalCorrect, icon: CheckCircle, color: "text-green-500", bg: "bg-green-50" },
    { label: "Falsch", value: totalIncorrect, icon: XCircle, color: "text-red-500", bg: "bg-red-50" },
    { label: "Wiederholen", value: reviewDue, icon: RotateCcw, color: "text-blue-500", bg: "bg-blue-50" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className={`mb-2 inline-flex rounded-lg p-2 ${stat.bg}`}>
              <stat.icon size={18} className={stat.color} />
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
