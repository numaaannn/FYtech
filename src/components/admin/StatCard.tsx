import type { LucideIcon } from 'lucide-react';

export default function StatCard({ label, value, detail, icon: Icon, tone = 'cyan' }: {
  label: string;
  value: number;
  detail: string;
  icon: LucideIcon;
  tone?: 'cyan' | 'violet' | 'amber' | 'green';
}) {
  return (
    <div className="stat-card">
      <div className={`stat-icon stat-icon-${tone}`}><Icon size={19} /></div>
      <div className="stat-copy">
        <span className="stat-label">{label}</span>
        <strong>{value.toLocaleString('en-IN')}</strong>
        <span className="stat-detail">{detail}</span>
      </div>
    </div>
  );
}