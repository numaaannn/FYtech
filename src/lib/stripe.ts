import Stripe from 'stripe';

export const PRODUCT_MAP = {
  salon: { name: 'Salon OS', priceId: process.env.STRIPE_PRICE_SALON },
  inventory: { name: 'Inventory OS', priceId: process.env.STRIPE_PRICE_INVENTORY },
  pg: { name: 'PG OS', priceId: process.env.STRIPE_PRICE_PG },
} as const;

export function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? process.env.APP_URL ?? 'http://localhost:3000';
}

export function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return null;

  return new Stripe(secretKey);
}

export function getProductConfig(slug: string) {
  return PRODUCT_MAP[slug as keyof typeof PRODUCT_MAP] ?? null;
}
