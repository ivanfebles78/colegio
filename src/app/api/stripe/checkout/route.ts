import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { stripe, stripeEnabled } from "@/lib/stripe";
import { generateOrderNumber } from "@/lib/utils";
import { schoolConfig } from "@/lib/school-config";

const lineSchema = z.object({
  kind: z.enum(["BOOK", "UNIFORM"]),
  refId: z.string().min(1),
  quantity: z.number().int().positive().max(20),
  unitPriceCents: z.number().int().positive(),
  name: z.string().min(1),
  detail: z.string().optional(),
});

const bodySchema = z.object({
  parentName: z.string().min(1).max(120),
  childName: z.string().min(1).max(120),
  contactEmail: z.string().email(),
  contactPhone: z.string().optional(),
  customerNotes: z.string().optional(),
  lines: z.array(lineSchema).min(1).max(80),
});

export async function POST(req: NextRequest) {
  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos", issues: parsed.error.issues }, { status: 400 });
  }
  const data = parsed.data;

  // Re-validar precios y stock contra la BD para evitar manipulación cliente
  const bookIds = data.lines.filter((l) => l.kind === "BOOK").map((l) => l.refId);
  const variantIds = data.lines.filter((l) => l.kind === "UNIFORM").map((l) => l.refId);

  const [books, variants] = await Promise.all([
    bookIds.length
      ? prisma.book.findMany({ where: { id: { in: bookIds } } })
      : Promise.resolve([]),
    variantIds.length
      ? prisma.uniformVariant.findMany({
          where: { id: { in: variantIds } },
          include: { item: true },
        })
      : Promise.resolve([]),
  ]);

  const bookMap = new Map(books.map((b) => [b.id, b]));
  const variantMap = new Map(variants.map((v) => [v.id, v]));

  // Construir items canónicos
  let subtotalCents = 0;
  const canonical: Array<{
    kind: "BOOK" | "UNIFORM";
    refId: string;
    name: string;
    detail?: string;
    unitPriceCents: number;
    quantity: number;
  }> = [];

  for (const l of data.lines) {
    if (l.kind === "BOOK") {
      const b = bookMap.get(l.refId);
      if (!b) return NextResponse.json({ error: `Libro no encontrado: ${l.refId}` }, { status: 400 });
      if (b.stock < l.quantity) {
        return NextResponse.json({ error: `Sin stock para "${b.title}"` }, { status: 400 });
      }
      subtotalCents += b.priceCents * l.quantity;
      canonical.push({
        kind: "BOOK",
        refId: b.id,
        name: b.title,
        detail: b.isbn ? `ISBN ${b.isbn}` : b.publisher,
        unitPriceCents: b.priceCents,
        quantity: l.quantity,
      });
    } else {
      const v = variantMap.get(l.refId);
      if (!v) return NextResponse.json({ error: `Talla no encontrada: ${l.refId}` }, { status: 400 });
      if (v.stock < l.quantity) {
        return NextResponse.json({ error: `Sin stock para "${v.item.name}" talla ${v.size}` }, { status: 400 });
      }
      const price = v.priceCents ?? v.item.basePriceCents;
      subtotalCents += price * l.quantity;
      canonical.push({
        kind: "UNIFORM",
        refId: v.id,
        name: v.item.name,
        detail: `Talla ${v.size}`,
        unitPriceCents: price,
        quantity: l.quantity,
      });
    }
  }

  // Número de pedido secuencial
  const today = new Date();
  const yearStart = new Date(today.getFullYear(), 0, 1);
  const count = await prisma.order.count({ where: { createdAt: { gte: yearStart } } });
  const orderNumber = generateOrderNumber(count + 1, today.getFullYear());

  const order = await prisma.order.create({
    data: {
      orderNumber,
      parentName: data.parentName,
      childName: data.childName,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      customerNotes: data.customerNotes,
      subtotalCents,
      totalCents: subtotalCents,
      items: {
        create: canonical.map((c) => ({
          kind: c.kind,
          bookId: c.kind === "BOOK" ? c.refId : undefined,
          variantId: c.kind === "UNIFORM" ? c.refId : undefined,
          nameSnapshot: c.name,
          detailSnapshot: c.detail,
          unitPriceCents: c.unitPriceCents,
          quantity: c.quantity,
        })),
      },
    },
  });

  // -- Si Stripe NO está configurado, devolvemos URL al "modo demo" para que la
  //    funcionalidad sea visible en local sin credenciales (marca PAID inmediato
  //    y descuenta el stock para reflejar la realidad).
  if (!stripeEnabled) {
    await prisma.$transaction([
      ...canonical.map((c) =>
        c.kind === "BOOK"
          ? prisma.book.update({
              where: { id: c.refId },
              data: { stock: { decrement: c.quantity } },
            })
          : prisma.uniformVariant.update({
              where: { id: c.refId },
              data: { stock: { decrement: c.quantity } },
            }),
      ),
      prisma.order.update({
        where: { id: order.id },
        data: { status: "PAID", paidAt: new Date() },
      }),
    ]);
    const origin = req.nextUrl.origin;
    return NextResponse.json({ url: `${origin}/checkout/exito?order=${order.id}&demo=1` });
  }

  // Stripe Checkout Session
  const origin = req.nextUrl.origin;
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: data.contactEmail,
    line_items: canonical.map((c) => ({
      quantity: c.quantity,
      price_data: {
        currency: "eur",
        unit_amount: c.unitPriceCents,
        product_data: {
          name: c.name,
          description: c.detail,
        },
      },
    })),
    success_url: `${origin}/checkout/exito?order=${order.id}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/carrito`,
    metadata: {
      orderId: order.id,
      orderNumber: order.orderNumber,
      schoolDomain: schoolConfig.domain,
    },
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { stripeSessionId: session.id },
  });

  return NextResponse.json({ url: session.url });
}
