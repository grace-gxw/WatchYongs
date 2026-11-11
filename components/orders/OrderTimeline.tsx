import { formatDateTime } from "@/lib/format";
import { STATUS_DOT_CLASS, STATUS_LABELS, type OrderStatus } from "@/lib/status";
import { cn } from "@/lib/utils";

type TimelineEntry = {
  id: string;
  fromStatus: OrderStatus | null;
  toStatus: OrderStatus;
  note: string | null;
  changedAt: Date;
};

export function OrderTimeline({ history }: { history: TimelineEntry[] }) {
  if (history.length === 0) {
    return <p className="text-sm text-muted-foreground">Belum ada riwayat status.</p>;
  }

  // Terbaru di atas — yang paling sering dicari staff adalah perubahan terakhir.
  const entries = [...history].reverse();

  return (
    <ol className="relative space-y-5 before:absolute before:top-2 before:bottom-2 before:left-[5px] before:w-px before:bg-border">
      {entries.map((entry, idx) => (
        <li key={entry.id} className="relative flex gap-3 pl-0">
          <span
            className={cn(
              "relative z-10 mt-1.5 size-[11px] shrink-0 rounded-full ring-4 ring-card",
              STATUS_DOT_CLASS[entry.toStatus],
              idx !== 0 && "opacity-60",
            )}
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold">
              {STATUS_LABELS[entry.toStatus]}
              {entry.fromStatus && (
                <span className="font-normal text-muted-foreground">
                  {" "}
                  · dari {STATUS_LABELS[entry.fromStatus]}
                </span>
              )}
            </p>
            {entry.note && <p className="mt-0.5 text-sm text-muted-foreground">{entry.note}</p>}
            <p className="mt-0.5 text-xs text-muted-foreground">{formatDateTime(entry.changedAt)}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
