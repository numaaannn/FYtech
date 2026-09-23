import { ArrowUpRight, Package2 } from 'lucide-react';
import { prisma } from '../../../lib/prisma';
import { AddSoftwareForm } from '../../../components/admin/ResourceForms';

export const dynamic = 'force-dynamic';

export default async function SoftwarePage() {
  const products = await prisma.softwareProduct.findMany({ include: { _count: { select: { subscriptions: true } } }, orderBy: { createdAt: 'desc' } });

  return (
    <div>
      <div className="page-header"><div><div className="page-eyebrow">Product catalog</div><h1 className="page-title">Software</h1><p className="page-description">The specialized products businesses use to run and grow.</p></div><div className="page-header-actions"><AddSoftwareForm /></div></div>
      {products.length === 0 ? <section className="panel"><div className="empty-state"><Package2 size={28} /><strong>No software products yet</strong><p>Your product catalog will appear here when products are added.</p></div></section> : <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{products.map((product) => <article className="panel p-5 transition hover:-translate-y-0.5 hover:border-teal-200" key={product.id}><div className="mb-8 flex items-start justify-between"><div className="stat-icon stat-icon-cyan"><Package2 size={19} /></div><button className="icon-button" aria-label={`Open ${product.name}`}><ArrowUpRight size={17} /></button></div><h2 className="text-lg font-semibold tracking-tight text-slate-900">{product.name}</h2><p className="mt-2 min-h-10 text-sm leading-6 text-slate-500">{product.description || 'A focused FYtech software product.'}</p><div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-xs"><span className="text-slate-400">Subscriptions</span><strong className="text-slate-800">{product._count.subscriptions}</strong></div></article>)}</div>}
    </div>
  );
}
