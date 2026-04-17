import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame } from "lucide-react";

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
}

export function StreakCard({ currentStreak, longestStreak }: StreakCardProps) {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Flame size={18} className="text-orange-500" />
          Lernserie
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-4">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-red-500 text-white text-2xl font-bold shadow-lg">
            {currentStreak}
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {currentStreak === 1 ? "Tag in Folge" : "Tage in Folge"}
          </p>
        </div>
        <div className="rounded-lg bg-muted/50 p-3 text-center">
          <p className="text-xs text-muted-foreground">Längste Serie</p>
          <p className="text-lg font-bold text-orange-600">{longestStreak} Tage</p>
        </div>
        {currentStreak > 0 && (
          <p className="mt-3 text-center text-sm text-brand-green-600 font-medium">
            🔥 Weiter so! Nicht aufhören!
          </p>
        )}
      </CardContent>
    </Card>
  );
}