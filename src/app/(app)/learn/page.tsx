import { getChaptersWithProgress } from "@/actions/content";
import { ChapterRoadmap } from "@/components/learn/chapter-roadmap";
import { PageHeader } from "@/components/shared/page-header";
import { redirect } from "next/navigation";

export const metadata = { title: "Lernen – brillen.de Academy" };

export default async function LearnPage() {
  const { data: chapters, error } = await getChaptersWithProgress();

  if (error) redirect("/login");

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="Lernpfad"
        description="Arbeite dich durch die Kapitel des Optik-Handbuchs."
      />
      <ChapterRoadmap chapters={chapters || []} />
    </div>
  );
}
