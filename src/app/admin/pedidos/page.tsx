import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { formatEuro } from "@/lib/utils";
import { protectAdminPage } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "Pedidos" };

export default async function AdminPedidosPage() {
  await protectAdminPage();
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div className="container-tight py-10">
      <h1 className="heading-display text-3xl text-primary mb-2">Pedidos</h1>
      <p className="text-muted-foreground mb-8 text-sm">
        Gestión de pedidos. Todos los pedidos se recogen en secretaría.
      </p>

      {orders.length === 0 ? (
        <div className="card-elevated p-10 text-center text-muted-foreground">
          Aún no hay pedidos.
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="card-elevated p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <div className="font-mono text-base font-medium">{o.orderNumber}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {new Intl.DateTimeFormat("es-ES", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(o.createdAt)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-primary">{formatEuro(o.totalCents)}</div>
                  <OrderBadge status={o.status} />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3 text-sm border-t border-border pt-3">
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">Cliente</div>
                  <div className="font-medium">{o.parentName}</div>
                  <div className="text-xs text-muted-foreground">{o.contactEmail}</div>
                  {o.contactPhone && (
                    <div className="text-xs text-muted-foreground">{o.contactPhone}</div>
                  )}
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">Alumno/a</div>
                  <div className="font-medium">{o.childName}</div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-border">
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  Líneas ({o.items.length})
                </div>
                <ul className="space-y-1 text-sm">
                  {o.items.map((it) => (
                    <li key={it.id} className="flex justify-between gap-3">
                      <span className="flex-1">
                        {it.quantity}× {it.nameSnapshot}
                        {it.detailSnapshot && (
                          <span className="text-muted-foreground"> — {it.detailSnapshot}</span>
                        )}
                      </span>
                      <span className="tabular-nums text-muted-foreground">
                        {formatEuro(it.unitPriceCents * it.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
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
