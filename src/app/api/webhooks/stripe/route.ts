import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '../../../../lib/prisma';
import { getStripe } from '../../../../lib/stripe';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ ok: false, error: 'Stripe is not configured.' }, { status: 500 });
  }

  const signature = request.headers.get('stripe-signature');
  const rawBody = await request.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature ?? '',
      process.env.STRIPE_WEBHOOK_SECRET ?? '',
    );
  } catch (error) {
    console.error('Stripe webhook verification failed:', error);
    return NextResponse.json({ ok: false, error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const businessId = Number(session.metadata?.businessId ?? 0);
    const softwareId = Number(session.metadata?.softwareId ?? 0);

    if (businessId && softwareId) {
      const existing = await prisma.subscription.findFirst({
        where: { businessId, softwareId },
      });

      if (!existing) {
        await prisma.subscription.create({
          data: {
            businessId,
            softwareId,
            plan: session.metadata?.productName ?? 'Starter',
            status: 'Active',
          },
        });
      } else if (existing.status !== 'Active') {
        await prisma.subscription.update({
          where: { id: existing.id },
          data: { status: 'Active', plan: session.metadata?.productName ?? existing.plan },
        });
      }
    }
  }

  return NextResponse.json({ ok: true });
}
