import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface BadgeDisplay {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface BadgeGalleryProps {
  allBadges: BadgeDisplay[];
  earnedBadgeIds: string[];
}

export function BadgeGallery({ allBadges, earnedBadgeIds }: BadgeGalleryProps) {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Award size={20} className="text-yellow-500" />
          Abzeichen ({earnedBadgeIds.length}/{allBadges.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {allBadges.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Abzeichen werden bald verfügbar sein!
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {allBadges.map((badge) => {
              const isEarned = earnedBadgeIds.includes(badge.id);
              return (
                <div
                  key={badge.id}
                  className={cn(
                    "flex flex-col items-center text-center rounded-xl p-4 border transition-all",
                    isEarned
                      ? "bg-yellow-50 border-yellow-200 shadow-sm"
                      : "bg-muted/30 border-dashed border-muted opacity-50"
                  )}
                >
                  <span className="text-3xl mb-2">{badge.icon}</span>
                  <p className="text-xs font-semibold">{badge.name}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {badge.description}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
