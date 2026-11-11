import { Check, X } from "lucide-react";
import { formatShortDate } from "@/lib/format";
import { STATUS_FLOW, STATUS_LABELS, type OrderStatus } from "@/lib/status";
import { cn } from "@/lib/utils";

type HistoryEntry = { toStatus: OrderStatus; changedAt: Date };

/**
 * Stepper progres order (Intake → Assessment → On Process → Completed →
 * Diambil). Tanggal di bawah tiap langkah diambil dari riwayat status. Order
 * yang ditolak berhenti di langkah terakhir yang sempat dicapai + "Ditolak".
 */
export function OrderProgress({
  status,
  history,
}: {
  status: OrderStatus;
  history: HistoryEntry[];
}) {
  const reachedAt = new Map<OrderStatus, Date>();
  for (const entry of history) {
    if (!reachedAt.has(entry.toStatus)) reachedAt.set(entry.toStatus, entry.changedAt);
  }

  let steps: OrderStatus[];
  if (status === "REJECTED") {
    steps = [
      "INTAKE",
      ...(reachedAt.has("ASSESSMENT") ? (["ASSESSMENT"] as OrderStatus[]) : []),
      "REJECTED",
    ];
  } else {
    steps = STATUS_FLOW;
  }
  const currentIndex = steps.indexOf(status);

  return (
    <ol className="flex items-start">
      {steps.map((step, index) => {
        const done = index < currentIndex;
        const current = index === currentIndex;
        const rejected = step === "REJECTED";
        const date = reachedAt.get(step);
        return (
          <li key={step} className="relative flex flex-1 flex-col items-center text-center">
            {index > 0 && (
              <span
                aria-hidden="true"
                className={cn(
                  "absolute top-4 right-1/2 h-0.5 w-full -translate-y-1/2",
                  index <= currentIndex ? (rejected ? "bg-rose-300" : "bg-primary") : "bg-border",
                )}
              />
            )}
            <span
              className={cn(
                "relative z-10 grid size-8 place-items-center rounded-full text-xs font-semibold ring-4 ring-card transition-colors",
                done && "bg-primary text-primary-foreground",
                current && !rejected && "bg-brand text-brand-foreground ring-brand/25",
                current && rejected && "bg-rose-600 text-white",
                !done && !current && "border border-border bg-card text-muted-foreground",
              )}
            >
              {done ? (
                <Check className="size-4" />
              ) : rejected ? (
                <X className="size-4" />
              ) : (
                index + 1
              )}
            </span>
            <span
              className={cn(
                "mt-2 px-0.5 text-[11px] leading-tight font-semibold sm:text-xs",
                !done && !current && "text-muted-foreground",
                current && rejected && "text-rose-700",
              )}
            >
              {STATUS_LABELS[step]}
            </span>
            <span className="mt-0.5 hidden text-[11px] text-muted-foreground sm:block">
              {date && (done || current) ? formatShortDate(date) : "—"}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
