import Link from "next/link";
import {
  ClipboardList,
  Search,
  Wrench,
  CheckCircle2,
  PackageCheck,
  XCircle,
  Plus,
  ArrowRight,
} from "lucide-react";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { StatCard } from "@/components/dashboard/StatCard";
import { AlertList, type AlertItem } from "@/components/dashboard/AlertList";
import { PickupReminders } from "@/components/dashboard/PickupReminders";
import { OrderCardList } from "@/components/orders/OrderCardList";
import { OrderTable } from "@/components/orders/OrderTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatWeekdayDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  daysAgo,
  daysSince,
  STATUS_LABELS,
  STATUS_TONE,
  type OrderStatus,
} from "@/lib/status";

const ONPROCESS_ALERT_DAYS = 14;
const COMPLETED_ALERT_DAYS = 7;
const STORAGE_FEE_DAYS = 21; // diagram's "Weekly Reminder Max 3 Week" rule

const STAT_CARDS: { status: OrderStatus; icon: typeof ClipboardList; hint: string }[] = [
  { status: "INTAKE", icon: ClipboardList, hint: "Baru diterima" },
  { status: "ASSESSMENT", icon: Search, hint: "Menunggu keputusan" },
  { status: "ONPROCESS", icon: Wrench, hint: "Sedang dikerjakan" },
  { status: "COMPLETED", icon: CheckCircle2, hint: "Siap diambil" },
  { status: "PICKED", icon: PackageCheck, hint: "Sudah diserahkan" },
  { status: "REJECTED", icon: XCircle, hint: "Customer menolak" },
];

export default async function DashboardPage() {
  const onProcessThreshold = daysAgo(ONPROCESS_ALERT_DAYS);
  const completedThreshold = daysAgo(COMPLETED_ALERT_DAYS);

  const [user, statusCounts, onProcessOverdue, completedOverdue, recentOrders] =
    await Promise.all([
      getCurrentUser(),
      prisma.repairOrder.groupBy({ by: ["status"], _count: { _all: true } }),
      prisma.repairOrder.findMany({
        where: { status: "ONPROCESS", statusChangedAt: { lte: onProcessThreshold } },
        include: { customer: true },
        orderBy: { statusChangedAt: "asc" },
      }),
      prisma.repairOrder.findMany({
        where: { status: "COMPLETED", statusChangedAt: { lte: completedThreshold } },
        include: { customer: true },
        orderBy: { statusChangedAt: "asc" },
      }),
      prisma.repairOrder.findMany({
        include: { customer: true },
        orderBy: { createdAt: "desc" },
        take: 8,
      }),
    ]);

  const countFor = (status: OrderStatus) =>
    statusCounts.find((s) => s.status === status)?._count._all ?? 0;

  const alerts: AlertItem[] = [
    ...onProcessOverdue.map((order) => ({
      id: order.id,
      href: `/orders/${order.id}`,
      title: `${order.orderNumber} · ${order.watchBrand} (${order.customer.name})`,
      description: `Sudah ${daysSince(order.statusChangedAt)} hari di On Process. Perlu action?`,
      tone: "warning" as const,
      kind: "process" as const,
    })),
    ...completedOverdue.map((order) => {
      const overdueDays = daysSince(order.statusChangedAt);
      const isStorageFee = overdueDays >= STORAGE_FEE_DAYS;
      return {
        id: order.id,
        href: `/orders/${order.id}`,
        title: `${order.orderNumber} · ${order.watchBrand} (${order.customer.name})`,
        description: isStorageFee
          ? `Sudah selesai ${overdueDays} hari (>3 minggu) — kena biaya penyimpanan.`
          : `Sudah selesai ${overdueDays} hari, belum diambil.`,
        tone: isStorageFee ? ("danger" as const) : ("warning" as const),
        kind: "pickup" as const,
      };
    }),
  ];

  const activeCount =
    countFor("INTAKE") + countFor("ASSESSMENT") + countFor("ONPROCESS") + countFor("COMPLETED");
  const firstName = user?.name.split(" ")[0] ?? "Tim";

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        eyebrow={formatWeekdayDate(new Date())}
        title={`Halo, ${firstName}`}
        description={
          <>
            Ada <span className="font-semibold text-foreground">{activeCount} order aktif</span>
            {alerts.length > 0 ? (
              <>
                {" "}
                dan{" "}
                <span className="font-semibold text-amber-700">
                  {alerts.length} perlu perhatian
                </span>
              </>
            ) : null}{" "}
            hari ini.
          </>
        }
        actions={
          <>
            <Button variant="outline" render={<Link href="/orders" />} nativeButton={false}>
              Semua Order
            </Button>
            <Button render={<Link href="/orders/new" />} nativeButton={false}>
              <Plus />
              Intake Baru
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-6">
        {STAT_CARDS.map((card) => (
          <StatCard
            key={card.status}
            label={STATUS_LABELS[card.status]}
            value={countFor(card.status)}
            icon={card.icon}
            tone={STATUS_TONE[card.status]}
            hint={card.hint}
            href={`/orders?status=${card.status}`}
          />
        ))}
      </div>

      <div className={cn("grid items-start gap-6", completedOverdue.length > 0 && "lg:grid-cols-2")}>
        <AlertList items={alerts} />
        <PickupReminders orders={completedOverdue} />
      </div>

      <div>
        <Card className="gap-0 py-0">
          <CardHeader className="border-b pt-4 sm:pt-5">
            <CardTitle>Order Terbaru</CardTitle>
            <CardDescription>8 order yang paling baru masuk.</CardDescription>
            <CardAction>
              <Button
                variant="ghost"
                size="sm"
                render={<Link href="/orders" />}
                nativeButton={false}
              >
                Lihat semua
                <ArrowRight />
              </Button>
            </CardAction>
          </CardHeader>
          <OrderCardList className="md:hidden" orders={recentOrders} emptyLabel="Belum ada order." />
          <div className="hidden md:block">
            <OrderTable orders={recentOrders} emptyLabel="Belum ada order." />
          </div>
        </Card>
      </div>
    </div>
  );
}
