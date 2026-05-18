import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { BellRing } from "lucide-react";
import { protectAdminPage } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "Reservas y lista de espera" };

export default async function AdminReservasPage() {
  await protectAdminPage();
  const reservations = await prisma.stockReservation.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      book: true,
      variant: { include: { item: true } },
    },
  });

  return (
    <div className="container-tight py-10">
      <div className="flex items-start justify-between gap-4 mb-2">
        <h1 className="heading-display text-3xl text-primary">Reservas</h1>
      </div>
      <p className="text-muted-foreground mb-8 text-sm">
        Padres y madres esperando un producto agotado o solicitando un libro fuera de catálogo.
        Cuando actualices el stock desde <strong>Productos</strong>, se les notificará
        automáticamente.
      </p>

      {reservations.length === 0 ? (
        <div className="card-elevated p-10 text-center text-muted-foreground">
          No hay reservas activas.
        </div>
      ) : (
        <div className="card-elevated overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3">Producto</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">Solicitante</th>
                <th className="text-left px-4 py-3 hidden lg:table-cell">Contacto</th>
                <th className="text-left px-4 py-3">Canales</th>
                <th className="text-right px-4 py-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {reservations.map((r) => {
                const productName =
                  r.book?.title ??
                  (r.variant ? `${r.variant.item.name} · talla ${r.variant.size}` : "Solicitud genérica");
                return (
                  <tr key={r.id} className="hover:bg-secondary/30">
                    <td className="px-4 py-3">
                      <div className="font-medium leading-snug">{productName}</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">
                        {r.kind === "BOOK" ? "Libro" : r.kind === "UNIFORM" ? "Uniforme" : "Solicitud"}
                        {r.requestNotes && r.kind === "REQUEST" && (
                          <span className="ml-2 italic">"{r.requestNotes}"</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-sm">
                      <div className="font-medium">{r.parentName}</div>
                      <div className="text-xs text-muted-foreground">Alumno: {r.childName}</div>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-xs">
                      <div>{r.contactEmail}</div>
                      {r.contactPhone && <div className="text-muted-foreground">{r.contactPhone}</div>}
                    </td>
                    <td className="px-4 py-3 text-xs space-y-0.5">
                      {r.notifyEmail && <div>✉️ Email</div>}
                      {r.notifySms && <div>📱 SMS</div>}
                      {r.notifyWhatsapp && <div>💬 WhatsApp</div>}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <ReservationBadge status={r.status} />
                      {r.notifiedAt && (
                        <div className="text-[10px] text-muted-foreground mt-1">
                          {new Intl.DateTimeFormat("es-ES", { dateStyle: "short", timeStyle: "short" }).format(r.notifiedAt)}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ReservationBadge({ status }: { status: string }) {
  const map = {
    WAITING: { label: "Esperando", variant: "muted" as const },
    NOTIFIED: { label: "Avisado", variant: "success" as const },
    CONVERTED: { label: "Comprado", variant: "default" as const },
    CANCELLED: { label: "Cancelado", variant: "destructive" as const },
  };
  const info = map[status as keyof typeof map];
  if (!info) return null;
  return <Badge variant={info.variant}>{info.label}</Badge>;
}
