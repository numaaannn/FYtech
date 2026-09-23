import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { requireAdmin } from '../../../../lib/auth';
import { hashPassword } from '../../../../lib/auth';

export const dynamic = 'force-dynamic';

// List all users (read‑only)
export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const users = await prisma.user.findMany();
  return NextResponse.json(users);
}

// Create a new user (simple example)
export async function POST(request: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json().catch(() => null);
  const name = typeof body?.name === 'string' ? body.name.trim() : '';
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
  const role = body?.role === 'Admin' ? 'Admin' : 'User';
  const password = typeof body?.password === 'string' ? body.password : '';
  const businessId = body?.businessId === '' || body?.businessId === undefined ? null : Number(body.businessId);
  if (!name || !email || name.length > 100 || email.length > 254 || !/^\S+@\S+\.\S+$/.test(email) || password.length < 12 || (businessId !== null && (!Number.isInteger(businessId) || businessId <= 0))) {
    return NextResponse.json({ error: 'Enter a valid name, email, password, and business.' }, { status: 400 });
  }
  try {
    const user = await prisma.user.create({ data: { name, email, role, passwordHash: await hashPassword(password), businessId } });
    return NextResponse.json(user, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'That email is already in use, or the selected business no longer exists.' }, { status: 409 });
  }
}
