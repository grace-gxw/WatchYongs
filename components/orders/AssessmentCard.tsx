"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, Pencil, Search, ThumbsDown, ThumbsUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Assessment = {
  estimatedPrice: number;
  diagnosis: string | null;
  decision: "PENDING" | "APPROVED" | "REJECTED";
} | null;

export function AssessmentCard({
  orderId,
  assessment,
}: {
  orderId: string;
  assessment: Assessment;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(!assessment);
  const [estimatedPrice, setEstimatedPrice] = useState(
    assessment?.estimatedPrice?.toString() ?? "",
  );
  const [diagnosis, setDiagnosis] = useState(assessment?.diagnosis ?? "");
  const [saving, setSaving] = useState(false);
  const [deciding, setDeciding] = useState(false);

  async function saveEstimate() {
    setSaving(true);
    const res = await fetch(`/api/orders/${orderId}/assessment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        estimatedPrice: Number(estimatedPrice),
        diagnosis,
      }),
    });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error ?? "Gagal menyimpan estimasi.");
      return;
    }
    toast.success("Estimasi disimpan.");
    setEditing(false);
    router.refresh();
  }

  async function decide(decision: "APPROVED" | "REJECTED") {
    setDeciding(true);
    const res = await fetch(`/api/orders/${orderId}/assessment/decision`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ decision }),
    });
    setDeciding(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error ?? "Gagal menyimpan keputusan.");
      return;
    }
    toast.success(
      decision === "APPROVED" ? "Customer setuju." : "Customer menolak.",
    );
    router.refresh();
  }

  const pricePreview = Number(estimatedPrice) || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="size-4 text-amber-600" />
          Assessment
        </CardTitle>
        <CardDescription>Estimasi biaya & diagnosis teknisi.</CardDescription>
        {assessment && !editing && assessment.decision === "PENDING" && (
          <CardAction>
            <Button size="sm" variant="ghost" onClick={() => setEditing(true)}>
              <Pencil />
              Edit
            </Button>
          </CardAction>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {editing ? (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-[200px_1fr]">
              <div className="space-y-2">
                <Label htmlFor="estimatedPrice">Estimasi Harga</Label>
                <div className="relative">
                  <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
                    Rp
                  </span>
                  <Input
                    id="estimatedPrice"
                    type="number"
                    min={0}
                    inputMode="numeric"
                    value={estimatedPrice}
                    onChange={(e) => setEstimatedPrice(e.target.value)}
                    className="pl-9 tabular-nums"
                  />
                </div>
                {pricePreview > 0 && (
                  <p className="text-xs text-muted-foreground tabular-nums">
                    = Rp {pricePreview.toLocaleString("id-ID")}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="diagnosis">Diagnosis</Label>
                <Textarea
                  id="diagnosis"
                  rows={3}
                  placeholder="Temuan teknisi, part yang perlu diganti, dll."
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button disabled={saving || !estimatedPrice} onClick={saveEstimate}>
                <Check />
                {saving ? "Menyimpan..." : "Simpan Estimasi"}
              </Button>
              {assessment && (
                <Button variant="ghost" onClick={() => setEditing(false)}>
                  Batal
                </Button>
              )}
            </div>
          </div>
        ) : (
          assessment && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-[200px_1fr]">
                <div className="rounded-xl bg-muted/50 p-3">
                  <p className="text-xs font-medium text-muted-foreground">Estimasi Harga</p>
                  <p className="mt-1 text-xl font-bold tracking-tight tabular-nums">
                    Rp {assessment.estimatedPrice.toLocaleString("id-ID")}
                  </p>
                </div>
                <div className="py-1">
                  <p className="text-xs font-medium text-muted-foreground">Diagnosis</p>
                  <p className="mt-1 text-sm whitespace-pre-line">
                    {assessment.diagnosis || "—"}
                  </p>
                </div>
              </div>

              {assessment.decision === "PENDING" ? (
                <div className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50/70 p-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm font-medium text-amber-900">
                    Menunggu keputusan customer
                  </p>
                  <div className="flex gap-2 *:flex-1 sm:*:flex-none">
                    <Button
                      variant="success"
                      size="sm"
                      disabled={deciding}
                      onClick={() => decide("APPROVED")}
                    >
                      <ThumbsUp />
                      Setuju
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={deciding}
                      onClick={() => decide("REJECTED")}
                    >
                      <ThumbsDown />
                      Tolak
                    </Button>
                  </div>
                </div>
              ) : assessment.decision === "APPROVED" ? (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/70 px-3 py-2.5 text-sm font-medium text-emerald-800">
                  <Check className="size-4" />
                  Disetujui customer
                </div>
              ) : (
                <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50/70 px-3 py-2.5 text-sm font-medium text-rose-800">
                  <X className="size-4" />
                  Ditolak customer
                </div>
              )}
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
}
