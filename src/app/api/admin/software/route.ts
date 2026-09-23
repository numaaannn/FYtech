import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { requireAdmin } from '../../../../lib/auth';

export const dynamic = 'force-dynamic';

// List all software products
export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const software = await prisma.softwareProduct.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(software);
}

// Create a new software product
export async function POST(request: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json().catch(() => null);
  const name = typeof body?.name === 'string' ? body.name.trim() : '';
  const description = typeof body?.description === 'string' ? body.description.trim() : undefined;
  if (!name || name.length > 100 || (description && description.length > 500)) {
    return NextResponse.json({ error: 'Provide a product name of up to 100 characters.' }, { status: 400 });
  }
  const sw = await prisma.softwareProduct.create({
    data: { name, description: description || null },
  });
  return NextResponse.json(sw, { status: 201 });
}
