import { CreditCard } from 'lucide-react';
import { prisma } from '../../../lib/prisma';
import StatusBadge from '../../../components/admin/StatusBadge';
import { AddSubscriptionForm } from '../../../components/admin/ResourceForms';

export const dynamic = 'force-dynamic';

export default async function SubscriptionsPage() {
  const [subscriptions, businesses, software] = await Promise.all([
    prisma.subscription.findMany({ include: { business: true, software: true }, orderBy: { createdAt: 'desc' } }),
    prisma.business.findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' } }),
    prisma.softwareProduct.findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' } }),
  ]);
  return (
    <div>
      <div className="page-header"><div><div className="page-eyebrow">Revenue foundation</div><h1 className="page-title">Subscriptions</h1><p className="page-description">Monitor product access across every business account.</p></div><div className="page-header-actions"><AddSubscriptionForm businesses={businesses} software={software} /></div></div>
      <section className="panel"><div className="panel-header"><div><div className="panel-title">Subscription ledger</div><div className="panel-subtitle">{subscriptions.length} active record{subscriptions.length === 1 ? '' : 's'} in the platform</div></div><CreditCard size={18} className="text-slate-400" /></div><div className="data-table-wrap"><table className="data-table"><thead><tr><th>Business</th><th>Software</th><th>Plan</th><th>Status</th><th>Started</th></tr></thead><tbody>{subscriptions.map((subscription) => <tr key={subscription.id}><td><div className="entity-cell"><div className="avatar">{subscription.business.name.slice(0, 2).toUpperCase()}</div><div><div className="entity-name">{subscription.business.name}</div><div className="entity-meta">Account #{subscription.business.id.toString().padStart(4, '0')}</div></div></div></td><td>{subscription.software.name}</td><td><span className="font-semibold text-slate-700">{subscription.plan}</span></td><td><StatusBadge status={subscription.status} /></td><td className="text-slate-500">{new Date(subscription.createdAt).toLocaleDateString('en-IN')}</td></tr>)}{subscriptions.length === 0 && <tr><td colSpan={5}><div className="empty-state"><CreditCard size={27} /><strong>No subscriptions yet</strong><p>Subscription records will appear here as businesses activate products.</p></div></td></tr>}</tbody></table></div></section>
    </div>
  );
}
