import { schoolConfig } from "@/lib/school-config";
import { sendEmail, tplStockBackInStock } from "./email";
import { sendSms, smsEnabled } from "./sms";
import { sendWhatsapp, whatsappEnabled } from "./whatsapp";

export { smsEnabled, whatsappEnabled };
export { sendEmail } from "./email";
export { sendSms } from "./sms";
export { sendWhatsapp } from "./whatsapp";

/**
 * Notifica a un padre/madre que un producto agotado ha vuelto a estar
 * disponible, usando los canales que él/ella eligió al hacer la reserva.
 *
 * - Email: siempre intentado si notifyEmail=true
 * - SMS/WhatsApp: solo si están activados a nivel global (.env) y el usuario
 *   los pidió. Cuando estén desactivados, las funciones devuelven ok=true
 *   pero no envían nada (modo stub).
 *
 * Devuelve la lista de canales que efectivamente se intentaron, para
 * registrar en la reserva.
 */
export async function notifyStockBackInStock(args: {
  parentName: string;
  contactEmail: string;
  contactPhone?: string | null;
  notifyEmail: boolean;
  notifySms: boolean;
  notifyWhatsapp: boolean;
  productName: string;
  productDetail?: string;
  reservationUrl: string;
}): Promise<{ channels: string[]; ok: boolean }> {
  const channels: string[] = [];
  let allOk = true;

  if (args.notifyEmail && args.contactEmail) {
    const html = tplStockBackInStock({
      parentName: args.parentName,
      productName: args.productName,
      productDetail: args.productDetail,
      url: args.reservationUrl,
    });
    const r = await sendEmail({
      to: args.contactEmail,
      subject: `Vuelve a estar disponible: ${args.productName}`,
      html,
    });
    if (r.ok) channels.push("email");
    else allOk = false;
  }

  if (args.notifySms && args.contactPhone) {
    const body = `Hola ${args.parentName}, "${args.productName}" ya está disponible en la tienda del ${schoolConfig.shortName}. ${args.reservationUrl}`;
    const r = await sendSms({ to: args.contactPhone, body });
    if (r.ok) channels.push("sms");
    else allOk = false;
  }

  if (args.notifyWhatsapp && args.contactPhone) {
    const body = `Hola ${args.parentName}, "${args.productName}" ya está disponible en la tienda del ${schoolConfig.shortName}. ${args.reservationUrl}`;
    const r = await sendWhatsapp({ to: args.contactPhone, body });
    if (r.ok) channels.push("whatsapp");
    else allOk = false;
  }

  return { channels, ok: allOk };
}
