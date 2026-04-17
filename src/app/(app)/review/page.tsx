import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { ReviewQueue } from "@/components/review/review-queue";
import { EmptyState } from "@/components/shared/empty-state";
import { RefreshCw } from "lucide-react";

export const metadata = { title: "Wiederholen – brillen.de Academy" };

export default async function ReviewPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: reviewItems } = await supabase
    .from("review_queue")
    .select("*, question:questions(*)")
    .eq("user_id", user.id)
    .lte("next_review_at", new Date().toISOString())
    .neq("srs_status", "mastered")
    .order("next_review_at")
    .limit(20);

  const items = reviewItems || [];

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader
        title="Wiederholung"
        description={
          items.length > 0
            ? `${items.length} Fragen warten auf Wiederholung.`
            : "Keine Fragen zur Wiederholung fällig."
        }
      />

      {items.length === 0 ? (
        <EmptyState
          icon={RefreshCw}
          title="Alles auf dem neuesten Stand!"
          description="Du hast aktuell keine Fragen zur Wiederholung. Lerne weiter, um neue Fragen freizuschalten."
        />
      ) : (
        <ReviewQueue initialItems={items} />
      )}
    </div>
  );
}