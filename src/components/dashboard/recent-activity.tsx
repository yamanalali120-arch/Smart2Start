import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

export function RecentActivity() {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Clock size={18} className="text-muted-foreground" />
          Letzte Aktivität
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground text-center py-4">
          Starte eine Lektion, um deine Aktivität zu sehen.
        </p>
      </CardContent>
    </Card>
  );
}
