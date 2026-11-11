import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Toaster } from "@/components/ui/sonner";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar user={user} />
      {/* pb besar di HP: memberi ruang untuk navigasi bawah yang fixed. */}
      <main className="min-w-0 flex-1 px-4 pt-5 pb-[calc(6.5rem+env(safe-area-inset-bottom))] sm:px-6 md:px-8 md:py-8 lg:px-10">
        <div className="mx-auto w-full max-w-7xl">{children}</div>
      </main>
      <Toaster theme="light" richColors closeButton mobileOffset={{ bottom: 96 }} />
    </div>
  );
}
