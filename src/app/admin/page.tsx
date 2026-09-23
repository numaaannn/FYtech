import Link from 'next/link';
import { ArrowUpRight, BarChart3, Building2, CreditCard, Package2, Users } from 'lucide-react';
import { prisma } from '../../lib/prisma';
import StatCard from '../../components/admin/StatCard';
import StatusBadge from '../../components/admin/StatusBadge';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const [businessCount, softwareCount, userCount, activeSubscriptions, recentBusinesses] = await Promise.all([
    prisma.business.count(),
    prisma.softwareProduct.count(),
    prisma.user.count(),
    prisma.subscription.count({ where: { status: 'Active' } }),
    prisma.business.findMany({
      include: { subscriptions: { include: { software: true }, take: 1 } },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ]);

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-eyebrow">Monday, September 11, 2026</div>
          <h1 className="page-title">Good morning, Admin</h1>
          <p className="page-description">A clear view of the FYtech platform, your businesses, and product activity.</p>
        </div>
        <div className="page-header-actions"><Link href="/admin/businesses" className="primary-button"><Building2 size={16} /> View businesses</Link></div>
      </div>

      <div className="stat-grid">
        <StatCard label="Total businesses" value={businessCount} detail="All platform accounts" icon={Building2} tone="cyan" />
        <StatCard label="Software products" value={softwareCount} detail="Available in platform" icon={Package2} tone="violet" />
        <StatCard label="Registered users" value={userCount} detail="Across all businesses" icon={Users} tone="amber" />
        <StatCard label="Active subscriptions" value={activeSubscriptions} detail="Currently enabled" icon={CreditCard} tone="green" />
      </div>

      <div className="hero-card">
        <h2>One platform. Every business workflow.</h2>
        <p>FYtech brings specialized software, subscriptions, and operational clarity into one calm command center.</p>
        <Link href="/admin/software" className="primary-button">Explore software <ArrowUpRight size={15} /></Link>
      </div>

      <div className="split-grid mt-6">
        <section className="panel">
          <div className="panel-header"><div><div className="panel-title">Recent businesses</div><div className="panel-subtitle">Latest accounts added to FYtech</div></div><Link href="/admin/businesses" className="text-xs font-semibold text-teal-700">View all</Link></div>
          <div className="data-table-wrap">
            <table className="data-table"><thead><tr><th>Business</th><th>Software</th><th>Status</th></tr></thead><tbody>
              {recentBusinesses.map((business) => <tr key={business.id}><td><div className="entity-cell"><div className="avatar">{business.name.slice(0, 2).toUpperCase()}</div><div><div className="entity-name">{business.name}</div><div className="entity-meta">{business.ownerName}</div></div></div></td><td>{business.subscriptions[0]?.software.name ?? 'No software'}</td><td><StatusBadge status={business.status} /></td></tr>)}
              {recentBusinesses.length === 0 && <tr><td colSpan={3}><div className="empty-state"><Building2 size={24} /><strong>No businesses yet</strong><p>Add your first business to start building the FYtech network.</p></div></td></tr>}
            </tbody></table>
          </div>
        </section>
        <section className="panel">
          <div className="panel-header"><div><div className="panel-title">Platform pulse</div><div className="panel-subtitle">What is available today</div></div><BarChart3 size={18} className="text-slate-400" /></div>
          <div className="panel-body"><div className="empty-state"><BarChart3 size={25} /><strong>Analytics will appear here</strong><p>Growth, revenue, and usage trends will populate once event tracking is connected to the platform.</p><Link href="/admin/analytics" className="text-xs font-semibold text-teal-700">Open analytics</Link></div></div>
        </section>
      </div>
    </div>
  );
}
