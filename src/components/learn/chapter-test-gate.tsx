import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Lock } from "lucide-react";

interface ChapterTestGateProps {
  isUnlocked: boolean;
  completedLessons: number;
  totalLessons: number;
  onStart: () => void;
}

export function ChapterTestGate({ isUnlocked, completedLessons, totalLessons, onStart }: ChapterTestGateProps) {
  return (
    <Card className="border-2 border-dashed border-yellow-300 bg-yellow-50/50">
      <CardContent className="p-6 text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-yellow-100">
          {isUnlocked ? (
            <Trophy size={24} className="text-yellow-600" />
          ) : (
            <Lock size={24} className="text-yellow-500" />
          )}
        </div>
        <h3 className="text-lg font-bold mb-1">Kapiteltest</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {isUnlocked
            ? "Alle Lektionen abgeschlossen! Bereit für den Kapiteltest?"
            : `Schließe erst alle Lektionen ab (${completedLessons}/${totalLessons}).`}
        </p>
        <Button
          disabled={!isUnlocked}
          onClick={onStart}
          className="bg-yellow-500 hover:bg-yellow-600 text-white"
        >
          {isUnlocked ? "Test starten" : "Noch nicht verfügbar"}
        </Button>
      </CardContent>
    </Card>
  );
}
