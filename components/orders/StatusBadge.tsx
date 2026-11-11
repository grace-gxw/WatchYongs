import {
  STATUS_BADGE_CLASS,
  STATUS_DOT_CLASS,
  STATUS_LABELS,
  type OrderStatus,
} from "@/lib/status";
import { cn } from "@/lib/utils";

export function StatusBadge({
  status,
  className,
}: {
  status: OrderStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-6 w-fit shrink-0 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset",
        STATUS_BADGE_CLASS[status],
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", STATUS_DOT_CLASS[status])} />
      {STATUS_LABELS[status]}
    </span>
  );
}
