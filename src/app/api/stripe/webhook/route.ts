import { NextRequest, NextResponse } from "next/server";
import { stripe, stripeEnabled } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { sendEmail, tplOrderConfirmation } from "@/lib/notifications/email";
import { formatEuro } from "@/lib/utils";
import type Stripe from "stripe";

// Stripe webhook necesita el body crudo
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!stripeEnabled) {
    return NextResponse.json({ ok: false, reason: "Stripe no configurado" }, { status: 503 });
  }

  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !webhookSecret) {
    return NextResponse.json({ ok: false, reason: "Falta firma o secreto" }, { status: 400 });
  }

  const rawBody = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature failed:", err);
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;
    if (orderId) {
      await markOrderPaid(orderId, session.payment_intent?.toString());
    }
  }

  return NextResponse.json({ received: true });
}

async function markOrderPaid(orderId: string, paymentId: string | undefined) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { book: true, variant: { include: { item: true } } } } },
  });
  if (!order || order.status === "PAID") return;

  // Descontar stock
  for (const item of order.items) {
    if (item.kind === "BOOK" && item.bookId) {
      await prisma.book.update({
        where: { id: item.bookId },
        data: { stock: { decrement: item.quantity } },
      });
    } else if (item.kind === "UNIFORM" && item.variantId) {
      await prisma.uniformVariant.update({
        where: { id: item.variantId },
        data: { stock: { decrement: item.quantity } },
      });
    }
  }

  await prisma.order.update({
    where: { id: orderId },
    data: {
      status: "PAID",
      stripePaymentId: paymentId,
      paidAt: new Date(),
    },
  });

  // Email de confirmación
  await sendEmail({
    to: order.contactEmail,
    subject: `Pedido ${order.orderNumber} confirmado`,
    html: tplOrderConfirmation({
      orderNumber: order.orderNumber,
      parentName: order.parentName,
      childName: order.childName,
      totalEuros: formatEuro(order.totalCents),
      items: order.items.map((i) => ({
        name: i.nameSnapshot,
        detail: i.detailSnapshot ?? undefined,
        quantity: i.quantity,
      })),
    }),
  });
}
