'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  Building2,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  LayoutDashboard,
  Package2,
  Settings,
  Users,
  X,
} from 'lucide-react';

const navigation = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Businesses', href: '/admin/businesses', icon: Building2 },
  { label: 'Software', href: '/admin/software', icon: Package2 },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Subscriptions', href: '/admin/subscriptions', icon: CreditCard },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

type AdminSidebarProps = {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggle: () => void;
  onCloseMobile: () => void;
};

export default function AdminSidebar({ collapsed, mobileOpen, onToggle, onCloseMobile }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {mobileOpen && <button className="sidebar-overlay lg:hidden" onClick={onCloseMobile} aria-label="Close navigation" />}
      <aside className={`admin-sidebar ${collapsed ? 'is-collapsed' : ''} ${mobileOpen ? 'is-mobile-open' : ''}`}>
        <div className="sidebar-brand">
          <Link href="/admin" className="brand-mark" onClick={onCloseMobile} aria-label="FYtech admin home">
            <span>F</span>
          </Link>
          {!collapsed && <span className="brand-wordmark">FYtech</span>}
          <button className="sidebar-close lg:hidden" onClick={onCloseMobile} aria-label="Close navigation">
            <X size={18} />
          </button>
        </div>

        <div className="sidebar-section-label">Workspace</div>
        <nav className="sidebar-nav" aria-label="Admin navigation">
          {navigation.map(({ label, href, icon: Icon }) => {
            const active = href === '/admin' ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={onCloseMobile}
                className={`sidebar-link ${active ? 'is-active' : ''}`}
                title={collapsed ? label : undefined}
              >
                <Icon size={18} strokeWidth={active ? 2.2 : 1.8} />
                {!collapsed && <span>{label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-spacer" />
        <div className={`sidebar-profile ${collapsed ? 'justify-center' : ''}`}>
          <div className="avatar avatar-small">AN</div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">Admin account</p>
              <p className="truncate text-xs text-slate-500">Platform operations</p>
            </div>
          )}
        </div>
        <button className="sidebar-collapse" onClick={onToggle} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </aside>
    </>
  );
}
