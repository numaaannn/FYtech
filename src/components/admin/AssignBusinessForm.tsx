'use client';

import { FormEvent, useState } from 'react';
import { LoaderCircle } from 'lucide-react';

type Business = { id: number; name: string };

export default function AssignBusinessForm({ userId, businessId, businesses }: { userId: number; businessId: number | null; businesses: Business[] }) {
  const [value, setValue] = useState(businessId?.toString() ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/admin/users/${userId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ businessId: value }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      window.location.reload();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to assign business.');
      setLoading(false);
    }
  }

  return <form onSubmit={submit} className="flex items-center gap-2"><select aria-label="Assign business" className="form-input min-w-36 py-1.5 text-xs" value={value} onChange={event => setValue(event.target.value)}><option value="">Unassigned</option>{businesses.map(business => <option value={business.id} key={business.id}>{business.name}</option>)}</select><button className="secondary-button px-2.5 py-1.5 text-xs" disabled={loading}>{loading ? <LoaderCircle size={14} className="animate-spin" /> : 'Save'}</button>{error && <span className="text-xs text-red-600" role="alert">{error}</span>}</form>;
}