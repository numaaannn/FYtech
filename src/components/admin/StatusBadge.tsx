const styles: Record<string, string> = {
  active: 'status-active',
  trial: 'status-trial',
  inactive: 'status-inactive',
  expired: 'status-inactive',
  cancelled: 'status-inactive',
};

export default function StatusBadge({ status }: { status: string }) {
  const tone = styles[status.toLowerCase()] ?? 'status-neutral';
  return <span className={`status-badge ${tone}`}><span className="status-dot" />{status}</span>;
}