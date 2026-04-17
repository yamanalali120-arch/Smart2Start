import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import type { Profile } from "@/types/database";
import { getLevelInfo } from "@/lib/xp";
import { formatDate } from "@/lib/utils";

interface UserDetailSheetProps {
  user: Profile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserDetailSheet({ user, open, onOpenChange }: UserDetailSheetProps) {
  if (!user) return null;

  const levelInfo = getLevelInfo(user.total_xp);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{user.display_name}</SheetTitle>
          <SheetDescription>@{user.username}</SheetDescription>
        </SheetHeader>
        <div className="space-y-4 mt-6">
          <div className="flex justify-between py-2 border-b">
            <span className="text-sm text-muted-foreground">Rolle</span>
            <span className="text-sm font-medium">{user.role === "admin" ? "Admin" : "Lernender"}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-sm text-muted-foreground">Level</span>
            <span className="text-sm font-medium">{levelInfo.level}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-sm text-muted-foreground">XP</span>
            <span className="text-sm font-medium">{user.total_xp}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-sm text-muted-foreground">Tagesziel</span>
            <span className="text-sm font-medium">{user.daily_goal_minutes} Min.</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-sm text-muted-foreground">Erstellt</span>
            <span className="text-sm font-medium">{formatDate(user.created_at)}</span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
