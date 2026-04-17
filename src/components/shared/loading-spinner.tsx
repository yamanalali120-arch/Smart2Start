import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  size?: number;
  text?: string;
}

export function LoadingSpinner({ className, size = 24, text }: LoadingSpinnerProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 py-12", className)}>
      <Loader2 size={size} className="animate-spin text-brand-green-500" />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  );
}
