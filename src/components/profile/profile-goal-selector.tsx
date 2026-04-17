"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface ProfileGoalSelectorProps {
  userId: string;
  currentGoal: number;
}

export function ProfileGoalSelector({ userId, currentGoal }: ProfileGoalSelectorProps) {
  const [goal, setGoal] = useState(String(currentGoal));
  const supabase = createClient();

  const handleChange = async (value: string) => {
    setGoal(value);
    const { error } = await supabase
      .from("profiles")
      .update({ daily_goal_minutes: parseInt(value) })
      .eq("id", userId);

    if (error) {
      toast.error("Fehler beim Speichern.");
    } else {
      toast.success(`Tagesziel auf ${value} Minuten gesetzt.`);
    }
  };

  return (
    <Select value={goal} onValueChange={handleChange}>
      <SelectTrigger className="w-32 h-8 text-sm">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="5">5 Minuten</SelectItem>
        <SelectItem value="10">10 Minuten</SelectItem>
        <SelectItem value="15">15 Minuten</SelectItem>
        <SelectItem value="20">20 Minuten</SelectItem>
      </SelectContent>
    </Select>
  );
}
