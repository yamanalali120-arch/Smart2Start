"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { getLevelInfo } from "@/lib/xp";
import type { Profile } from "@/types/database";
import { createClient } from "@/lib/supabase/client";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  LayoutDashboard,
  BookOpen,
  RefreshCw,
  BarChart3,
  User,
  Shield,
  Users,
  FileText,
  TrendingUp,
  GraduationCap,
  LogOut,
  Zap,
} from "lucide-react";

interface AppSidebarProps {
  profile: Profile;
}

const learnerNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/learn", label: "Lernen", icon: BookOpen },
  { href: "/review", label: "Wiederholen", icon: RefreshCw },
  { href: "/progress", label: "Fortschritt", icon: BarChart3 },
  { href: "/profile", label: "Profil", icon: User },
];

const adminNavItems = [
  { href: "/admin", label: "Admin Übersicht", icon: Shield },
  { href: "/admin/users", label: "Benutzer", icon: Users },
  { href: "/admin/content", label: "Inhalte", icon: FileText },
  { href: "/admin/analytics", label: "Analysen", icon: TrendingUp },
];

export function AppSidebar({ profile }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const levelInfo = getLevelInfo(profile.total_xp);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Erfolgreich abgemeldet.");
    router.push("/login");
    router.refresh();
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-72 flex-col border-r bg-card lg:flex">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-green-500 text-white">
          <GraduationCap size={20} />
        </div>
        <div>
          <p className="text-sm font-bold leading-none">Brillen-Optiker-Academy.de</p>
          <p className="text-xs text-brand-green-500 font-medium">Academy</p>
        </div>
      </div>

      {/* Level & XP Card */}
      <div className="mx-4 mt-4 rounded-xl bg-gradient-to-br from-brand-green-500 to-brand-green-700 p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium opacity-80">Level {levelInfo.level}</p>
            <p className="text-lg font-bold">{profile.total_xp} XP</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
            <Zap size={20} />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex justify-between text-xs opacity-80 mb-1">
            <span>{levelInfo.xpInCurrentLevel} XP</span>
            <span>{levelInfo.xpNeededForNextLevel} XP</span>
          </div>
          <div className="h-2 w-full rounded-full bg-white/20 overflow-hidden">
            <div
              className="h-full rounded-full bg-white transition-all duration-500"
              style={{ width: `${levelInfo.percentToNextLevel}%` }}
            />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 pt-4 overflow-y-auto">
        <p className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Lernen
        </p>
        {learnerNavItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-brand-green-500/10 text-brand-green-600"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}

        {/* Admin section */}
        {profile.role === "admin" && (
          <>
            <div className="my-4 h-px bg-border" />
            <p className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Administration
            </p>
            {adminNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-brand-plum-500/10 text-brand-plum-500"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </>
        )}
      </nav>

      {/* User section */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-green-100 text-brand-green-700 text-sm font-bold">
            {profile.display_name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{profile.display_name}</p>
            <p className="text-xs text-muted-foreground truncate">{profile.username}</p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            title="Abmelden"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
