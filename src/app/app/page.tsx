import Link from 'next/link';
import { Building2, CreditCard, Package2, UserRound } from 'lucide-react';
import { currentUser, requireUserPage } from '../../lib/auth';
import { prisma } from '../../lib/prisma';
import LogoutButton from './LogoutButton';
import WorkspaceAutoRefresh from './WorkspaceAutoRefresh';

export const dynamic = 'force-dynamic';

export default async function WorkspacePage() {
  await requireUserPage();
  const user = await currentUser();
  if (!user) return null;
  if (user.role === 'Admin') return <main className="min-h-screen grid place-items-center bg-slate-50 p-5"><Link className="primary-button" href="/admin">Open administrator console</Link></main>;
  const business = user.businessId ? await prisma.business.findUnique({ where: { id: user.businessId }, include: { subscriptions: { include: { software: true } } } }) : null;
  return <main className="min-h-screen bg-slate-50">
    <header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4"><Link href="/" className="font-extrabold tracking-tight text-slate-900">FYtech</Link><LogoutButton /></div></header>
    <div className="mx-auto max-w-5xl p-5 md:p-10">
      <div className="page-eyebrow">Your workspace</div>
      <h1 className="page-title">Welcome back, {user.name}</h1>
      <p className="page-description">{business ? `${business.name} is connected to FYtech.` : 'Your administrator has not assigned a business workspace yet.'}</p>
      {business ? <div className="mt-8 grid gap-4 md:grid-cols-3"><section className="stat-card"><div className="stat-icon stat-icon-cyan"><Building2 size={19} /></div><div className="stat-copy"><span className="stat-label">Business</span><strong className="text-base">{business.name}</strong><span className="stat-detail">{business.ownerName}</span></div></section><section className="stat-card"><div className="stat-icon stat-icon-violet"><Package2 size={19} /></div><div className="stat-copy"><span className="stat-label">Active products</span><strong>{business.subscriptions.length}</strong><span className="stat-detail">Available to your business</span></div></section><section className="stat-card"><div className="stat-icon stat-icon-green"><CreditCard size={19} /></div><div className="stat-copy"><span className="stat-label">Subscriptions</span><strong>{business.subscriptions.filter(item => item.status === 'Active').length}</strong><span className="stat-detail">Currently active</span></div></section></div> : <section className="panel mt-8"><div className="empty-state"><UserRound size={28} /><strong>Workspace pending</strong><p>Ask your administrator to assign you to a business to see products and subscriptions here.</p><WorkspaceAutoRefresh /></div></section>}
      {business && <section className="panel mt-6"><div className="panel-header"><div><div className="panel-title">Your product access</div><div className="panel-subtitle">Subscriptions assigned to {business.name}</div></div></div><div className="panel-body grid gap-3">{business.subscriptions.length ? business.subscriptions.map(subscription => <div className="flex items-center justify-between rounded-lg border border-slate-100 p-4" key={subscription.id}><div><strong className="text-sm text-slate-800">{subscription.software.name}</strong><p className="mt-1 text-xs text-slate-500">{subscription.plan} plan</p></div><span className="status-badge status-active"><i className="status-dot" />{subscription.status}</span></div>) : <p className="text-sm text-slate-500">No product subscriptions have been assigned yet.</p>}</div></section>}
    </div>
  </main>;
}
