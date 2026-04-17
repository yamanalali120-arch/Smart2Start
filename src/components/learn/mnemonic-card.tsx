import { Card, CardContent } from "@/components/ui/card";
import type { LessonContentBlock, Json } from "@/types/database";
import { Brain } from "lucide-react";

interface MnemonicCardProps {
  block: LessonContentBlock;
}

export function MnemonicCard({ block }: MnemonicCardProps) {
  const content = block.content as Record<string, Json>;

  return (
    <Card className="border-2 border-brand-green-300 bg-gradient-to-br from-brand-green-50 to-white shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-green-100">
            <Brain size={20} className="text-brand-green-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-brand-green-600 uppercase tracking-wider mb-2">
              💡 Merksatz
            </p>
            <p className="text-base font-medium leading-relaxed text-brand-green-900">
              {content.body as string}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}