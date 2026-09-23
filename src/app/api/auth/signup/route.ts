import { NextResponse } from 'next/server';
import { createSession, hashPassword } from '../../../../lib/auth';
import { prisma } from '../../../../lib/prisma';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const name = typeof body?.name === 'string' ? body.name.trim() : '';
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body?.password === 'string' ? body.password : '';

  if (name.length < 2 || name.length > 100 || !/^\S+@\S+\.\S+$/.test(email) || password.length < 12) {
    return NextResponse.json({ error: 'Use a name, valid email, and a password of at least 12 characters.' }, { status: 400 });
  }

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        role: 'User',
        passwordHash: await hashPassword(password),
        business: { create: { name: `${name}'s workspace`, ownerName: name } },
      },
    });
    await createSession(user.id);
    return NextResponse.json({ ok: true, role: user.role }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'That email is already in use.' }, { status: 409 });
  }
}