/**
 * Autenticación simple de admin basada en variables de entorno.
 * Usa cookies HTTP-only firmadas con JWT (jose).
 *
 * - ADMIN_USERNAME       (texto plano)
 * - ADMIN_PASSWORD_HASH  (bcrypt hash)
 * - ADMIN_SESSION_SECRET (clave HMAC para firmar el JWT, mínimo 24 chars)
 *
 * Generar un hash bcrypt en local:
 *   node -e "console.log(require('bcryptjs').hashSync('admin1234', 10))"
 */
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

const COOKIE_NAME = "british_admin_session";
const SESSION_TTL_HOURS = 12;

function getSecret(): Uint8Array {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s || s.length < 24) {
    throw new Error(
      "ADMIN_SESSION_SECRET debe estar definido y tener al menos 24 caracteres",
    );
  }
  return new TextEncoder().encode(s);
}

export async function verifyCredentials(username: string, password: string) {
  const expectedUser = process.env.ADMIN_USERNAME ?? "admin";
  const expectedHash = process.env.ADMIN_PASSWORD_HASH;
  if (!expectedHash) return false;
  if (username !== expectedUser) return false;
  return bcrypt.compare(password, expectedHash);
}

export async function createSession(username: string) {
  const token = await new SignJWT({ sub: username, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_HOURS}h`)
    .sign(getSecret());

  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_HOURS * 60 * 60,
  });
}

export async function destroySession() {
  cookies().delete(COOKIE_NAME);
}

export async function getCurrentAdmin(): Promise<{ username: string } | null> {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return { username: String(payload.sub) };
  } catch {
    return null;
  }
}

/** Lanza error si no hay sesión (para usar en APIs). */
export async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("UNAUTHORIZED");
  return admin;
}

/** Redirige al login si no hay sesión (para usar en páginas server). */
export async function protectAdminPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
