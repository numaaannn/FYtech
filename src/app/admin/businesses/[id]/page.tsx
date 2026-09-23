import Link from 'next/link';
import { ArrowLeft, Building2, CalendarDays, CreditCard, Edit3, Package2, Users } from 'lucide-react';
import { prisma } from '../../../../lib/prisma';
import EditBusinessForm from './edit/EditBusinessForm';
import StatusBadge from '../../../../components/admin/StatusBadge';

export const dynamic = 'force-dynamic';

export default async function BusinessDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const business = await prisma.business.findUnique({ where: { id: Number(id) }, include: { subscriptions: { include: { software: true } } } });

  if (!business) return <div className="empty-state"><Building2 size={28} /><strong>Business not found</strong><p>This account may have been removed or the link is incorrect.</p><Link href="/admin/businesses" className="secondary-button">Back to businesses</Link></div>;

  return (
    <div>
      <Link href="/admin/businesses" className="mb-7 inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-teal-700"><ArrowLeft size={15} /> Back to businesses</Link>
      <div className="page-header"><div><div className="page-eyebrow">Business profile</div><div className="mt-2 flex items-center gap-3"><div className="avatar h-11 w-11 text-sm">{business.name.slice(0, 2).toUpperCase()}</div><h1 className="page-title">{business.name}</h1></div><p className="page-description">Owned by {business.ownerName}{business.description ? ` · ${business.description}` : ''}</p></div><div className="page-header-actions"><StatusBadge status={business.status} /><EditBusinessForm business={business} /></div></div>
      <div className="grid gap-4 md:grid-cols-3"><div className="stat-card"><div className="stat-icon stat-icon-cyan"><Building2 size={19} /></div><div className="stat-copy"><span className="stat-label">Account status</span><strong className="text-base">{business.status}</strong><span className="stat-detail">Platform access</span></div></div><div className="stat-card"><div className="stat-icon stat-icon-violet"><Package2 size={19} /></div><div className="stat-copy"><span className="stat-label">Software access</span><strong>{business.subscriptions.length}</strong><span className="stat-detail">Subscribed products</span></div></div><div className="stat-card"><div className="stat-icon stat-icon-amber"><Users size={19} /></div><div className="stat-copy"><span className="stat-label">Users</span><strong>—</strong><span className="stat-detail">Business membership is next</span></div></div></div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.45fr_1fr]"><section className="panel"><div className="panel-header"><div><div className="panel-title">Subscriptions</div><div className="panel-subtitle">Products currently connected to this account</div></div><CreditCard size={18} className="text-slate-400" /></div>{business.subscriptions.length === 0 ? <div className="empty-state"><Package2 size={25} /><strong>No subscriptions</strong><p>Product access will appear here when this business activates a plan.</p></div> : <div className="data-table-wrap"><table className="data-table"><thead><tr><th>Product</th><th>Plan</th><th>Status</th></tr></thead><tbody>{business.subscriptions.map((subscription) => <tr key={subscription.id}><td><div className="entity-name">{subscription.software.name}</div></td><td>{subscription.plan}</td><td><StatusBadge status={subscription.status} /></td></tr>)}</tbody></table></div>}</section><section className="panel"><div className="panel-header"><div className="panel-title">Account information</div><Edit3 size={17} className="text-slate-400" /></div><div className="panel-body grid gap-5"><div><span className="form-label">Owner</span><p className="mt-1 text-sm text-slate-700">{business.ownerName}</p></div><div><span className="form-label">Created</span><p className="mt-1 flex items-center gap-2 text-sm text-slate-700"><CalendarDays size={14} className="text-slate-400" />{new Date(business.createdAt).toLocaleDateString('en-IN', { dateStyle: 'long' })}</p></div><div><span className="form-label">Business ID</span><p className="mt-1 text-sm text-slate-700">FY-{business.id.toString().padStart(5, '0')}</p></div></div></section></div>
    </div>
  );
}