import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain } from "lucide-react";

interface MasteryRadarProps {
  averageMastery: number;
}

export function MasteryRadar({ averageMastery }: MasteryRadarProps) {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Brain size={18} className="text-purple-500" />
          Gesamtmeisterung
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <div className="relative inline-flex h-28 w-28 items-center justify-center">
          <svg className="h-28 w-28 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted" />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 42}`}
              strokeDashoffset={`${2 * Math.PI * 42 * (1 - averageMastery / 100)}`}
              className="text-purple-500"
              style={{ transition: "stroke-dashoffset 1s ease" }}
            />
          </svg>
          <span className="absolute text-2xl font-bold">{averageMastery}%</span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">Durchschnittliche Meisterung</p>
      </CardContent>
    </Card>
  );
}
