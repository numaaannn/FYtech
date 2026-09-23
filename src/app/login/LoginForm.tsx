'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const router = useRouter(); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent) { event.preventDefault(); setLoading(true); setError(''); try { const response = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) }); const result = await response.json(); if (!response.ok) throw new Error(result.error); router.replace(result.role === 'Admin' ? '/admin' : '/'); router.refresh(); } catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to sign in.'); } finally { setLoading(false); } }
  return <form onSubmit={submit} className="space-y-4"><label className="form-field"><span className="form-label">Email</span><input className="form-input" type="email" value={email} onChange={event => setEmail(event.target.value)} autoComplete="email" required /></label><label className="form-field"><span className="form-label">Password</span><input className="form-input" type="password" value={password} onChange={event => setPassword(event.target.value)} autoComplete="current-password" required /></label>{error && <p className="text-sm text-red-600" role="alert">{error}</p>}<button className="primary-button w-full" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button></form>;
}
