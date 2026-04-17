import { getChapterLessons } from "@/actions/content";
import { LessonList } from "@/components/learn/lesson-list";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ chapterSlug: string }>;
}

export default async function ChapterPage({ params }: Props) {
  const { chapterSlug } = await params;
  const { data: lessons, chapter, error } = await getChapterLessons(chapterSlug);

  if (error || !chapter) notFound();

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/learn">
        <Button variant="ghost" size="sm" className="mb-4 -ml-2">
          <ArrowLeft size={16} className="mr-1" />
          Zurück zum Lernpfad
        </Button>
      </Link>

      <PageHeader
        title={chapter.title}
        description={chapter.description}
      />

      {/* Learning objectives */}
      {chapter.learning_objectives && chapter.learning_objectives.length > 0 && (
        <div className="mb-6 rounded-xl bg-brand-green-50 border border-brand-green-200 p-4">
          <p className="text-sm font-semibold text-brand-green-700 mb-2">🎯 Lernziele:</p>
          <ul className="space-y-1">
            {chapter.learning_objectives.map((obj: string, i: number) => (
              <li key={i} className="text-sm text-brand-green-600 flex items-start gap-2">
                <span className="mt-0.5">✓</span>
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <LessonList lessons={lessons || []} chapterSlug={chapterSlug} />
    </div>
  );
}