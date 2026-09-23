import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { requireAdmin } from '../../../../lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const businesses = await prisma.business.findMany({
    include: { subscriptions: { include: { software: true } } },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(businesses);
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json().catch(() => null);
  const name = typeof body?.name === 'string' ? body.name.trim() : '';
  const ownerName = typeof body?.ownerName === 'string' ? body.ownerName.trim() : '';
  if (!name || !ownerName || name.length > 100 || ownerName.length > 100) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  const business = await prisma.business.create({
    data: { name, ownerName },
  });
  return NextResponse.json(business, { status: 201 });
}
