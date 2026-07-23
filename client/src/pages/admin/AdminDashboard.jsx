import { Users, FileText, Briefcase, Target } from 'lucide-react';
import PlatformStatsCard from '../../components/admin/PlatformStatsCard';
import Card from '../../components/ui/Card';
import { usePlatformStats } from '../../hooks/useAdmin';
import Skeleton from '../../components/ui/Skeleton';


export default function AdminDashboard() {
  const { data: stats, isLoading } = usePlatformStats();
  if (isLoading) {
  return (
    <div className="px-8 py-8 max-w-6xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24" />)}
      </div>
      <Skeleton className="h-40" />
    </div>
  );
}

  const cards = [
    { label: 'Total Users', value: stats?.totalUsers ?? 0, icon: Users },
    { label: 'Resumes Analyzed', value: stats?.totalResumes ?? 0, icon: FileText },
    { label: 'Applications Tracked', value: stats?.totalApplications ?? 0, icon: Briefcase },
    { label: 'Avg ATS Score', value: `${stats?.avgAtsScore ?? 0}%`, icon: Target },
  ];

  return (
    <div className="px-4 md:px-8 py-6 md:py-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-1">Platform Overview</h1>
      <p className="text-sm text-[var(--color-text-secondary)] mb-8">Aggregate stats across all users on HireIQ.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {cards.map((card, i) => <PlatformStatsCard key={card.label} {...card} delay={i * 0.05} />)}
      </div>

      {stats?.applicationsByStatus && (
        <Card>
          <h3 className="text-sm font-medium text-[var(--color-text-primary)] mb-4">Applications by Status (All Users)</h3>
          <div className="grid grid-cols-4 gap-4">
            {Object.entries(stats.applicationsByStatus).map(([status, count]) => (
              <div key={status} className="text-center">
                <p className="text-xl font-semibold text-[var(--color-text-primary)]">{count}</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">{status}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}