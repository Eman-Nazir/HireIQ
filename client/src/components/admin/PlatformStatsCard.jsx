import { motion } from 'framer-motion';
import Card from '../ui/Card';

export default function PlatformStatsCard({ label, value, icon: Icon, delay = 0 }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
      <Card>
        <Icon className="w-4 h-4 text-amber-600 mb-3" />
        <p className="text-2xl font-semibold text-[var(--color-text-primary)]">{value}</p>
        <p className="text-xs text-[var(--color-text-muted)] mt-1">{label}</p>
      </Card>
    </motion.div>
  );
}