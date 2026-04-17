"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/providers/auth-provider";
import type { UserStreak } from "@/types/database";

export function useStreak() {
  const [streak, setStreak] = useState<UserStreak | null>(null);
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
        .from("user_streaks")
        .select("*")
        .eq("user_id", user.id)
        .single();

      setStreak(data as UserStreak | null);
      setIsLoading(false);
    };

    fetch();
  }, [user, supabase]);

  return { streak, isLoading };
}
