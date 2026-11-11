"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Pemilih foto bergaya drop-zone dengan preview thumbnail. Input file asli
 * tetap ada (hanya disembunyikan secara visual) sehingga kamera HP & file
 * picker bawaan tetap jalan seperti biasa.
 */
export function PhotoPicker({
  id,
  files,
  onChange,
  compact = false,
  className,
}: {
  id: string;
  files: FileList | null;
  onChange: (files: FileList | null) => void;
  compact?: boolean;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [previews, setPreviews] = useState<{ name: string; url: string }[]>([]);

  // URL preview dibuat & dibersihkan di effect yang sama, supaya aman juga
  // saat React StrictMode menjalankan effect dua kali di mode dev.
  useEffect(() => {
    if (!files) {
      setPreviews([]);
      return;
    }
    const next = Array.from(files).map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));
    setPreviews(next);
    return () => next.forEach((p) => URL.revokeObjectURL(p.url));
  }, [files]);

  // Saat parent mengosongkan pilihan (misal setelah upload berhasil),
  // kosongkan juga input aslinya supaya file yang sama bisa dipilih lagi.
  useEffect(() => {
    if (!files && inputRef.current) inputRef.current.value = "";
  }, [files]);

  return (
    <div className={cn("space-y-3", className)}>
      <label
        htmlFor={id}
        className={cn(
          "flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-input bg-muted/30 text-sm transition-colors hover:border-foreground/30 hover:bg-muted/60 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/40",
          compact ? "px-3 py-2.5" : "flex-col justify-center px-4 py-6 text-center sm:py-8",
        )}
      >
        <span
          className={cn(
            "grid shrink-0 place-items-center rounded-xl bg-card text-muted-foreground shadow-xs ring-1 ring-border",
            compact ? "size-9" : "size-11",
          )}
        >
          <ImagePlus className={compact ? "size-4" : "size-5"} />
        </span>
        <span className={cn("min-w-0", compact && "flex-1")}>
          <span className="block font-medium">
            {files && files.length > 0
              ? `${files.length} foto dipilih`
              : compact
                ? "Pilih foto"
                : "Ketuk untuk ambil / pilih foto"}
          </span>
          <span className="block text-xs text-muted-foreground">
            JPG, PNG, WEBP, atau HEIC · bisa lebih dari satu
          </span>
        </span>
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic"
          multiple
          className="sr-only"
          onChange={(e) => onChange(e.target.files && e.target.files.length > 0 ? e.target.files : null)}
        />
      </label>

      {previews.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {previews.map((p) => (
            // eslint-disable-next-line @next/next/no-img-element -- preview lokal (blob URL), bukan aset Next
            <img
              key={p.url}
              src={p.url}
              alt={p.name}
              className="size-16 rounded-lg object-cover ring-1 ring-border"
            />
          ))}
          <button
            type="button"
            onClick={() => onChange(null)}
            className="inline-flex h-8 items-center gap-1 rounded-lg px-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="size-3.5" />
            Hapus pilihan
          </button>
        </div>
      )}
    </div>
  );
}
