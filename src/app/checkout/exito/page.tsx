import Link from "next/link";
import { CheckCircle2, MapPin, ShoppingBag } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { prisma } from "@/lib/prisma";
import { schoolConfig } from "@/lib/school-config";
import { formatEuro } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ClearCartOnMount } from "./clear-cart-on-mount";

export const dynamic = "force-dynamic";
export const metadata = { title: "Pedido confirmado" };

export default async function Exito({
  searchParams,
}: {
  searchParams: { order?: string; demo?: string };
}) {
  const orderId = searchParams.order;
  const isDemo = searchParams.demo === "1";

  const order = orderId
    ? await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      })
    : null;

  return (
    <>
      <SiteHeader />
      <ClearCartOnMount />
      <main className="flex-1">
        <section className="container-tight py-16 max-w-2xl">
          <div className="grid place-items-center text-center mb-10">
            <div className="inline-grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-700 mb-4">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h1 className="heading-display text-4xl text-primary mb-2">
              ¡Pedido confirmado!
            </h1>
            <p className="text-muted-foreground max-w-md">
              {order
                ? `Hemos registrado el pedido ${order.orderNumber}. Te enviamos un email con los detalles.`
                : "Hemos registrado tu pedido. Te enviamos un email con los detalles."}
            </p>
            {isDemo && (
              <Badge variant="muted" className="mt-3">
                Modo demo (Stripe no configurado)
              </Badge>
            )}
          </div>

          {order && (
            <div className="card-elevated p-6 md:p-8 mb-6">
              <div className="flex items-start justify-between gap-3 mb-5">
                <div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">
                    Nº de pedido
                  </div>
                  <div className="font-mono text-lg font-medium">{order.orderNumber}</div>
                </div>
                <Badge variant="success">
                  <ShoppingBag className="h-3 w-3" /> Pagado
                </Badge>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-6 text-sm">
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    Padre / madre
                  </div>
                  <div className="font-medium mt-0.5">{order.parentName}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    Alumno/a
                  </div>
                  <div className="font-medium mt-0.5">{order.childName}</div>
                </div>
              </div>

              <div className="rounded-lg border border-border divide-y divide-border">
                {order.items.map((item) => (
                  <div key={item.id} className="px-4 py-3 flex justify-between items-start gap-3">
                    <div>
                      <div className="font-medium text-sm">{item.nameSnapshot}</div>
                      {item.detailSnapshot && (
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {item.detailSnapshot}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground mt-0.5">
                        Cantidad: {item.quantity}
                      </div>
                    </div>
                    <div className="font-semibold text-primary text-sm">
                      {formatEuro(item.unitPriceCents * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex justify-between items-center text-lg">
                <span>Total</span>
                <span className="font-semibold text-primary">{formatEuro(order.totalCents)}</span>
              </div>
            </div>
          )}

          <div className="card-elevated p-6 bg-secondary/40">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Recogida del pedido
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Te avisaremos por email cuando esté listo. La recogida se realiza en secretaría:
              <br />
              <strong className="text-foreground">{schoolConfig.pickupAddress}</strong>
            </p>
          </div>

          <div className="mt-10 flex justify-center">
            <Link
              href="/"
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-card px-6 text-sm font-medium hover:bg-secondary"
            >
              Volver al inicio
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
