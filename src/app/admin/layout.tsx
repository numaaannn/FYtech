import React from 'react';
import AdminShell from '../../components/admin/AdminShell';
import { requireAdminPage } from '../../lib/auth';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdminPage();
  return <AdminShell>{children}</AdminShell>;
}
