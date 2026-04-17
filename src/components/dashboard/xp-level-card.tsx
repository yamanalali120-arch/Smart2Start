import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLevelInfo } from "@/lib/xp";
import { Zap } from "lucide-react";

interface XpLevelCardProps {
  totalXp: number;
}

export function XpLevelCard({ totalXp }: XpLevelCardProps) {
  const info = getLevelInfo(totalXp);

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Zap size={18} className="text-yellow-500" />
          XP & Level
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-4">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-green-400 to-brand-green-600 text-white text-2xl font-bold shadow-lg">
            {info.level}
          </div>
          <p className="mt-2 text-sm text-muted-foreground">Level {info.level}</p>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{info.xpInCurrentLevel} XP</span>
            <span className="font-medium">{info.xpNeededForNextLevel} XP</span>
          </div>
          <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-green-400 to-brand-green-600 transition-all duration-700"
              style={{ width: `${info.percentToNextLevel}%` }}
            />
          </div>
          <p className="text-xs text-center text-muted-foreground">
            Noch {info.xpNeededForNextLevel - info.xpInCurrentLevel} XP bis Level {info.level + 1}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
