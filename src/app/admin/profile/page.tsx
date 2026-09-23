import { UserRound } from 'lucide-react';
import { requireAdminPage, currentUser } from '../../../lib/auth';
import ProfileSettingsForm from './ProfileSettingsForm';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  await requireAdminPage();
  const user = await currentUser();
  if (!user) return null;
  return <div><div className="page-header"><div><div className="page-eyebrow">Account</div><h1 className="page-title">Profile settings</h1><p className="page-description">Manage the administrator profile and the password used to access this console.</p></div></div><section className="panel max-w-2xl"><div className="panel-header"><div className="entity-cell"><div className="stat-icon stat-icon-cyan"><UserRound size={19} /></div><div><div className="panel-title">Administrator profile</div><div className="panel-subtitle">{user.email}</div></div></div></div><div className="panel-body"><ProfileSettingsForm initialName={user.name} /></div></section></div>;
}
