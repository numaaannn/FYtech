import { NextResponse } from 'next/server';
import { requireAdmin } from '../../../../../lib/auth';
import { prisma } from '../../../../../lib/prisma';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = Number((await params).id);
  const body = await request.json().catch(() => null);
  const businessId = body?.businessId === null || body?.businessId === '' ? null : Number(body?.businessId);

  if (!Number.isInteger(userId) || userId <= 0 || (businessId !== null && (!Number.isInteger(businessId) || businessId <= 0))) {
    return NextResponse.json({ error: 'Choose a valid business.' }, { status: 400 });
  }

  try {
    const user = await prisma.user.update({ where: { id: userId }, data: { businessId } });
    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: 'The user or business could not be found.' }, { status: 404 });
  }
}