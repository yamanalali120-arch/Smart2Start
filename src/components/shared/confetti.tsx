"use client";

import { useState, useEffect } from "react";
import ReactConfetti from "react-confetti";

interface ConfettiProps {
  trigger: boolean;
  duration?: number;
}

export function Confetti({ trigger, duration = 3000 }: ConfettiProps) {
  const [show, setShow] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setDimensions({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  useEffect(() => {
    if (trigger) {
      setShow(true);
      const timer = setTimeout(() => setShow(false), duration);
      return () => clearTimeout(timer);
    }
  }, [trigger, duration]);

  if (!show) return null;

  return (
    <ReactConfetti
      width={dimensions.width}
      height={dimensions.height}
      recycle={false}
      numberOfPieces={200}
      colors={["#2D8C3C", "#4ade80", "#8B2252", "#fbbf24", "#60a5fa"]}
    />
  );
}
