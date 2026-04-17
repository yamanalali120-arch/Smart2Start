"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/providers/auth-provider";
import type { UserTopicMastery, Topic } from "@/types/database";

export interface TopicMasteryWithName extends UserTopicMastery {
  topic: Topic;
}

export function useTopicMastery() {
  const [masteries, setMasteries] = useState<TopicMasteryWithName[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const supabase = createClient();

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetch = async () => {
      const { data } = await supabase
        .from("user_topic_mastery")
        .select("*, topic:topics(*)")
        .eq("user_id", user.id)
        .order("mastery_score", { ascending: false });

      setMasteries((data as TopicMasteryWithName[] | null) || []);
      setIsLoading(false);
    };

    fetch();
  }, [user, supabase]);

  const strongTopics = masteries.filter((m) => m.mastery_score >= 70).slice(0, 5);
  const weakTopics = masteries
    .filter((m) => m.total_questions_seen > 0 && m.mastery_score < 50)
    .sort((a, b) => a.mastery_score - b.mastery_score)
    .slice(0, 5);

  const averageMastery =
    masteries.length > 0
      ? Math.round(masteries.reduce((sum, m) => sum + m.mastery_score, 0) / masteries.length)
      : 0;

  return { masteries, strongTopics, weakTopics, averageMastery, isLoading };
}
