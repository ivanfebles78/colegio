/**
 * Adaptador de WhatsApp (Twilio WhatsApp Business API) —
 * PREPARADO PERO DESACTIVADO POR DEFECTO.
 *
 * Para activarlo:
 *   1) Activar WhatsApp en Twilio Console y obtener tu número remitente
 *      en formato "whatsapp:+34..."
 *   2) En `.env` poner NOTIFICATIONS_WHATSAPP_ENABLED=true y rellenar
 *      TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM.
 *   3) Para entornos productivos, dar de alta plantillas aprobadas en Meta.
 *
 * Mientras esté DESACTIVADO, las llamadas se loggean por consola.
 */
import twilio from "twilio";

const enabled = process.env.NOTIFICATIONS_WHATSAPP_ENABLED === "true";
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_WHATSAPP_FROM;

const client = enabled && accountSid && authToken ? twilio(accountSid, authToken) : null;

export interface WhatsappMessage {
  to: string;   // E.164: +34600000000 (se prefija whatsapp: internamente)
  body: string;
}

export interface WhatsappResult {
  ok: boolean;
  sid?: string;
  error?: string;
}

export async function sendWhatsapp(msg: WhatsappMessage): Promise<WhatsappResult> {
  if (!enabled || !client || !fromNumber) {
    console.log("💬 [STUB] WhatsApp saltado (desactivado o sin credenciales):", {
      to: msg.to,
      body: msg.body.slice(0, 60) + "…",
    });
    return { ok: true, sid: "stub" };
  }

  try {
    const to = msg.to.startsWith("whatsapp:") ? msg.to : `whatsapp:${msg.to}`;
    const r = await client.messages.create({
      body: msg.body,
      from: fromNumber,
      to,
    });
    return { ok: true, sid: r.sid };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export const whatsappEnabled = enabled;
