import { useState } from 'react';
import { motion } from 'framer-motion';
import { Kanban } from 'lucide-react';
import ApplicationCard from './ApplicationCard';
import Skeleton from '../ui/Skeleton';
import { useApplications, useUpdateApplicationStatus } from '../../hooks/useApplications';
import { useToast } from '../../hooks/useToast';

const columns = [
  { key: 'Applied', color: 'border-t-blue-500' },
  { key: 'Interview', color: 'border-t-amber-500' },
  { key: 'Offer', color: 'border-t-emerald-500' },
  { key: 'Rejected', color: 'border-t-red-500' },
];

export default function KanbanBoard() {
  const { data: applications, isLoading } = useApplications();
  const { mutate: updateStatus } = useUpdateApplicationStatus();
  const { showToast } = useToast();
  const [dragOverCol, setDragOverCol] = useState(null);

  const handleDragStart = (e, id) => e.dataTransfer.setData('applicationId', id);

  const handleDrop = (e, status) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('applicationId');
    updateStatus(
      { id, status },
      {
        onSuccess: () => showToast(`Moved to ${status}`, 'success'),
        onError: () => showToast('Failed to update status', 'error'),
      }
    );
    setDragOverCol(null);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-64 rounded-xl" />)}
      </div>
    );
  }

  if (applications?.length === 0) {
    return (
      <div className="text-center py-16">
        <Kanban className="w-10 h-10 text-[var(--color-text-muted)] mx-auto mb-3" />
        <p className="text-sm text-[var(--color-text-primary)] font-medium mb-1">No applications yet</p>
        <p className="text-sm text-[var(--color-text-secondary)]">Click "Add Application" above to start tracking your job search.</p>
      </div>
    );
  }

  return (
    <div className="flex md:grid md:grid-cols-4 gap-4 overflow-x-auto pb-2 md:overflow-visible">
      {columns.map(({ key, color }) => {
        const items = applications?.filter((app) => app.status === key) || [];
        return (
          <div key={key}
            onDragOver={(e) => { e.preventDefault(); setDragOverCol(key); }}
            onDragLeave={() => setDragOverCol(null)}
            onDrop={(e) => handleDrop(e, key)}
            className={`w-72 md:w-auto shrink-0 rounded-xl border-t-2 ${color} bg-[var(--color-surface-card)] border border-[var(--color-border)] p-3 min-h-[300px] transition-colors ${
              dragOverCol === key ? 'bg-primary-50/40' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-[var(--color-text-primary)]">{key}</h3>
              <span className="text-xs text-[var(--color-text-muted)]">{items.length}</span>
            </div>
            <div className="space-y-2">
              {items.map((app) => (
                <motion.div key={app._id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <ApplicationCard application={app} onDragStart={handleDragStart} />
                </motion.div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}