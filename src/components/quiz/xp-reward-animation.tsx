"use client";

import { useEffect, useState } from "react";
import { Zap } from "lucide-react";

interface XpRewardAnimationProps {
  xp: number;
  show: boolean;
}

export function XpRewardAnimation({ xp, show }: XpRewardAnimationProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      <div className="animate-xp-pop flex items-center gap-1 rounded-full bg-yellow-400 px-4 py-2 text-white font-bold shadow-lg">
        <Zap size={18} />
        +{xp} XP
      </div>
    </div>
  );
}
