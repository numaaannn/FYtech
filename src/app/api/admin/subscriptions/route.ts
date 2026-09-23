import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { requireAdmin } from '../../../../lib/auth';

export const dynamic = 'force-dynamic';

// List all subscriptions with related business and software
export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const subs = await prisma.subscription.findMany({
    include: { business: true, software: true },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(subs);
}

// Create a new subscription (expect businessId, softwareId, plan, status)
export async function POST(request: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json().catch(() => null);
  const businessId = Number(body?.businessId);
  const softwareId = Number(body?.softwareId);
  const plan = typeof body?.plan === 'string' ? body.plan.trim() : '';
  const status = body?.status === 'Inactive' || body?.status === 'Trial' ? body.status : 'Active';
  if (!Number.isInteger(businessId) || businessId <= 0 || !Number.isInteger(softwareId) || softwareId <= 0 || !plan || plan.length > 80) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  try {
    const sub = await prisma.subscription.create({ data: { businessId, softwareId, plan, status } });
    return NextResponse.json(sub, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'The selected business or product no longer exists.' }, { status: 400 });
  }
}
