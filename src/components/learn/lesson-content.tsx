"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { KnowledgeCard } from "./knowledge-card";
import { MnemonicCard } from "./mnemonic-card";
import { QuizEngine } from "@/components/quiz/quiz-engine";
import type { Chapter, Lesson, LessonContentBlock, Question } from "@/types/database";
import { BookOpen, Zap, ArrowRight } from "lucide-react";

interface LessonContentProps {
  chapter: Chapter;
  lesson: Lesson;
  contentBlocks: LessonContentBlock[];
  questions: Question[];
}

type Phase = "content" | "quiz" | "complete";

export function LessonContent({ chapter, lesson, contentBlocks, questions }: LessonContentProps) {
  const [phase, setPhase] = useState<Phase>("content");
  const [contentIndex, setContentIndex] = useState(0);

  const totalContentSteps = contentBlocks.length;
  const currentBlock = contentBlocks[contentIndex];
  const contentProgress = totalContentSteps > 0 ? ((contentIndex + 1) / totalContentSteps) * 100 : 100;

  const handleNextContent = () => {
    if (contentIndex < totalContentSteps - 1) {
      setContentIndex(contentIndex + 1);
    } else if (questions.length > 0) {
      setPhase("quiz");
    } else {
      setPhase("complete");
    }
  };

  const handlePrevContent = () => {
    if (contentIndex > 0) {
      setContentIndex(contentIndex - 1);
    }
  };

  if (phase === "quiz") {
    return (
      <QuizEngine
        questions={questions}
        lessonId={lesson.id}
        chapterId={chapter.id}
        lessonTitle={lesson.title}
        xpReward={lesson.xp_reward}
        onComplete={() => setPhase("complete")}
      />
    );
  }

  if (phase === "complete") {
    return (
      <Card className="border-0 shadow-lg text-center">
        <CardContent className="py-12">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold mb-2">Lektion abgeschlossen!</h2>
          <p className="text-muted-foreground mb-4">
            Du hast &quot;{lesson.title}&quot; erfolgreich bearbeitet.
          </p>
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-green-50 px-4 py-2 text-brand-green-700 font-semibold mb-6">
            <Zap size={18} />
            +{lesson.xp_reward} XP
          </div>
          <div>
            <Button
              className="bg-brand-green-500 hover:bg-brand-green-600 text-white"
              asChild
            >
              <a href={`/learn/${chapter.slug}`}>Weiter zum Kapitel</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Badge variant="outline" className="mb-2">
            <BookOpen size={12} className="mr-1" />
            {lesson.type === "introduction" ? "Einführung" : "Wissen"}
          </Badge>
          <h2 className="text-xl font-bold">{lesson.title}</h2>
        </div>
        <Badge variant="outline">
          {contentIndex + 1} / {totalContentSteps}
        </Badge>
      </div>

      {/* Progress */}
      <Progress value={contentProgress} className="h-2" />

      {/* Content Block */}
      {currentBlock && (
        <div className="animate-slide-up-fade">
          {currentBlock.type === "mnemonic" ? (
            <MnemonicCard block={currentBlock} />
          ) : (
            <KnowledgeCard block={currentBlock} />
          )}
        </div>
      )}

      {totalContentSteps === 0 && (
        <Card className="border-0 shadow-sm">
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">Diese Lektion hat noch keine Inhalte.</p>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-2">
        <Button
          variant="outline"
          onClick={handlePrevContent}
          disabled={contentIndex === 0}
        >
          Zurück
        </Button>
        <Button
          className="bg-brand-green-500 hover:bg-brand-green-600 text-white"
          onClick={handleNextContent}
        >
          {contentIndex < totalContentSteps - 1 ? (
            <>Weiter <ArrowRight size={16} className="ml-1" /></>
          ) : questions.length > 0 ? (
            <>Zum Quiz <ArrowRight size={16} className="ml-1" /></>
          ) : (
            "Abschließen"
          )}
        </Button>
      </div>
    </div>
  );
}
