import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  kind: z.enum(["BOOK", "UNIFORM", "REQUEST"]),
  refId: z.string().optional(),
  productName: z.string().min(1),
  productDetail: z.string().optional(),
  parentName: z.string().min(1).max(120),
  childName: z.string().min(1).max(120),
  contactEmail: z.string().email(),
  contactPhone: z.string().optional(),
  notifyEmail: z.boolean().optional(),
  notifySms: z.boolean().optional(),
  notifyWhatsapp: z.boolean().optional(),
  requestNotes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }
  const data = parsed.data;

  // Determinar tipo y referencia
  let bookId: string | undefined;
  let variantId: string | undefined;
  let kind: "BOOK" | "UNIFORM" | "REQUEST" = data.kind;

  if (data.kind === "BOOK" && data.refId) {
    bookId = data.refId;
  } else if (data.kind === "UNIFORM" && data.refId) {
    variantId = data.refId;
  } else {
    kind = "REQUEST"; // sin refId → solicitud genérica
  }

  await prisma.stockReservation.create({
    data: {
      kind,
      bookId,
      variantId,
      parentName: data.parentName,
      childName: data.childName,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      notifyEmail: data.notifyEmail ?? true,
      notifySms: data.notifySms ?? false,
      notifyWhatsapp: data.notifyWhatsapp ?? false,
      requestNotes:
        data.requestNotes ??
        `${data.productName}${data.productDetail ? ` (${data.productDetail})` : ""}`,
    },
  });

  return NextResponse.json({ ok: true });
}
