'use client';

import { FormEvent, ReactNode, useState } from 'react';
import { LoaderCircle, Plus, X } from 'lucide-react';

type Option = { id: number; name: string };

function Dialog({ title, trigger, children }: { title: string; trigger: ReactNode; children: (close: () => void) => ReactNode }) {
  const [open, setOpen] = useState(false);
  return <>
    <span onClick={() => setOpen(true)}>{trigger}</span>
    {open && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={title}>
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between"><h2 className="text-xl font-semibold text-slate-900">{title}</h2><button type="button" onClick={() => setOpen(false)} className="icon-button" aria-label={`Close ${title}`}><X size={18} /></button></div>
        {children(() => setOpen(false))}
      </div>
    </div>}
  </>;
}

function useSubmit() {
  const [loading, setLoading] = useState(false);
  const submit = async (url: string, body: object) => {
    setLoading(true);
    try {
      const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Something went wrong.');
      window.location.reload();
    } finally { setLoading(false); }
  };
  return { loading, submit };
}

export function AddSoftwareForm() {
  const [name, setName] = useState(''); const [description, setDescription] = useState(''); const [error, setError] = useState(''); const { loading, submit } = useSubmit();
  return <Dialog title="Add software product" trigger={<button className="primary-button"><Plus size={16} /> Add product</button>}>{close => <form className="mt-6 space-y-4" onSubmit={async (event: FormEvent) => { event.preventDefault(); setError(''); try { await submit('/api/admin/software', { name, description }); close(); } catch (e) { setError(e instanceof Error ? e.message : 'Unable to add product.'); } }}>
    <label className="form-field"><span className="form-label">Product name</span><input className="form-input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Salon OS" required maxLength={100} /></label>
    <label className="form-field"><span className="form-label">Description <span className="font-normal">(optional)</span></span><textarea className="form-input min-h-24 py-2.5" value={description} onChange={e => setDescription(e.target.value)} placeholder="What does this product help businesses do?" maxLength={500} /></label>
    {error && <p className="text-sm text-red-600" role="alert">{error}</p>}<div className="form-actions"><button type="button" onClick={close} className="secondary-button">Cancel</button><button disabled={loading} className="primary-button disabled:opacity-60">{loading && <LoaderCircle size={15} className="animate-spin" />}{loading ? 'Adding...' : 'Add product'}</button></div>
  </form>}</Dialog>;
}

export function InviteUserForm({ businesses }: { businesses: Option[] }) {
  const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [businessId, setBusinessId] = useState(''); const [role, setRole] = useState('User'); const [error, setError] = useState(''); const { loading, submit } = useSubmit();
  return <Dialog title="Invite user" trigger={<button className="primary-button"><Plus size={16} /> Invite user</button>}>{close => <form className="mt-6 space-y-4" onSubmit={async (event: FormEvent) => { event.preventDefault(); setError(''); try { await submit('/api/admin/users', { name, email, password, businessId, role }); close(); } catch (e) { setError(e instanceof Error ? e.message : 'Unable to invite user.'); } }}>
    <label className="form-field"><span className="form-label">Full name</span><input className="form-input" value={name} onChange={e => setName(e.target.value)} required maxLength={100} /></label><label className="form-field"><span className="form-label">Email address</span><input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} required maxLength={254} /></label><label className="form-field"><span className="form-label">Initial password</span><input className="form-input" type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={12} /><span className="text-xs text-slate-500">At least 12 characters.</span></label><label className="form-field"><span className="form-label">Business</span><select className="form-input" value={businessId} onChange={e => setBusinessId(e.target.value)}><option value="">No business assigned</option>{businesses.map(item => <option value={item.id} key={item.id}>{item.name}</option>)}</select></label><label className="form-field"><span className="form-label">Role</span><select className="form-input" value={role} onChange={e => setRole(e.target.value)}><option>User</option><option>Admin</option></select></label>
    {error && <p className="text-sm text-red-600" role="alert">{error}</p>}<div className="form-actions"><button type="button" onClick={close} className="secondary-button">Cancel</button><button disabled={loading} className="primary-button disabled:opacity-60">{loading && <LoaderCircle size={15} className="animate-spin" />}{loading ? 'Inviting...' : 'Invite user'}</button></div>
  </form>}</Dialog>;
}

export function AddSubscriptionForm({ businesses, software }: { businesses: Option[]; software: Option[] }) {
  const [businessId, setBusinessId] = useState(''); const [softwareId, setSoftwareId] = useState(''); const [plan, setPlan] = useState('Starter'); const [error, setError] = useState(''); const { loading, submit } = useSubmit();
  const disabled = !businesses.length || !software.length;
  return <Dialog title="Add subscription" trigger={<button className="primary-button" disabled={disabled}><Plus size={16} /> Add subscription</button>}>{close => <form className="mt-6 space-y-4" onSubmit={async (event: FormEvent) => { event.preventDefault(); setError(''); try { await submit('/api/admin/subscriptions', { businessId, softwareId, plan }); close(); } catch (e) { setError(e instanceof Error ? e.message : 'Unable to add subscription.'); } }}>
    <label className="form-field"><span className="form-label">Business</span><select className="form-input" value={businessId} onChange={e => setBusinessId(e.target.value)} required><option value="">Choose a business</option>{businesses.map(item => <option value={item.id} key={item.id}>{item.name}</option>)}</select></label><label className="form-field"><span className="form-label">Software product</span><select className="form-input" value={softwareId} onChange={e => setSoftwareId(e.target.value)} required><option value="">Choose a product</option>{software.map(item => <option value={item.id} key={item.id}>{item.name}</option>)}</select></label><label className="form-field"><span className="form-label">Plan</span><input className="form-input" value={plan} onChange={e => setPlan(e.target.value)} required maxLength={80} /></label>
    {error && <p className="text-sm text-red-600" role="alert">{error}</p>}<div className="form-actions"><button type="button" onClick={close} className="secondary-button">Cancel</button><button disabled={loading} className="primary-button disabled:opacity-60">{loading && <LoaderCircle size={15} className="animate-spin" />}{loading ? 'Adding...' : 'Add subscription'}</button></div>
  </form>}</Dialog>;
}
