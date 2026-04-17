import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

export function ProgressTimeline() {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock size={20} className="text-muted-foreground" />
          Lernverlauf
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground text-center py-4">
          Dein Lernverlauf wird hier angezeigt, sobald du aktiv lernst.
        </p>
      </CardContent>
    </Card>
  );
}
