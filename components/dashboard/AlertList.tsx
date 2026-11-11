import Link from "next/link";
import { AlertTriangle, ChevronRight, Clock, ShieldCheck, Archive } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type AlertItem = {
  id: string;
  href: string;
  title: string;
  description: string;
  /** warning = melewati batas normal, danger = sudah kena biaya penyimpanan. */
  tone?: "warning" | "danger";
  kind?: "process" | "pickup";
};

export function AlertList({ items }: { items: AlertItem[] }) {
  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-600/15 ring-inset">
            <ShieldCheck className="size-5" />
          </span>
          <div>
            <p className="text-sm font-semibold">Semua aman</p>
            <p className="text-sm text-muted-foreground">
              Tidak ada order yang melewati batas waktu.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="gap-3">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="grid size-7 place-items-center rounded-lg bg-amber-50 text-amber-600 ring-1 ring-amber-600/15 ring-inset">
            <AlertTriangle className="size-4" />
          </span>
          Perlu Perhatian
          <span className="ml-auto rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800 tabular-nums">
            {items.length}
          </span>
        </CardTitle>
        <CardDescription>Order yang melewati batas waktu normal workflow.</CardDescription>
      </CardHeader>
      <CardContent className="-mb-1 max-h-[26rem] space-y-1.5 overflow-y-auto pb-1">
        {items.map((item) => {
          const Icon = item.kind === "pickup" ? Archive : Clock;
          return (
            <Link
              key={item.id}
              href={item.href}
              className="group flex items-start gap-3 rounded-xl border border-transparent px-3 py-2.5 transition-colors hover:border-border hover:bg-muted/50"
            >
              <span
                className={cn(
                  "mt-0.5 grid size-7 shrink-0 place-items-center rounded-full",
                  item.tone === "danger" ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600",
                )}
              >
                <Icon className="size-3.5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-sm font-semibold">{item.title}</p>
                <p
                  className={cn(
                    "text-xs",
                    item.tone === "danger" ? "text-rose-600" : "text-muted-foreground",
                  )}
                >
                  {item.description}
                </p>
              </div>
              <ChevronRight className="mt-1.5 size-4 shrink-0 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5" />
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}
