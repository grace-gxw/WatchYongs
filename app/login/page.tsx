import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Bell, ClipboardCheck, Receipt } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { LoginForm } from "@/components/auth/LoginForm";
import { BrandLogo, BrandMark } from "@/components/shared/BrandLogo";

export const metadata = { title: "Masuk" };

const FEATURES = [
  { icon: ClipboardCheck, text: "Intake, assessment, sampai pengambilan jam dalam satu alur." },
  { icon: Receipt, text: "Invoice PDF otomatis saat order selesai." },
  { icon: Bell, text: "Pengingat WhatsApp untuk jam yang belum diambil." },
];

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/");
  }

  return (
    <div className="grid min-h-dvh lg:grid-cols-[1.1fr_1fr]">
      {/* Panel brand — hanya di layar lebar. */}
      <aside className="relative hidden overflow-hidden bg-sidebar p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
        <BrandLogo tagline="Watch Service Center" />

        <BrandMark
          className="pointer-events-none absolute top-1/2 -right-40 size-[560px] -translate-y-1/2 text-brand opacity-[0.07]"
        />

        <div className="relative max-w-md space-y-8">
          <div className="space-y-3">
            <p className="text-xs font-semibold tracking-[0.2em] text-brand uppercase">
              Repair Management
            </p>
            <h2 className="text-4xl leading-tight font-bold tracking-tight xl:text-[44px]">
              Setiap jam, tercatat rapi dari masuk sampai kembali ke pemiliknya.
            </h2>
          </div>
          <ul className="space-y-4">
            {FEATURES.map((f) => (
              <li key={f.text} className="flex items-start gap-3 text-sm text-sidebar-foreground">
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-white/5 text-brand ring-1 ring-white/10">
                  <f.icon className="size-4" />
                </span>
                <span className="pt-1.5">{f.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-sidebar-muted">
          © {new Date().getFullYear()} WatchYongs · @watchyongs
        </p>
      </aside>

      <main className="flex items-center justify-center bg-background px-5 py-10 sm:px-8">
        <div className="w-full max-w-sm space-y-8">
          <div className="lg:hidden">
            <span className="mb-5 grid size-14 place-items-center rounded-2xl bg-primary text-brand shadow-lg">
              <BrandMark className="size-12" />
            </span>
          </div>
          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Selamat datang kembali</h1>
            <p className="text-sm text-muted-foreground">
              Masuk untuk mengakses dashboard reparasi WatchYongs.
            </p>
          </div>
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
