// Format tanggal & uang yang konsisten di semua halaman. Zona waktu dikunci ke
// WIB supaya tanggal yang tampil sama walaupun server production (Hostinger)
// berjalan di UTC.
const TIME_ZONE = "Asia/Jakarta";

export function formatRupiah(amount: number) {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

/** "12 Nov 2026" */
export function formatShortDate(date: Date) {
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: TIME_ZONE,
  });
}

/** "12 November 2026" */
export function formatLongDate(date: Date) {
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: TIME_ZONE,
  });
}

/** "Rabu, 12 November 2026" */
export function formatWeekdayDate(date: Date) {
  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: TIME_ZONE,
  });
}

/** "12 Nov 2026, 14.30" */
export function formatDateTime(date: Date) {
  return date.toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: TIME_ZONE,
  });
}

/** "hari ini", "kemarin", "5 hari lalu" */
export function formatRelativeDays(days: number) {
  if (days <= 0) return "hari ini";
  if (days === 1) return "kemarin";
  return `${days} hari lalu`;
}
