/**
 * Adaptador de SMS (Twilio) — PREPARADO PERO DESACTIVADO POR DEFECTO.
 *
 * Para activarlo:
 *   1) Crear cuenta en Twilio y verificar número remitente.
 *   2) En `.env` poner NOTIFICATIONS_SMS_ENABLED=true y rellenar
 *      TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SMS_FROM.
 *   3) Reiniciar el servidor.
 *
 * Mientras esté DESACTIVADO, las llamadas a sendSms() funcionan pero
 * registran en consola (modo stub) en lugar de enviar el mensaje real.
 */
import twilio from "twilio";

const enabled = process.env.NOTIFICATIONS_SMS_ENABLED === "true";
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_SMS_FROM;

const client = enabled && accountSid && authToken ? twilio(accountSid, authToken) : null;

export interface SmsMessage {
  to: string;   // formato E.164: +34600000000
  body: string;
}

export interface SmsResult {
  ok: boolean;
  sid?: string;
  error?: string;
}

export async function sendSms(msg: SmsMessage): Promise<SmsResult> {
  if (!enabled || !client || !fromNumber) {
    console.log("📱 [STUB] SMS saltado (desactivado o sin credenciales):", {
      to: msg.to,
      body: msg.body.slice(0, 60) + "…",
    });
    return { ok: true, sid: "stub" };
  }

  try {
    const r = await client.messages.create({
      body: msg.body,
      from: fromNumber,
      to: msg.to,
    });
    return { ok: true, sid: r.sid };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export const smsEnabled = enabled;
