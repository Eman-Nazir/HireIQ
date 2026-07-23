import { useState } from 'react';
import UserTable from '../../components/admin/UserTable';
import { useAdminUsers } from '../../hooks/useAdmin';
import Skeleton from '../../components/ui/Skeleton';



export default function AdminUsers() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminUsers(page);
  
  
  if (isLoading) {
  return (
    <div className="px-8 py-8 max-w-6xl mx-auto">
      <Skeleton className="h-6 w-32 mb-2" />
      <Skeleton className="h-4 w-64 mb-8" />
      <Skeleton className="h-64 rounded-xl" />
    </div>
  );
}

  const { users, pagination } = data || {};

  return (
    <div className="px-4 md:px-8 py-6 md:py-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-1">Users</h1>
      <p className="text-sm text-[var(--color-text-secondary)] mb-8">Manage all registered users on the platform.</p>
      <UserTable users={users || []} />
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