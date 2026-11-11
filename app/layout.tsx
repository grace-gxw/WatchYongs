import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";

// Plus Jakarta Sans: huruf geometris yang modern dan sangat terbaca untuk
// angka (nomor order, rupiah) — dipakai untuk seluruh UI.
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "WatchYongs",
    template: "%s · WatchYongs",
  },
  description: "Dashboard reparasi jam tangan WatchYongs",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Dibiarkan bisa di-zoom: staff sering perlu memperbesar foto/nomor order di HP.
  maximumScale: 5,
  // Supaya navigasi bawah di HP bisa memberi ruang untuk home indicator iPhone.
  viewportFit: "cover",
  themeColor: "#1b2030",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${jakarta.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
