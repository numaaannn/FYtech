'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      router.replace('/');
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to create your account.');
    } finally {
      setLoading(false);
    }
  }

  return <form onSubmit={submit} className="space-y-4"><label className="form-field"><span className="form-label">Full name</span><input className="form-input" value={name} onChange={event => setName(event.target.value)} autoComplete="name" required minLength={2} /></label><label className="form-field"><span className="form-label">Email</span><input className="form-input" type="email" value={email} onChange={event => setEmail(event.target.value)} autoComplete="email" required /></label><label className="form-field"><span className="form-label">Password</span><input className="form-input" type="password" value={password} onChange={event => setPassword(event.target.value)} autoComplete="new-password" required minLength={12} /><span className="text-xs text-slate-500">At least 12 characters.</span></label>{error && <p className="text-sm text-red-600" role="alert">{error}</p>}<button className="primary-button w-full" disabled={loading}>{loading ? 'Creating account...' : 'Create account'}</button></form>;
}