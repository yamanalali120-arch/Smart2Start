"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/database";
import {
  LayoutDashboard,
  BookOpen,
  RefreshCw,
  BarChart3,
  User,
  GraduationCap,
  Menu,
  X,
  LogOut,
  Zap,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { toast } from "sonner";

interface AppHeaderProps {
  profile: Profile;
}

const mobileNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/learn", label: "Lernen", icon: BookOpen },
  { href: "/review", label: "Wiederholen", icon: RefreshCw },
  { href: "/progress", label: "Fortschritt", icon: BarChart3 },
  { href: "/profile", label: "Profil", icon: User },
];

export function AppHeader({ profile }: AppHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Erfolgreich abgemeldet.");
    router.push("/login");
    router.refresh();
  };

  // Get page title from pathname
  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Dashboard";
    if (pathname.startsWith("/learn")) return "Lernen";
    if (pathname.startsWith("/review")) return "Wiederholen";
    if (pathname.startsWith("/progress")) return "Fortschritt";
    if (pathname.startsWith("/profile")) return "Profil";
    if (pathname.startsWith("/admin")) return "Administration";
    if (pathname.startsWith("/quiz")) return "Quiz";
    return "Academy";
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-card/80 backdrop-blur-sm px-4 md:px-6 lg:px-8">
      {/* Mobile menu button */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetTrigger asChild>
          <button className="rounded-lg p-2 text-muted-foreground hover:bg-muted lg:hidden">
            <Menu size={20} />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          {/* Mobile nav header */}
          <div className="flex h-16 items-center gap-3 border-b px-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-green-500 text-white">
              <GraduationCap size={20} />
            </div>
            <div>
              <p className="text-sm font-bold leading-none">Brillen-Optiker-Academy.de</p>
              <p className="text-xs text-brand-green-500 font-medium">Academy</p>
            </div>
          </div>
          {/* Mobile nav links */}
          <nav className="space-y-1 p-3">
            {mobileNavItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
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
          </nav>
          {/* Mobile user section */}
          <div className="absolute bottom-0 left-0 right-0 border-t p-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <LogOut size={18} />
              Abmelden
            </button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Page title */}
      <h1 className="text-lg font-semibold">{getPageTitle()}</h1>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-3">
        {/* XP Badge */}
        <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-brand-green-50 px-3 py-1.5 text-sm font-semibold text-brand-green-700">
          <Zap size={14} className="text-brand-green-500" />
          {profile.total_xp} XP
        </div>

        {/* Avatar */}
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-green-100 text-brand-green-700 text-xs font-bold">
          {profile.display_name.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}
