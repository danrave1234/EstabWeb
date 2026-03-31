import { AlertCircle, CheckCircle2, CircleDashed, Loader2 } from "lucide-react";

import type { TemplateGenerationLogEntry, TemplateGenerationLogStatus } from "@/lib/utils/template-generation-activity";

type TemplateGenerationActivityLogProps = {
  entries: TemplateGenerationLogEntry[];
  summary?: string[];
  errorMessage?: string;
  isRunning?: boolean;
};

function statusClasses(status: TemplateGenerationLogStatus): string {
  switch (status) {
    case "success":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-600";
    case "active":
      return "border-primary/20 bg-primary/10 text-primary";
    case "error":
      return "border-destructive/20 bg-destructive/10 text-destructive";
    default:
      return "border-border bg-muted/40 text-muted-foreground";
  }
}

function StatusIcon({ status }: { status: TemplateGenerationLogStatus }) {
  switch (status) {
    case "success":
      return <CheckCircle2 className="h-3.5 w-3.5" />;
    case "active":
      return <Loader2 className="h-3.5 w-3.5 animate-spin" />;
    case "error":
      return <AlertCircle className="h-3.5 w-3.5" />;
    default:
      return <CircleDashed className="h-3.5 w-3.5" />;
  }
}

export default function TemplateGenerationActivityLog({
  entries,
  summary = [],
  errorMessage,
  isRunning = false,
}: TemplateGenerationActivityLogProps) {
  if (!entries.length && !summary.length && !errorMessage) {
    return null;
  }

  const badgeLabel = errorMessage ? "Needs attention" : isRunning ? "Live" : "Ready";
  const badgeClasses = errorMessage
    ? "bg-destructive/10 text-destructive"
    : isRunning
      ? "bg-primary/10 text-primary"
      : "bg-emerald-500/10 text-emerald-600";

  return (
    <div className="space-y-3 rounded-xl border border-border bg-background/80 p-3" data-testid="template-generation-activity-log">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-muted-foreground">Generation activity</p>
          <p className="mt-1 text-[11px] text-muted-foreground">A quick view of what the AI is doing with your template request.</p>
        </div>
        <span className={`inline-flex items-center rounded-full px-2 py-1 text-[10px] font-semibold ${badgeClasses}`}>
          {badgeLabel}
        </span>
      </div>

      <div className="space-y-2">
        {entries.map((entry) => (
          <div key={entry.id} className="flex items-start gap-2 rounded-lg border border-border/60 bg-muted/20 px-2.5 py-2">
            <span className={`mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full border ${statusClasses(entry.status)}`}>
              <StatusIcon status={entry.status} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold text-foreground">{entry.label}</p>
              <p className="text-[10px] leading-4 text-muted-foreground">{entry.detail}</p>
            </div>
          </div>
        ))}
      </div>

      {summary.length > 0 && (
        <div className="rounded-lg border border-border/60 bg-muted/30 px-2.5 py-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">What AI used</p>
          <ul className="mt-2 space-y-1 text-[10px] text-muted-foreground">
            {summary.map((item, index) => (
              <li key={`${item}-${index}`} className="flex gap-2">
                <span aria-hidden="true">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {errorMessage && <p className="text-[10px] font-medium text-destructive">{errorMessage}</p>}
    </div>
  );
}