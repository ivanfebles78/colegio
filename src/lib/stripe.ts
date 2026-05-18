import Stripe from "stripe";

const secret = process.env.STRIPE_SECRET_KEY;

// La apiVersion debe coincidir con la que trae embebida el SDK de Stripe
// (sus tipos son literales). Si actualizas la dependencia `stripe`, conviene
// abrir el d.ts y copiar el valor de Stripe.LatestApiVersion.
export const stripe = secret
  ? new Stripe(secret, { apiVersion: "2025-02-24.acacia" })
  : (null as unknown as Stripe);

export const stripeEnabled = Boolean(secret);
