"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PhotoPicker } from "@/components/orders/PhotoPicker";
import { PHOTO_STAGE_LABELS, type PhotoStage } from "@/lib/status";

const STAGES: PhotoStage[] = ["INTAKE", "ASSESSMENT", "COMPLETION"];

export function AddPhotoForm({
  orderId,
  defaultStage,
}: {
  orderId: string;
  defaultStage: PhotoStage;
}) {
  const router = useRouter();
  const [stage, setStage] = useState<PhotoStage>(defaultStage);
  const [files, setFiles] = useState<FileList | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!files || files.length === 0) {
      toast.error("Pilih minimal satu foto dulu.");
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.set("stage", stage);
    Array.from(files).forEach((file) => formData.append("photos", file));

    const res = await fetch(`/api/orders/${orderId}/photos`, {
      method: "POST",
      body: formData,
    });
    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error ?? "Gagal upload foto.");
      return;
    }

    toast.success("Foto berhasil ditambahkan.");
    setFiles(null);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-xl bg-muted/40 p-3">
      <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        Tambah Foto
      </p>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
        <Select value={stage} onValueChange={(v) => setStage(v as PhotoStage)}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue>{(value: PhotoStage) => PHOTO_STAGE_LABELS[value]}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {STAGES.map((s) => (
              <SelectItem key={s} value={s}>
                {PHOTO_STAGE_LABELS[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <PhotoPicker
          id={`add-photo-${orderId}`}
          files={files}
          onChange={setFiles}
          compact
          className="flex-1"
        />
      </div>
      {files && files.length > 0 && (
        <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
          <Upload />
          {submitting ? "Mengupload..." : `Upload ${files.length} Foto`}
        </Button>
      )}
    </form>
  );
}
