"use client";

import { useState } from "react";
import type { ReviewQueueItemWithQuestion } from "@/types/database";
import { ReviewCard } from "./review-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, CheckCircle } from "lucide-react";

interface ReviewQueueProps {
  initialItems: ReviewQueueItemWithQuestion[];
}

export function ReviewQueue({ initialItems }: ReviewQueueProps) {
  const [items] = useState(initialItems);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const currentItem = items[currentIndex];

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) setTotalCorrect((prev) => prev + 1);
  };

  const handleNext = () => {
    if (currentIndex + 1 >= items.length) {
      setIsComplete(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  if (isComplete) {
    return (
      <Card className="border-0 shadow-lg text-center">
        <CardContent className="py-12">
          <CheckCircle size={48} className="mx-auto text-brand-green-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Wiederholung abgeschlossen!</h2>
          <p className="text-muted-foreground mb-4">
            {totalCorrect} von {items.length} Fragen richtig beantwortet.
          </p>
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-green-50 px-4 py-2 text-brand-green-700 font-semibold mb-6">
            <Zap size={18} />
            +{totalCorrect * 3} XP
          </div>
          <div>
            <Button
              className="bg-brand-green-500 hover:bg-brand-green-600 text-white"
              onClick={() => window.location.reload()}
            >
              Fertig
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentItem) return null;

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Frage {currentIndex + 1} von {items.length}</span>
        <span>{totalCorrect} richtig</span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-brand-green-500 transition-all"
          style={{ width: `${((currentIndex + 1) / items.length) * 100}%` }}
        />
      </div>

      <ReviewCard
        item={currentItem}
        onAnswer={handleAnswer}
        onNext={handleNext}
      />
    </div>
  );
}
