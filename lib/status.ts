// Re-exported from the browser-safe Prisma entry point so this file can be
// imported from both server and client components without pulling in the
// Node-only Prisma client runtime.
export { OrderStatus, PhotoStage, AssessmentDecision, ServiceType } from "@/app/generated/prisma/browser";
import type {
  OrderStatus as OrderStatusType,
  PhotoStage as PhotoStageType,
  ServiceType as ServiceTypeType,
} from "@/app/generated/prisma/browser";

export const STATUS_LABELS: Record<OrderStatusType, string> = {
  INTAKE: "Intake",
  ASSESSMENT: "Assessment",
  ONPROCESS: "On Process",
  COMPLETED: "Completed",
  PICKED: "Sudah Diambil",
  REJECTED: "Ditolak",
};

export const STATUS_BADGE_CLASS: Record<OrderStatusType, string> = {
  INTAKE: "bg-sky-50 text-sky-700 ring-sky-600/20",
  ASSESSMENT: "bg-amber-50 text-amber-800 ring-amber-600/25",
  ONPROCESS: "bg-violet-50 text-violet-700 ring-violet-600/20",
  COMPLETED: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  PICKED: "bg-slate-100 text-slate-600 ring-slate-500/20",
  REJECTED: "bg-rose-50 text-rose-700 ring-rose-600/20",
};

export const STATUS_DOT_CLASS: Record<OrderStatusType, string> = {
  INTAKE: "bg-sky-500",
  ASSESSMENT: "bg-amber-500",
  ONPROCESS: "bg-violet-500",
  COMPLETED: "bg-emerald-500",
  PICKED: "bg-slate-400",
  REJECTED: "bg-rose-500",
};

// Tone dipakai komponen yang butuh warna status di luar badge (kartu
// statistik, ikon timeline) supaya warnanya konsisten di semua halaman.
export type Tone = "sky" | "amber" | "violet" | "emerald" | "slate" | "rose" | "brand" | "ink";

export const STATUS_TONE: Record<OrderStatusType, Tone> = {
  INTAKE: "sky",
  ASSESSMENT: "amber",
  ONPROCESS: "violet",
  COMPLETED: "emerald",
  PICKED: "slate",
  REJECTED: "rose",
};

export const TONE_ICON_CLASS: Record<Tone, string> = {
  sky: "bg-sky-50 text-sky-600 ring-sky-600/15",
  amber: "bg-amber-50 text-amber-600 ring-amber-600/15",
  violet: "bg-violet-50 text-violet-600 ring-violet-600/15",
  emerald: "bg-emerald-50 text-emerald-600 ring-emerald-600/15",
  slate: "bg-slate-100 text-slate-500 ring-slate-500/15",
  rose: "bg-rose-50 text-rose-600 ring-rose-600/15",
  brand: "bg-brand-soft text-brand-foreground ring-brand/25",
  ink: "bg-primary text-primary-foreground ring-primary/10",
};

// Urutan normal sebuah order dari diterima sampai diambil — dipakai
// stepper progres di halaman detail order.
export const STATUS_FLOW: OrderStatusType[] = [
  "INTAKE",
  "ASSESSMENT",
  "ONPROCESS",
  "COMPLETED",
  "PICKED",
];

export const ACTIVE_STATUSES: OrderStatusType[] = [
  "INTAKE",
  "ASSESSMENT",
  "ONPROCESS",
  "COMPLETED",
];

// Manual forward transitions available as generic buttons on the order
// detail page. ASSESSMENT -> ONPROCESS/REJECTED and ONPROCESS -> COMPLETED
// are intentionally excluded here: those moves happen through dedicated
// flows instead (assessment decision, and the completion dialog which
// captures the final invoice amount) rather than a bare status flip.
export const ALLOWED_TRANSITIONS: Record<OrderStatusType, OrderStatusType[]> = {
  INTAKE: ["ASSESSMENT", "REJECTED"],
  ASSESSMENT: [],
  ONPROCESS: [],
  COMPLETED: ["PICKED"],
  PICKED: [],
  REJECTED: [],
};

export function isValidTransition(from: OrderStatusType, to: OrderStatusType) {
  return ALLOWED_TRANSITIONS[from]?.includes(to) ?? false;
}

export function daysSince(date: Date): number {
  return Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
}

export function daysAgo(days: number): Date {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

export const PHOTO_STAGE_LABELS: Record<PhotoStageType, string> = {
  INTAKE: "Foto Intake",
  ASSESSMENT: "Foto Assessment",
  COMPLETION: "Foto Completion",
};

// Sensible default stage to pre-select when staff adds a photo, based on
// where the order currently sits in the workflow.
export function defaultPhotoStageFor(status: OrderStatusType): PhotoStageType {
  switch (status) {
    case "INTAKE":
      return "INTAKE";
    case "ASSESSMENT":
      return "ASSESSMENT";
    default:
      return "COMPLETION";
  }
}

export const SERVICE_TYPE_LABELS: Record<ServiceTypeType, string> = {
  BESAR: "Service Besar",
  KECIL: "Service Kecil",
};

export type WorkChecklistState = {
  dropJam: boolean;
  onProses: boolean;
  selesai: boolean;
  ambilJam: boolean;
};

// Visual restatement of the existing status progression as the 4-step
// checklist from the physical work-order card (Drop Jam / Onproses /
// Selesai / Ambil Jam). This does not add new states — ASSESSMENT and
// REJECTED still exist and still drive the real workflow (assessment,
// invoice, WhatsApp); they just don't map to a distinct checklist row,
// matching what the physical card actually lists.
export function getWorkChecklist(status: OrderStatusType): WorkChecklistState {
  return {
    dropJam: true,
    onProses: status === "ONPROCESS" || status === "COMPLETED" || status === "PICKED",
    selesai: status === "COMPLETED" || status === "PICKED",
    ambilJam: status === "PICKED",
  };
}
