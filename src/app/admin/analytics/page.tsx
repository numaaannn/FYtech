import { BarChart3, Building2, CreditCard, Info, Users } from 'lucide-react';
import { prisma } from '../../../lib/prisma';
import StatCard from '../../../components/admin/StatCard';

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
  const [businesses, users, subscriptions] = await Promise.all([prisma.business.count(), prisma.user.count(), prisma.subscription.count()]);
  return (
    <div>
      <div className="page-header"><div><div className="page-eyebrow">Platform intelligence</div><h1 className="page-title">Analytics</h1><p className="page-description">A measured view of the FYtech ecosystem, built from the data currently available.</p></div></div>
      <div className="stat-grid"><StatCard label="Businesses" value={businesses} detail="Current account total" icon={Building2} tone="cyan" /><StatCard label="Users" value={users} detail="Current user total" icon={Users} tone="amber" /><StatCard label="Subscriptions" value={subscriptions} detail="Current record total" icon={CreditCard} tone="green" /><StatCard label="Tracked events" value={0} detail="Event tracking not connected" icon={BarChart3} tone="violet" /></div>
      <section className="panel"><div className="panel-body"><div className="empty-state"><BarChart3 size={30} /><strong>Time-series analytics are not available yet</strong><p>The current platform schema stores account snapshots, not historical events or revenue transactions. Connect event tracking and billing data here when those services are introduced.</p><div className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-slate-500"><Info size={14} /> No numbers have been invented for this view.</div></div></div></section>
    </div>
  );
}