import { NextResponse } from 'next/server';
import { currentUser } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';
import { getAppUrl, getProductConfig, getStripe } from '../../../lib/stripe';

const productNames: Record<string, string> = {
  salon: 'Salon OS',
  inventory: 'Inventory OS',
  pg: 'PG OS',
};

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: 'Sign in to subscribe.' }, { status: 401 });
  if (!user.businessId) return NextResponse.json({ error: 'Your workspace is not ready yet.' }, { status: 400 });

  const body = await request.json().catch(() => null);
  const slug = typeof body?.slug === 'string' ? body.slug.trim().toLowerCase() : '';
  const configuredProduct = getProductConfig(slug);
  const productName = configuredProduct?.name ?? productNames[slug];
  if (!productName) return NextResponse.json({ error: 'That product is not available.' }, { status: 400 });

  const software = await prisma.softwareProduct.findFirst({ where: { name: productName } });
  if (!software) return NextResponse.json({ error: 'That product is not available yet.' }, { status: 404 });

  const existing = await prisma.subscription.findFirst({ where: { businessId: user.businessId, softwareId: software.id } });
  if (existing) return NextResponse.json({ ok: true, subscription: existing });

  const stripe = getStripe();
  if (stripe && configuredProduct?.priceId) {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: configuredProduct.priceId, quantity: 1 }],
      customer_email: user.email,
      success_url: `${getAppUrl()}/checkout/success?slug=${encodeURIComponent(slug)}`,
      cancel_url: `${getAppUrl()}/checkout/cancel?slug=${encodeURIComponent(slug)}`,
      metadata: {
        businessId: String(user.businessId),
        softwareId: String(software.id),
        productName,
        slug,
      },
      allow_promotion_codes: true,
    });

    return NextResponse.json({ ok: true, checkoutUrl: session.url });
  }

  const subscription = await prisma.subscription.create({
    data: {
      businessId: user.businessId,
      softwareId: software.id,
      plan: 'Starter',
      status: 'Active',
    },
  });

  return NextResponse.json({ ok: true, subscription }, { status: 201 });
}