import { useState } from 'react';
import Skeleton from '../../components/ui/Skeleton';
import { useAdminApplications } from '../../hooks/useAdmin';

const statusColors = {
  Applied: 'text-blue-700 bg-blue-50',
  Interview: 'text-amber-700 bg-amber-50',
  Offer: 'text-emerald-700 bg-emerald-50',
  Rejected: 'text-red-700 bg-red-50',
};

export default function AdminApplications() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminApplications(page);

  if (isLoading) {
    return (
      <div className="px-8 py-8 max-w-6xl mx-auto">
        <Skeleton className="h-6 w-48 mb-2" />
        <Skeleton className="h-4 w-64 mb-8" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  const { applications, pagination } = data || {};

  return (
    <div className="px-8 py-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-1">All Applications</h1>
      <p className="text-sm text-[var(--color-text-secondary)] mb-8">Every job application tracked across all users.</p>

      <div className="rounded-xl bg-[var(--color-surface-card)] border border-[var(--color-border)] overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="border-b border-[var(--color-border)] text-left text-[var(--color-text-muted)] text-xs">
              <th className="px-5 py-3 font-medium">User</th>
              <th className="px-5 py-3 font-medium">Company</th>
              <th className="px-5 py-3 font-medium">Role</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Applied</th>
            </tr>
          </thead>
          <tbody>
            {applications?.map((app) => (
              <tr key={app._id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-surface)]">
                <td className="px-5 py-3 text-[var(--color-text-secondary)]">{app.userId?.name || 'Unknown'}</td>
                <td className="px-5 py-3 text-[var(--color-text-primary)]">{app.company}</td>
                <td className="px-5 py-3 text-[var(--color-text-secondary)]">{app.role}</td>
                <td className="px-5 py-3"><span className={`text-xs px-2 py-1 rounded-full ${statusColors[app.status]}`}>{app.status}</span></td>
                <td className="px-5 py-3 text-[var(--color-text-muted)]">{new Date(app.appliedDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
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