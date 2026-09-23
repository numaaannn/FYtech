'use client';

import { useState } from 'react';
import { ArrowRight, LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SubscribeButton({ slug, signedIn }: { slug: string; signedIn: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function subscribe() {
    if (!signedIn) {
      router.push('/login');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/subscriptions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
        return;
      }

      setMessage('Added to your workspace.');
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : 'Unable to subscribe.');
    } finally {
      setLoading(false);
    }
  }

  return <div><button onClick={subscribe} className="public-button public-button-dark" disabled={loading}>{loading && <LoaderCircle size={16} className="animate-spin" />}{loading ? 'Processing...' : signedIn ? 'Subscribe now' : 'Sign in to subscribe'} {!loading && <ArrowRight size={16} />}</button>{message && <p className="mt-3 text-sm text-slate-600" role="status">{message}</p>}</div>;
}