import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { ContentManager } from "@/components/admin/content-manager";

export const metadata = { title: "Inhalte – Admin – brillen.de Academy" };

export default async function AdminContentPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: chapters } = await supabase
    .from("chapters")
    .select("*")
    .order("sort_order");

  const { data: lessons } = await supabase
    .from("lessons")
    .select("*")
    .order("sort_order");

  const { count: questionCount } = await supabase
    .from("questions")
    .select("id", { count: "exact", head: true });

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title="Inhalte verwalten"
        description="Kapitel, Lektionen und Fragen der Lernplattform."
      />
      <ContentManager
        chapters={chapters || []}
        lessons={lessons || []}
        totalQuestions={questionCount || 0}
      />
    </div>
  );
}
