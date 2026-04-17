import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LessonContentBlock, Json } from "@/types/database";
import { Info, AlertTriangle, Lightbulb, List } from "lucide-react";
import { cn } from "@/lib/utils";

interface KnowledgeCardProps {
  block: LessonContentBlock;
}

const typeStyles: Record<string, { icon: typeof Info; bg: string; border: string; iconColor: string }> = {
  text: { icon: Info, bg: "bg-white", border: "border-gray-200", iconColor: "text-blue-500" },
  definition: { icon: Info, bg: "bg-blue-50", border: "border-blue-200", iconColor: "text-blue-600" },
  tip: { icon: Lightbulb, bg: "bg-yellow-50", border: "border-yellow-200", iconColor: "text-yellow-600" },
  warning: { icon: AlertTriangle, bg: "bg-red-50", border: "border-red-200", iconColor: "text-red-500" },
  list: { icon: List, bg: "bg-white", border: "border-gray-200", iconColor: "text-gray-500" },
  summary: { icon: Info, bg: "bg-green-50", border: "border-green-200", iconColor: "text-green-600" },
  comparison: { icon: Info, bg: "bg-purple-50", border: "border-purple-200", iconColor: "text-purple-500" },
};

export function KnowledgeCard({ block }: KnowledgeCardProps) {
  const style = typeStyles[block.type] || typeStyles.text;
  const Icon = style.icon;
  const content = block.content as Record<string, Json>;

  return (
    <Card className={cn("border shadow-sm", style.bg, style.border)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Icon size={18} className={style.iconColor} />
          {block.title || getBlockTypeLabel(block.type)}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Text content */}
        {(block.type === "text" || block.type === "summary" || block.type === "tip" || block.type === "warning") && (
          <p className="text-sm leading-relaxed whitespace-pre-line">
            {content.body as string}
          </p>
        )}

        {/* Definition */}
        {block.type === "definition" && (
          <div>
            <p className="font-semibold text-sm mb-1">{content.term as string}</p>
            <p className="text-sm text-muted-foreground">{content.definition as string}</p>
          </div>
        )}

        {/* List */}
        {block.type === "list" && (
          <ul className={cn("space-y-1 text-sm", content.ordered ? "list-decimal pl-4" : "list-disc pl-4")}>
            {(content.items as string[])?.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        )}

        {/* Comparison */}
        {block.type === "comparison" && (
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-white p-3 border">
              <p className="font-semibold text-sm mb-1">
                {(content.left as Record<string, string>)?.title}
              </p>
              <p className="text-xs text-muted-foreground">
                {(content.left as Record<string, string>)?.description}
              </p>
            </div>
            <div className="rounded-lg bg-white p-3 border">
              <p className="font-semibold text-sm mb-1">
                {(content.right as Record<string, string>)?.title}
              </p>
              <p className="text-xs text-muted-foreground">
                {(content.right as Record<string, string>)?.description}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function getBlockTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    text: "Information",
    definition: "Definition",
    tip: "Tipp",
    warning: "Achtung",
    list: "Übersicht",
    summary: "Zusammenfassung",
    comparison: "Vergleich",
  };
  return labels[type] || "Info";
}
