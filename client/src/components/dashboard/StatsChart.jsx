import { motion } from 'framer-motion';
import Card from '../ui/Card';

const statusConfig = {
  Applied: { color: 'bg-blue-500', textColor: 'text-blue-600' },
  Interview: { color: 'bg-amber-500', textColor: 'text-amber-600' },
  Offer: { color: 'bg-emerald-500', textColor: 'text-emerald-600' },
  Rejected: { color: 'bg-red-500', textColor: 'text-red-600' },
};

export default function StatsChart({ byStatus = {} }) {
  const total = Object.values(byStatus).reduce((sum, n) => sum + n, 0) || 1;

  return (
    <Card>
      <h3 className="text-sm font-medium text-[var(--color-text-primary)] mb-4">Application Pipeline</h3>

      <div className="flex h-3 rounded-full overflow-hidden mb-4 bg-[var(--color-surface)]">
        {Object.entries(statusConfig).map(([status, { color }]) => {
          const count = byStatus[status] || 0;
          const width = (count / total) * 100;
          return width > 0 ? (
            <motion.div key={status} initial={{ width: 0 }} animate={{ width: `${width}%` }} transition={{ duration: 0.6 }} className={color} />
          ) : null;
        })}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {Object.entries(statusConfig).map(([status, { color }]) => (
          <div key={status} className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${color}`} />
            <span className="text-xs text-[var(--color-text-secondary)]">{status}</span>
            <span className="text-xs text-[var(--color-text-primary)] font-medium ml-auto">{byStatus[status] || 0}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}