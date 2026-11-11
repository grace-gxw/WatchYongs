import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Header standar di atas setiap halaman dashboard: link kembali (opsional),
 * eyebrow kecil, judul, deskripsi, dan tombol aksi di kanan. Di HP tombol
 * aksi turun ke bawah judul dan melebar penuh.
 */
export function PageHeader({
  title,
  description,
  eyebrow,
  back,
  actions,
  className,
  children,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  eyebrow?: React.ReactNode;
  back?: { href: string; label: string };
  actions?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-3", className)}>
      {back && (
        <Link
          href={back.href}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          {back.label}
        </Link>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 space-y-1">
          {eyebrow && (
            <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              {eyebrow}
            </p>
          )}
          <h1 className="text-2xl font-bold tracking-tight break-words sm:text-[28px] sm:leading-9">
            {title}
          </h1>
          {description && (
            <div className="text-sm text-muted-foreground">{description}</div>
          )}
          {children}
        </div>
        {actions && (
          <div className="flex flex-wrap gap-2 *:flex-1 sm:shrink-0 sm:*:flex-none">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
