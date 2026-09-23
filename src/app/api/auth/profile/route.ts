import { NextResponse } from 'next/server';
import { hashPassword, requireAdmin, verifyPassword } from '../../../../lib/auth';
import { prisma } from '../../../../lib/prisma';

export async function PATCH(request: Request) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json().catch(() => null);
  const name = typeof body?.name === 'string' ? body.name.trim() : '';
  const currentPassword = typeof body?.currentPassword === 'string' ? body.currentPassword : '';
  const newPassword = typeof body?.newPassword === 'string' ? body.newPassword : '';
  if (name.length < 2 || name.length > 100) return NextResponse.json({ error: 'Enter a name between 2 and 100 characters.' }, { status: 400 });
  if (newPassword) {
    if (newPassword.length < 12) return NextResponse.json({ error: 'New passwords must be at least 12 characters.' }, { status: 400 });
    if (!(await verifyPassword(currentPassword, user.passwordHash))) return NextResponse.json({ error: 'Your current password is incorrect.' }, { status: 400 });
  }
  await prisma.user.update({ where: { id: user.id }, data: { name, ...(newPassword ? { passwordHash: await hashPassword(newPassword) } : {}) } });
  return NextResponse.json({ ok: true });
}
