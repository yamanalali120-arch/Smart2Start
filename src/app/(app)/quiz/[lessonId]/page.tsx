import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { QuizEngine } from "@/components/quiz/quiz-engine";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Props {
  params: Promise<{ lessonId: string }>;
}

export default async function QuizPage({ params }: Props) {
  const { lessonId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Get lesson
  const { data: lesson } = await supabase
    .from("lessons")
    .select("*, chapter:chapters(slug, title)")
    .eq("id", lessonId)
    .single();

  if (!lesson) notFound();

  // Get questions
  const { data: questions } = await supabase
    .from("questions")
    .select("*")
    .eq("lesson_id", lessonId)
    .eq("is_published", true)
    .order("sort_order");

  const chapter = lesson.chapter as unknown as { slug: string; title: string };

  return (
    <div className="max-w-3xl mx-auto">
      <Link href={`/learn/${chapter?.slug || ""}`}>
        <Button variant="ghost" size="sm" className="mb-4 -ml-2">
          <ArrowLeft size={16} className="mr-1" />
          Zurück
        </Button>
      </Link>

      <QuizEngine
        questions={questions || []}
        lessonId={lessonId}
        chapterId={lesson.chapter_id}
        lessonTitle={lesson.title}
        xpReward={lesson.xp_reward}
        onComplete={() => {
          // Client-side redirect handled inside QuizEngine
        }}
      />
    </div>
  );
}
