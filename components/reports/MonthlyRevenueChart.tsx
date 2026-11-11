import { cn } from "@/lib/utils";
import { formatRupiah } from "@/lib/format";

type Bucket = { key: string; label: string; fullLabel: string; revenue: number; count: number };

function niceCeil(value: number) {
  if (value <= 0) return 1;
  const exponent = Math.floor(Math.log10(value));
  const base = 10 ** exponent;
  const fraction = value / base;
  const niceFraction = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 2.5 ? 2.5 : fraction <= 5 ? 5 : 10;
  return niceFraction * base;
}

const compact = new Intl.NumberFormat("id-ID", { notation: "compact", maximumFractionDigits: 1 });

/**
 * Grafik batang pendapatan 12 bulan (satu seri, tanpa library chart).
 * Bulan berjalan disorot warna kuningan; hover/fokus tiap batang
 * menampilkan nilai persisnya. Tabel tersembunyi disediakan untuk
 * pembaca layar.
 */
export function MonthlyRevenueChart({
  buckets,
  currentKey,
}: {
  buckets: Bucket[];
  currentKey: string;
}) {
  const max = Math.max(0, ...buckets.map((b) => b.revenue));
  const top = niceCeil(max);
  const ticks = [1, 0.75, 0.5, 0.25, 0].map((f) => f * top);

  return (
    <div>
      <div className="flex gap-2 sm:gap-3">
        {/* Sumbu Y */}
        <div className="relative h-52 w-9 shrink-0 text-right text-[10px] text-muted-foreground tabular-nums sm:w-12 sm:text-[11px]">
          {ticks.map((tick, i) => (
            <span
              key={i}
              className="absolute right-0 -translate-y-1/2"
              style={{ top: `${(i / (ticks.length - 1)) * 100}%` }}
            >
              {max === 0 && tick > 0 ? "" : compact.format(tick)}
            </span>
          ))}
        </div>

        <div className="relative min-w-0 flex-1">
          {/* Grid horizontal (recessive) */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-52">
            {ticks.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "absolute inset-x-0 border-t",
                  i === ticks.length - 1 ? "border-border" : "border-dashed border-border/70",
                )}
                style={{ top: `${(i / (ticks.length - 1)) * 100}%` }}
              />
            ))}
          </div>

          <div className="relative grid h-52 grid-cols-12 items-end gap-0.5 sm:gap-2">
            {buckets.map((bucket, index) => {
              const isCurrent = bucket.key === currentKey;
              const height = top > 0 ? (bucket.revenue / top) * 100 : 0;
              return (
                <div
                  key={bucket.key}
                  tabIndex={0}
                  aria-label={`${bucket.fullLabel}: ${formatRupiah(bucket.revenue)}, ${bucket.count} invoice`}
                  className="group relative flex h-full items-end justify-center outline-none"
                >
                  {/* Hit target selebar kolom, lebih besar dari batangnya. */}
                  <span className="absolute inset-0 rounded-md transition-colors group-hover:bg-muted/60 group-focus-visible:bg-muted/60" />
                  <span
                    className={cn(
                      "relative w-full max-w-7 rounded-t-[4px] transition-opacity",
                      isCurrent ? "bg-brand" : "bg-primary/85 group-hover:bg-primary",
                      bucket.revenue > 0 ? "min-h-1" : "h-0",
                    )}
                    style={{ height: `${height}%` }}
                  />
                  {/* Tooltip */}
                  <span
                    className={cn(
                      "pointer-events-none absolute z-10 w-max translate-y-1 rounded-lg bg-primary px-2.5 py-1.5 text-left text-xs text-primary-foreground opacity-0 shadow-lg transition-all group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100",
                      // Tooltip di kolom pinggir ditambatkan ke sisi dalam
                      // supaya tidak terpotong tepi kartu.
                      index < 2 ? "left-0" : index > 8 ? "right-0" : "left-1/2 -translate-x-1/2",
                    )}
                    style={{ bottom: `calc(${height}% + 6px)` }}
                  >
                    <span className="block font-medium text-primary-foreground/70">
                      {bucket.fullLabel}
                    </span>
                    <span className="block font-semibold tabular-nums">
                      {formatRupiah(bucket.revenue)}
                    </span>
                    <span className="block text-primary-foreground/70">{bucket.count} invoice</span>
                  </span>
                </div>
              );
            })}
          </div>

          {/* Label bulan */}
          <div className="mt-2 grid grid-cols-12 gap-0.5 sm:gap-2">
            {buckets.map((bucket) => (
              <span
                key={bucket.key}
                className={cn(
                  "truncate text-center text-[10px] sm:text-xs",
                  bucket.key === currentKey
                    ? "font-semibold text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {bucket.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <table className="sr-only">
        <caption>Pendapatan per bulan, 12 bulan terakhir</caption>
        <thead>
          <tr>
            <th>Bulan</th>
            <th>Pendapatan</th>
            <th>Jumlah invoice</th>
          </tr>
        </thead>
        <tbody>
          {buckets.map((b) => (
            <tr key={b.key}>
              <td>{b.fullLabel}</td>
              <td>{formatRupiah(b.revenue)}</td>
              <td>{b.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
