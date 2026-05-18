import { Resend } from "resend";
import { schoolConfig } from "@/lib/school-config";

const apiKey = process.env.RESEND_API_KEY;
const fromAddress = process.env.NOTIFICATION_FROM_EMAIL || `no-reply@${schoolConfig.domain}`;
const replyTo = process.env.NOTIFICATION_REPLY_TO || schoolConfig.email;

const resend = apiKey ? new Resend(apiKey) : null;

export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface EmailResult {
  ok: boolean;
  id?: string;
  error?: string;
}

/**
 * Envío real (Resend) cuando hay API key; modo "stub" en su ausencia para
 * que la app funcione en local sin claves: se imprime en consola.
 */
export async function sendEmail(msg: EmailMessage): Promise<EmailResult> {
  if (!resend) {
    console.log("📧 [STUB] Email saltado (sin RESEND_API_KEY):", {
      to: msg.to,
      subject: msg.subject,
    });
    return { ok: true, id: "stub" };
  }

  try {
    const r = await resend.emails.send({
      from: `${schoolConfig.shortName} <${fromAddress}>`,
      to: msg.to,
      subject: msg.subject,
      html: msg.html,
      text: msg.text,
      replyTo,
    });
    if (r.error) return { ok: false, error: r.error.message };
    return { ok: true, id: r.data?.id };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

// ---------------------------------------------------------------------------
//  Plantillas reutilizables (HTML simple, robusto y legible en cualquier cliente)
// ---------------------------------------------------------------------------

const baseStyles = `
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.5; color: #1a3a2e; background: #fafaf7; padding: 24px; margin: 0; }
  .card { max-width: 560px; margin: 0 auto; background: #fff; border-radius: 12px; padding: 32px; border: 1px solid #e7e2d6; }
  .brand { color: #1a3a2e; font-size: 14px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 16px; }
  h1 { font-size: 22px; margin: 0 0 16px; color: #1a3a2e; }
  p { margin: 0 0 12px; color: #2a2a2a; }
  .meta { background: #f5f1e6; padding: 16px; border-radius: 8px; margin: 16px 0; font-size: 14px; }
  .meta strong { color: #1a3a2e; }
  .btn { display: inline-block; background: #1a3a2e; color: #fff !important; padding: 10px 18px; border-radius: 8px; text-decoration: none; font-weight: 500; }
  .footer { color: #888; font-size: 12px; margin-top: 24px; text-align: center; }
</style>
`;

export function tplOrderConfirmation(args: {
  orderNumber: string;
  parentName: string;
  childName: string;
  courseName?: string;
  totalEuros: string;
  items: { name: string; detail?: string; quantity: number }[];
}) {
  const itemRows = args.items
    .map(
      (i) =>
        `<li><strong>${escapeHtml(i.name)}</strong>${
          i.detail ? ` — <span style="color:#666">${escapeHtml(i.detail)}</span>` : ""
        } × ${i.quantity}</li>`,
    )
    .join("");

  return `
${baseStyles}
<body>
  <div class="card">
    <div class="brand">${escapeHtml(schoolConfig.shortName)}</div>
    <h1>Pedido confirmado · ${escapeHtml(args.orderNumber)}</h1>
    <p>Hola ${escapeHtml(args.parentName)},</p>
    <p>Hemos recibido el pago para el pedido de <strong>${escapeHtml(args.childName)}</strong>${
      args.courseName ? ` (${escapeHtml(args.courseName)})` : ""
    }. Te avisaremos cuando esté listo para recoger en secretaría.</p>
    <div class="meta">
      <strong>Resumen</strong>
      <ul style="padding-left: 18px; margin: 8px 0 0;">
        ${itemRows}
      </ul>
      <p style="margin-top:12px;"><strong>Total:</strong> ${escapeHtml(args.totalEuros)}</p>
    </div>
    <p><strong>Recogida:</strong> ${escapeHtml(schoolConfig.pickupAddress)}</p>
    <div class="footer">${escapeHtml(schoolConfig.name)} · ${escapeHtml(schoolConfig.location)}</div>
  </div>
</body>
`;
}

export function tplStockBackInStock(args: {
  parentName: string;
  productName: string;
  productDetail?: string;
  url: string;
}) {
  return `
${baseStyles}
<body>
  <div class="card">
    <div class="brand">${escapeHtml(schoolConfig.shortName)}</div>
    <h1>¡Buenas noticias! Hay stock disponible</h1>
    <p>Hola ${escapeHtml(args.parentName)},</p>
    <p>El producto que estabas esperando ya está disponible para comprar:</p>
    <div class="meta">
      <strong>${escapeHtml(args.productName)}</strong>
      ${args.productDetail ? `<br><span style="color:#666">${escapeHtml(args.productDetail)}</span>` : ""}
    </div>
    <p><a class="btn" href="${args.url}">Reservar ahora</a></p>
    <p style="font-size:13px; color:#666; margin-top:16px;">El stock es limitado. Te recomendamos completar la compra cuanto antes.</p>
    <div class="footer">${escapeHtml(schoolConfig.name)} · ${escapeHtml(schoolConfig.location)}</div>
  </div>
</body>
`;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
