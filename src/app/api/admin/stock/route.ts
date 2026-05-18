import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { notifyStockBackInStock } from "@/lib/notifications";
import { schoolConfig } from "@/lib/school-config";

const schema = z.object({
  kind: z.enum(["BOOK", "UNIFORM"]),
  id: z.string().min(1),
  newStock: z.number().int().min(0).max(9999),
});

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const { kind, id, newStock } = parsed.data;

  // 1. Leer stock actual
  let previousStock = 0;
  let productName = "";
  let productDetail: string | undefined;
  let reservations: Awaited<ReturnType<typeof prisma.stockReservation.findMany>> = [];

  if (kind === "BOOK") {
    const book = await prisma.book.findUnique({ where: { id } });
    if (!book) return NextResponse.json({ error: "Libro no encontrado" }, { status: 404 });
    previousStock = book.stock;
    productName = book.title;
    productDetail = book.isbn ? `ISBN ${book.isbn}` : undefined;
    await prisma.book.update({ where: { id }, data: { stock: newStock } });
    if (previousStock === 0 && newStock > 0) {
      reservations = await prisma.stockReservation.findMany({
        where: { bookId: id, status: "WAITING" },
      });
    }
  } else {
    const variant = await prisma.uniformVariant.findUnique({
      where: { id },
      include: { item: true },
    });
    if (!variant) return NextResponse.json({ error: "Variante no encontrada" }, { status: 404 });
    previousStock = variant.stock;
    productName = variant.item.name;
    productDetail = `Talla ${variant.size}`;
    await prisma.uniformVariant.update({ where: { id }, data: { stock: newStock } });
    if (previousStock === 0 && newStock > 0) {
      reservations = await prisma.stockReservation.findMany({
        where: { variantId: id, status: "WAITING" },
      });
    }
  }

  // 2. Notificar a los que estaban esperando
  const notified: string[] = [];
  for (const r of reservations) {
    const result = await notifyStockBackInStock({
      parentName: r.parentName,
      contactEmail: r.contactEmail,
      contactPhone: r.contactPhone,
      notifyEmail: r.notifyEmail,
      notifySms: r.notifySms,
      notifyWhatsapp: r.notifyWhatsapp,
      productName,
      productDetail,
      reservationUrl: `https://${schoolConfig.domain}/carrito`,
    });
    if (result.ok && result.channels.length > 0) {
      await prisma.stockReservation.update({
        where: { id: r.id },
        data: {
          status: "NOTIFIED",
          notifiedAt: new Date(),
          notifiedChannel: result.channels.join(","),
        },
      });
      notified.push(r.id);
    }
  }

  return NextResponse.json({
    ok: true,
    previousStock,
    newStock,
    notified: notified.length,
  });
}
