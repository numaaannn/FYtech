import { Users } from 'lucide-react';
import { prisma } from '../../../lib/prisma';
import StatusBadge from '../../../components/admin/StatusBadge';
import { InviteUserForm } from '../../../components/admin/ResourceForms';
import AssignBusinessForm from '../../../components/admin/AssignBusinessForm';

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
  const [users, businesses] = await Promise.all([prisma.user.findMany({ include: { business: true }, orderBy: { createdAt: 'desc' } }), prisma.business.findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' } })]);
  return (
    <div>
      <div className="page-header"><div><div className="page-eyebrow">People & access</div><h1 className="page-title">Users</h1><p className="page-description">Keep track of the people who access FYtech and their platform roles.</p></div><div className="page-header-actions"><InviteUserForm businesses={businesses} /></div></div>
      <section className="panel"><div className="panel-header"><div><div className="panel-title">All users</div><div className="panel-subtitle">{users.length} registered platform user{users.length === 1 ? '' : 's'}</div></div><Users size={18} className="text-slate-400" /></div><div className="data-table-wrap"><table className="data-table"><thead><tr><th>User</th><th>Email</th><th>Business</th><th>Role</th><th>Status</th><th>Joined</th></tr></thead><tbody>{users.map((user) => <tr key={user.id}><td><div className="entity-cell"><div className="avatar">{user.name.slice(0, 2).toUpperCase()}</div><div className="entity-name">{user.name}</div></div></td><td>{user.email}</td><td><AssignBusinessForm userId={user.id} businessId={user.businessId} businesses={businesses} /></td><td><span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">{user.role}</span></td><td><StatusBadge status="Active" /></td><td className="text-slate-500">{new Date(user.createdAt).toLocaleDateString('en-IN')}</td></tr>)}{users.length === 0 && <tr><td colSpan={6}><div className="empty-state"><Users size={27} /><strong>No users yet</strong><p>Users will appear here as businesses join the platform.</p></div></td></tr>}</tbody></table></div></section>
    </div>
  );
}
