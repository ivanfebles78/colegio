import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Package, BellRing, AlertTriangle, TrendingUp } from "lucide-react";
import { formatEuro } from "@/lib/utils";
import { protectAdminPage } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "Resumen admin" };

export default async function AdminDashboard() {
  await protectAdminPage();
  const today = new Date();
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    paidOrdersCount,
    pendingOrdersCount,
    revenueAgg,
    waitingReservations,
    outOfStockBooks,
    outOfStockVariants,
    recentOrders,
  ] = await Promise.all([
    prisma.order.count({ where: { status: { in: ["PAID", "READY_FOR_PICKUP", "PICKED_UP"] } } }),
    prisma.order.count({ where: { status: "PENDING_PAYMENT" } }),
    prisma.order.aggregate({
      _sum: { totalCents: true },
      where: {
        status: { in: ["PAID", "READY_FOR_PICKUP", "PICKED_UP"] },
        paidAt: { gte: thirtyDaysAgo },
      },
    }),
    prisma.stockReservation.count({ where: { status: "WAITING" } }),
    prisma.book.count({ where: { stock: 0, exclusiveAtSchool: false } }),
    prisma.uniformVariant.count({ where: { stock: 0 } }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { _count: { select: { items: true } } },
    }),
  ]);

  const revenue = revenueAgg._sum.totalCents ?? 0;

  return (
    <div className="container-tight py-10">
      <div className="mb-8">
        <h1 className="heading-display text-3xl text-primary">Resumen</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Actividad del último mes y estado actual del catálogo.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard
          icon={<TrendingUp className="h-5 w-5" />}
          label="Ingresos (30 días)"
          value={formatEuro(revenue)}
          accent="emerald"
        />
        <StatCard
          icon={<ShoppingBag className="h-5 w-5" />}
          label="Pedidos pagados"
          value={String(paidOrdersCount)}
          sub={`${pendingOrdersCount} pendientes`}
        />
        <StatCard
          icon={<BellRing className="h-5 w-5" />}
          label="Reservas activas"
          value={String(waitingReservations)}
          href="/admin/reservas"
        />
        <StatCard
          icon={<AlertTriangle className="h-5 w-5" />}
          label="Sin stock"
          value={String(outOfStockBooks + outOfStockVariants)}
          sub={`${outOfStockBooks} libros · ${outOfStockVariants} tallas`}
          href="/admin/productos"
          accent="amber"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card-elevated p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium text-lg">Últimos pedidos</h2>
            <Link href="/admin/pedidos" className="text-sm text-primary hover:underline">
              Ver todos →
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aún no hay pedidos.</p>
          ) : (
            <ul className="divide-y divide-border">
              {recentOrders.map((o) => (
                <li key={o.id} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <div className="font-mono text-sm">{o.orderNumber}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {o.parentName} · {o.childName} · {o._count.items} líneas
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-primary text-sm">{formatEuro(o.totalCents)}</div>
                    <OrderBadge status={o.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card-elevated p-6">
          <h2 className="font-medium text-lg mb-4">Acciones rápidas</h2>
          <div className="grid gap-2">
            <ActionLink href="/admin/productos" icon={<Package className="h-4 w-4" />}>
              Actualizar stock
            </ActionLink>
            <ActionLink href="/admin/reservas" icon={<BellRing className="h-4 w-4" />}>
              Ver lista de espera
            </ActionLink>
            <ActionLink href="/admin/pedidos" icon={<ShoppingBag className="h-4 w-4" />}>
              Marcar pedidos como entregados
            </ActionLink>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
  href,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  href?: string;
  accent?: "emerald" | "amber";
}) {
  const tones = {
    emerald: "bg-emerald-100 text-emerald-800",
    amber: "bg-amber-100 text-amber-800",
    default: "bg-primary/10 text-primary",
  } as const;
  const tone = tones[accent ?? "default"];
  const inner = (
    <div className="card-elevated p-5">
      <div className="flex items-center justify-between mb-3">
        <span className={`inline-grid h-9 w-9 place-items-center rounded-lg ${tone}`}>
          {icon}
        </span>
      </div>
      <div className="text-2xl font-semibold text-foreground">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
      {sub && <div className="text-[11px] text-muted-foreground mt-0.5">{sub}</div>}
    </div>
  );
  return href ? <Link href={href} className="block hover:-translate-y-0.5 transition-transform">{inner}</Link> : inner;
}

function ActionLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm hover:bg-secondary"
    >
      {icon}
      {children}
    </Link>
  );
}

function OrderBadge({ status }: { status: string }) {
  const map = {
    PENDING_PAYMENT: { label: "Pendiente pago", variant: "muted" as const },
    PAID: { label: "Pagado", variant: "success" as const },
    READY_FOR_PICKUP: { label: "Listo para recoger", variant: "accent" as const },
    PICKED_UP: { label: "Recogido", variant: "muted" as const },
    CANCELLED: { label: "Cancelado", variant: "destructive" as const },
  };
  const info = map[status as keyof typeof map];
  if (!info) return null;
  return <Badge variant={info.variant}>{info.label}</Badge>;
}
