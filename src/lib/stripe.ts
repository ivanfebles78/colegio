import Stripe from "stripe";

const secret = process.env.STRIPE_SECRET_KEY;

export const stripe = secret
  ? new Stripe(secret, { apiVersion: "2024-10-28.acacia" })
  : (null as unknown as Stripe);

export const stripeEnabled = Boolean(secret);
