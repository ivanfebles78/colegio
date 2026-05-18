import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSession, destroySession, verifyCredentials } from "@/lib/admin-auth";

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const parsed = loginSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Faltan credenciales" }, { status: 400 });
  }
  const ok = await verifyCredentials(parsed.data.username, parsed.data.password);
  if (!ok) {
    return NextResponse.json({ error: "Credenciales incorrectas" }, { status: 401 });
  }
  await createSession(parsed.data.username);
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  await destroySession();
  return NextResponse.json({ ok: true });
}
