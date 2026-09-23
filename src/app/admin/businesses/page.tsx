import Link from 'next/link';
import { ArrowUpRight, Building2, Search } from 'lucide-react';
import BusinessForm from './BusinessForm';
import { prisma } from '../../../lib/prisma';
import StatusBadge from '../../../components/admin/StatusBadge';

export default async function BusinessesPage({ searchParams }: { searchParams?: Promise<{ search?: string }> }) {
  const query = (await searchParams)?.search ?? '';
  const businesses = await prisma.business.findMany({
    where: query ? { OR: [{ name: { contains: query } }, { ownerName: { contains: query } }] } : undefined,
    include: { subscriptions: { include: { software: true }, take: 1 } },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <div className="page-header">
        <div><div className="page-eyebrow">Platform directory</div><h1 className="page-title">Businesses</h1><p className="page-description">Manage every business connected to the FYtech ecosystem.</p></div>
        <div className="page-header-actions"><BusinessForm /></div>
      </div>
      <form className="filter-row" role="search">
        <div className="relative w-full sm:max-w-md"><Search size={16} className="pointer-events-none absolute left-3 top-3 text-slate-400" /><input name="search" defaultValue={query} placeholder="Search by business or owner" className="search-field pl-9" /></div>
        <button type="submit" className="secondary-button">Search</button>
        {query && <Link href="/admin/businesses" className="secondary-button">Clear</Link>}
      </form>
      <section className="panel">
        <div className="panel-header"><div><div className="panel-title">All businesses</div><div className="panel-subtitle">{businesses.length} account{businesses.length === 1 ? '' : 's'} in your workspace</div></div><Building2 size={18} className="text-slate-400" /></div>
        <div className="data-table-wrap"><table className="data-table"><thead><tr><th>Business</th><th>Software</th><th>Owner</th><th>Status</th><th>Joined</th><th /></tr></thead><tbody>
          {businesses.map((business) => <tr key={business.id}><td><Link href={`/admin/businesses/${business.id}`} className="entity-cell"><div className="avatar">{business.name.slice(0, 2).toUpperCase()}</div><div><div className="entity-name">{business.name}</div><div className="entity-meta">Account #{business.id.toString().padStart(4, '0')}</div></div></Link></td><td>{business.subscriptions[0]?.software.name ?? <span className="text-slate-400">No software</span>}</td><td>{business.ownerName}</td><td><StatusBadge status={business.status} /></td><td className="whitespace-nowrap text-slate-500">{new Date(business.createdAt).toLocaleDateString('en-IN')}</td><td><Link href={`/admin/businesses/${business.id}`} className="inline-flex text-slate-400 hover:text-teal-700" aria-label={`Open ${business.name}`}><ArrowUpRight size={17} /></Link></td></tr>)}
          {businesses.length === 0 && <tr><td colSpan={6}><div className="empty-state"><Building2 size={27} /><strong>No businesses found</strong><p>Try a different search or add a new business account.</p><BusinessForm /></div></td></tr>}
        </tbody></table></div>
      </section>
    </div>
  );
}