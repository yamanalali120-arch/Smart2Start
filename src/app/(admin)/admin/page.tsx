import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Users, BookOpen, HelpCircle, TrendingUp } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Admin – brillen.de Academy" };

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { count: userCount } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true });

  const { count: chapterCount } = await supabase
    .from("chapters")
    .select("id", { count: "exact", head: true });

  const { count: questionCount } = await supabase
    .from("questions")
    .select("id", { count: "exact", head: true });

  const cards = [
    {
      title: "Benutzer",
      value: userCount || 0,
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-50",
      href: "/admin/users",
    },
    {
      title: "Kapitel",
      value: chapterCount || 0,
      icon: BookOpen,
      color: "text-brand-green-500",
      bg: "bg-green-50",
      href: "/admin/content",
    },
    {
      title: "Fragen",
      value: questionCount || 0,
      icon: HelpCircle,
      color: "text-orange-500",
      bg: "bg-orange-50",
      href: "/admin/content",
    },
    {
      title: "Analysen",
      value: "→",
      icon: TrendingUp,
      color: "text-purple-500",
      bg: "bg-purple-50",
      href: "/admin/analytics",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title="Admin-Dashboard"
        description="Übersicht über die Lernplattform."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Link key={card.title} href={card.href}>
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-5">
                <div className={`inline-flex rounded-lg p-2.5 ${card.bg} mb-3`}>
                  <card.icon size={20} className={card.color} />
                </div>
                <p className="text-2xl font-bold">{card.value}</p>
                <p className="text-sm text-muted-foreground">{card.title}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}