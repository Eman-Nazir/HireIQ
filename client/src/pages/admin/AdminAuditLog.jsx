import { useState } from 'react';
import { Shield, ShieldOff, Trash2, Clock } from 'lucide-react';
import { useAuditLogs } from '../../hooks/useAdmin';
import Skeleton from '../../components/ui/Skeleton';


const actionConfig = {
  ROLE_PROMOTED: { icon: Shield, color: 'text-amber-600 bg-amber-50' },
  ROLE_DEMOTED: { icon: ShieldOff, color: 'text-[var(--color-text-secondary)] bg-[var(--color-surface)]' },
  USER_DELETED: { icon: Trash2, color: 'text-red-600 bg-red-50' },
};

export default function AdminAuditLog() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAuditLogs(page);
 

  if (isLoading) {
  return (
    <div className="px-8 py-8 max-w-3xl mx-auto">
      <Skeleton className="h-6 w-32 mb-2" />
      <Skeleton className="h-4 w-72 mb-8" />
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-16" />)}
      </div>
    </div>
  );
}

  const { logs, pagination } = data || {};

  return (
    <div className="px-8 py-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-1">Audit Log</h1>
      <p className="text-sm text-[var(--color-text-secondary)] mb-8">A permanent record of every role change and user deletion.</p>

      <div className="space-y-2">
        {logs?.length === 0 && <p className="text-sm text-[var(--color-text-muted)]">No admin actions recorded yet.</p>}
        {logs?.map((log) => {
          const { icon: Icon, color } = actionConfig[log.action];
          return (
            <div key={log._id} className="flex items-start gap-3 rounded-xl bg-[var(--color-surface-card)] border border-[var(--color-border)] px-4 py-3">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${color}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-[var(--color-text-primary)]">{log.details}</p>
                <p className="text-xs text-[var(--color-text-muted)] flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3" /> {new Date(log.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {pagination?.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {Array.from({ length: pagination.totalPages }, (_, i) => (
            <button key={i} onClick={() => setPage(i + 1)} className={`w-8 h-8 rounded-lg text-xs transition-colors ${page === i + 1 ? 'bg-amber-50 text-amber-700' : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface)]'}`}>{i + 1}</button>
          ))}
        </div>
      )}
    </div>
  );
}