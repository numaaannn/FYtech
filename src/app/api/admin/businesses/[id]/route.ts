import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import { requireAdmin } from '../../../../../lib/auth';

export const dynamic = 'force-dynamic';

// Get a single business by ID, including its subscriptions and related software
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const business = await prisma.business.findUnique({
    where: { id: Number(id) },
    include: { subscriptions: { include: { software: true } } },
  });
  if (!business) {
    return NextResponse.json({ error: 'Business not found' }, { status: 404 });
  }
  return NextResponse.json(business);
}

// Update business fields (name, ownerName, description, status)
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const { name, ownerName, description, status } = await request.json();
  try {
    const updated = await prisma.business.update({
      where: { id: Number(id) },
      data: { name, ownerName, description, status },
    });
    return NextResponse.json(updated);
  } catch (e) {
    return NextResponse.json({ error: 'Update failed', details: (e as any).message }, { status: 400 });
  }
}

// Delete a business and cascade delete its subscriptions
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  try {
    await prisma.subscription.deleteMany({ where: { businessId: Number(id) } });
    await prisma.business.delete({ where: { id: Number(id) } });
    return NextResponse.json({ message: 'Business deleted' });
  } catch (e) {
    return NextResponse.json({ error: 'Delete failed', details: (e as any).message }, { status: 400 });
  }
}
