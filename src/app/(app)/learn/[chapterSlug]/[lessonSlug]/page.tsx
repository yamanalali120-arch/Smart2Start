import { getLessonContent } from "@/actions/content";
import { LessonContent } from "@/components/learn/lesson-content";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ chapterSlug: string; lessonSlug: string }>;
}

export default async function LessonPage({ params }: Props) {
  const { chapterSlug, lessonSlug } = await params;
  const { data, error } = await getLessonContent(chapterSlug, lessonSlug);

  if (error || !data) notFound();

  return (
    <div className="max-w-3xl mx-auto">
      <Link href={`/learn/${chapterSlug}`}>
        <Button variant="ghost" size="sm" className="mb-4 -ml-2">
          <ArrowLeft size={16} className="mr-1" />
          Zurück zu {data.chapter.title}
        </Button>
      </Link>

      <LessonContent
        chapter={data.chapter}
        lesson={data.lesson}
        contentBlocks={data.contentBlocks}
        questions={data.questions}
      />
    </div>
  );
}