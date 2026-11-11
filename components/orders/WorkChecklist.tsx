import { Check } from "lucide-react";
import { getWorkChecklist, type OrderStatus } from "@/lib/status";
import { cn } from "@/lib/utils";

const ROWS: { key: keyof ReturnType<typeof getWorkChecklist>; label: string }[] = [
  { key: "dropJam", label: "Drop Jam" },
  { key: "onProses", label: "Onproses" },
  { key: "selesai", label: "Selesai" },
  { key: "ambilJam", label: "Ambil Jam" },
];

export function WorkChecklist({ status }: { status: OrderStatus }) {
  const checklist = getWorkChecklist(status);
  const doneCount = ROWS.filter((row) => checklist[row.key]).length;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all"
            style={{ width: `${(doneCount / ROWS.length) * 100}%` }}
          />
        </div>
        <span className="text-xs font-medium text-muted-foreground tabular-nums">
          {doneCount}/{ROWS.length}
        </span>
      </div>
      <ul className="grid grid-cols-2 gap-2">
        {ROWS.map((row) => {
          const checked = checklist[row.key];
          return (
            <li
              key={row.key}
              className={cn(
                "flex items-center gap-2 rounded-lg border px-2.5 py-2 text-sm",
                checked ? "border-emerald-200 bg-emerald-50/60" : "border-dashed",
              )}
            >
              <span
                className={cn(
                  "grid size-4.5 shrink-0 place-items-center rounded-full",
                  checked ? "bg-emerald-600 text-white" : "border border-muted-foreground/30",
                )}
              >
                {checked && <Check className="size-3" strokeWidth={3} />}
              </span>
              <span className={checked ? "font-medium" : "text-muted-foreground"}>{row.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
