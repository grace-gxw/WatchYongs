import { cn } from "@/lib/utils";

// 12 tick mark seperti dial jam; tick di posisi 12/3/6/9 lebih tebal.
// Koordinat dibulatkan supaya hasil render server & client identik.
const TICKS = Array.from({ length: 12 }, (_, i) => {
  const angle = ((i * 30 - 90) * Math.PI) / 180;
  const major = i % 3 === 0;
  const inner = major ? 13 : 14.75;
  const outer = 17;
  const round = (n: number) => Math.round(n * 100) / 100;
  return {
    major,
    x1: round(20 + inner * Math.cos(angle)),
    y1: round(20 + inner * Math.sin(angle)),
    x2: round(20 + outer * Math.cos(angle)),
    y2: round(20 + outer * Math.sin(angle)),
  };
});

/** Logo dial jam "WY" — versi SVG dari logo yang dipakai di invoice PDF. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={cn("size-9", className)} aria-hidden="true">
      <circle
        cx="20"
        cy="20"
        r="19"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.2"
        strokeWidth="1.25"
      />
      {TICKS.map((t, i) => (
        <line
          key={i}
          x1={t.x1}
          y1={t.y1}
          x2={t.x2}
          y2={t.y2}
          stroke="currentColor"
          strokeWidth={t.major ? 2 : 1}
          strokeLinecap="round"
          strokeOpacity={t.major ? 1 : 0.6}
        />
      ))}
      <text
        x="20"
        y="20.5"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="10"
        fontWeight="800"
        letterSpacing="-0.4"
        fill="currentColor"
        fontFamily="var(--font-jakarta), system-ui, sans-serif"
      >
        WY
      </text>
    </svg>
  );
}

/** Logo lengkap: tile kuningan berisi dial + wordmark. */
export function BrandLogo({
  className,
  tagline = "Watch Service",
  tone = "dark",
}: {
  className?: string;
  tagline?: string | null;
  /** "dark" = dipasang di latar gelap (sidebar), "light" = di latar terang. */
  tone?: "dark" | "light";
}) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand text-brand-foreground shadow-sm">
        <BrandMark className="size-8" />
      </span>
      <span className="flex min-w-0 flex-col leading-none">
        <span
          className={cn(
            "text-[15px] font-bold tracking-tight",
            tone === "dark" ? "text-white" : "text-foreground",
          )}
        >
          WatchYongs
        </span>
        {tagline && (
          <span
            className={cn(
              "mt-1 text-[11px] font-medium tracking-wide uppercase",
              tone === "dark" ? "text-sidebar-muted" : "text-muted-foreground",
            )}
          >
            {tagline}
          </span>
        )}
      </span>
    </div>
  );
}
