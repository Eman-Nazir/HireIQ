import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, FileText, Briefcase, Mail, Calendar, Shield } from 'lucide-react';
import api from '../../lib/axios';
import Card from '../../components/ui/Card';
import Skeleton from '../../components/ui/Skeleton';



const statusColors = {
  Applied: 'text-blue-700 bg-blue-50',
  Interview: 'text-amber-700 bg-amber-50',
  Offer: 'text-emerald-700 bg-emerald-50',
  Rejected: 'text-red-700 bg-red-50',
};

export default function AdminUserDetail() {
  const { id } = useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-user-detail', id],
    queryFn: async () => (await api.get(`/admin/users/${id}`)).data.data,
  });

 if (isLoading) {
  return (
    <div className="px-8 py-8 max-w-3xl mx-auto">
      <Skeleton className="h-4 w-24 mb-6" />
      <Skeleton className="h-28 rounded-xl mb-6" />
      <Skeleton className="h-5 w-32 mb-3" />
      <Skeleton className="h-16 mb-8" />
      <Skeleton className="h-5 w-32 mb-3" />
      <Skeleton className="h-16" />
    </div>
  );
}


  if (isError) return <div className="px-8 py-8"><p className="text-sm text-red-500">Failed to load user details.</p></div>;

  const { user, resumes, applications } = data || {};

  return (
    <div className="px-8 py-8 max-w-3xl mx-auto">
      <Link to="/admin/users" className="inline-flex items-center gap-1 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Users
      </Link>

      <Card className="mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary-500 flex items-center justify-center text-lg text-white font-medium">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-medium text-[var(--color-text-primary)]">{user?.name}</p>
            <p className="text-sm text-[var(--color-text-secondary)] flex items-center gap-1"><Mail className="w-3 h-3" /> {user?.email}</p>
          </div>
          <span className={`ml-auto text-xs px-2.5 py-1 rounded-full flex items-center gap-1 ${user?.role === 'admin' ? 'bg-amber-50 text-amber-700' : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)]'}`}>
            <Shield className="w-3 h-3" /> {user?.role}
          </span>
        </div>
        <p className="text-xs text-[var(--color-text-muted)] mt-4 flex items-center gap-1">
          <Calendar className="w-3 h-3" /> Joined {user?.createdAt && new Date(user.createdAt).toLocaleDateString()}
        </p>
      </Card>

      <h3 className="text-sm font-medium text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
        <FileText className="w-4 h-4" /> Resumes ({resumes?.length || 0})
      </h3>
      <div className="space-y-2 mb-8">
        {resumes?.length === 0 && <p className="text-sm text-[var(--color-text-muted)]">No resumes uploaded.</p>}
        {resumes?.map((r) => (
          <Card key={r._id} className="!p-3 flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-text-primary)]">{r.fileName}</p>
              <p className="text-xs text-[var(--color-text-muted)]">{r.versionLabel} · {new Date(r.createdAt).toLocaleDateString()}</p>
            </div>
            {r.atsScore != null && <span className="text-xs font-medium text-primary-600">{r.atsScore}%</span>}
          </Card>
        ))}
      </div>

      <h3 className="text-sm font-medium text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
        <Briefcase className="w-4 h-4" /> Applications ({applications?.length || 0})
      </h3>
      <div className="space-y-2">
        {applications?.length === 0 && <p className="text-sm text-[var(--color-text-muted)]">No applications tracked.</p>}
        {applications?.map((a) => (
          <Card key={a._id} className="!p-3 flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-text-primary)]">{a.role}</p>
              <p className="text-xs text-[var(--color-text-muted)]">{a.company}</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${statusColors[a.status]}`}>{a.status}</span>
          </Card>
        ))}
      </div>
    </div>
  );
}