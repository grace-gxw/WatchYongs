import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import { TONE_ICON_CLASS, type Tone } from "@/lib/status";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "slate",
  hint,
  href,
  highlight = false,
  className,
}: {
  label: string;
  value: number | string;
  icon: LucideIcon;
  tone?: Tone;
  hint?: React.ReactNode;
  /** Kalau diisi, kartu jadi link (misal ke daftar order terfilter). */
  href?: string;
  /** Kartu utama: latar gelap dengan angka kuningan. */
  highlight?: boolean;
  className?: string;
}) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-2">
        <span
          className={cn(
            "text-xs font-medium sm:text-sm",
            highlight ? "text-white/70" : "text-muted-foreground",
          )}
        >
          {label}
        </span>
        <span
          className={cn(
            "grid size-8 shrink-0 place-items-center rounded-lg ring-1 ring-inset sm:size-9",
            highlight ? "bg-white/10 text-brand ring-white/10" : TONE_ICON_CLASS[tone],
          )}
        >
          <Icon className="size-4" />
        </span>
      </div>
      {/* Nilai rupiah bisa panjang — ukuran huruf mengikuti lebar kartu. */}
      <div
        className={cn(
          "mt-3 text-lg leading-tight font-bold tracking-tight tabular-nums @[10rem]:text-xl @[13rem]:text-2xl @[16rem]:text-[26px]",
          highlight && "text-brand",
        )}
      >
        {value}
      </div>
      {(hint || href) && (
        <div
          className={cn(
            "mt-1 flex items-center justify-between gap-2 text-xs",
            highlight ? "text-white/60" : "text-muted-foreground",
          )}
        >
          <span className="min-w-0 truncate">{hint}</span>
          {href && (
            <ArrowUpRight className="size-3.5 shrink-0 opacity-0 transition-opacity group-hover/stat:opacity-100" />
          )}
        </div>
      )}
    </>
  );

  const classes = cn(
    "group/stat @container block rounded-2xl border p-4 shadow-card sm:p-5",
    highlight
      ? "border-transparent bg-primary text-primary-foreground"
      : "border-border/80 bg-card",
    href && "transition-all hover:-translate-y-0.5 hover:shadow-lift",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {body}
      </Link>
    );
  }
  return <div className={classes}>{body}</div>;
}
