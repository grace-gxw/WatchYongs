import Image from "next/image";
import { ImageOff } from "lucide-react";
import { PHOTO_STAGE_LABELS, type PhotoStage } from "@/lib/status";

type PhotoItem = {
  id: string;
  path: string;
  stage: PhotoStage;
};

function PhotoGrid({ photos }: { photos: PhotoItem[] }) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3 lg:grid-cols-5">
      {photos.map((photo) => (
        <a
          key={photo.id}
          href={photo.path}
          target="_blank"
          rel="noreferrer"
          className="group relative aspect-square overflow-hidden rounded-xl bg-muted ring-1 ring-border"
        >
          <Image
            src={photo.path}
            alt=""
            fill
            sizes="(max-width: 768px) 33vw, 20vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </a>
      ))}
    </div>
  );
}

export function PhotoGallery({ photos }: { photos: PhotoItem[] }) {
  if (photos.length === 0) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-dashed px-4 py-5 text-sm text-muted-foreground">
        <ImageOff className="size-5 shrink-0" />
        Belum ada foto untuk order ini.
      </div>
    );
  }

  const stages: PhotoStage[] = ["INTAKE", "ASSESSMENT", "COMPLETION"];
  const grouped = stages
    .map((stage) => ({ stage, items: photos.filter((p) => p.stage === stage) }))
    .filter((group) => group.items.length > 0);

  return (
    <div className="space-y-4">
      {grouped.map((group) => (
        <div key={group.stage}>
          <p className="mb-2 flex items-center gap-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            {PHOTO_STAGE_LABELS[group.stage]}
            <span className="rounded-full bg-muted px-1.5 font-medium tabular-nums">
              {group.items.length}
            </span>
          </p>
          <PhotoGrid photos={group.items} />
        </div>
      ))}
    </div>
  );
}
