import { motion } from 'framer-motion';
import { FileText, Briefcase, TrendingUp, Award } from 'lucide-react';
import Card from '../components/ui/Card';
import Skeleton from '../components/ui/Skeleton';
import StatsChart from '../components/dashboard/StatsChart';
import { useApplicationStats, useApplications } from '../hooks/useApplications';
import { useResumes } from '../hooks/useResume';
import { useAuth } from '../hooks/useAuth';

export default function Dashboard() {
  const { user } = useAuth();
  const { data: stats, isLoading: statsLoading } = useApplicationStats();
  const { data: applications, isLoading: applicationsLoading } = useApplications();
  const { data: resumeData, isLoading: resumesLoading } = useResumes();

  const isLoading = statsLoading || applicationsLoading || resumesLoading;

  if (isLoading) {
    return (
      <div className="px-4 md:px-8 py-8 max-w-6xl mx-auto">
        <Skeleton className="h-24 rounded-2xl mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
        <Skeleton className="h-40" />
      </div>
    );
  }

  const totalApplications = applications?.length || 0;
  const offers = stats?.byStatus?.Offer || 0;
  const successRate = totalApplications > 0 ? Math.round((offers / totalApplications) * 100) : 0;

  const summaryCards = [
    { label: 'Total Applications', value: totalApplications, icon: Briefcase },
    { label: 'Resumes Uploaded', value: resumeData?.resumes?.length || 0, icon: FileText },
    { label: 'Offers Received', value: offers, icon: Award },
    { label: 'Success Rate', value: `${successRate}%`, icon: TrendingUp },
  ];

  return (
    <div className="px-4 md:px-8 py-6 md:py-8 max-w-6xl mx-auto">
      <div className="rounded-2xl bg-primary-500 px-8 py-10 mb-8">
        <h1 className="text-2xl font-semibold text-white mb-1">Welcome back, {user?.name?.split(' ')[0]}</h1>
        <p className="text-sm text-primary-50">Here's how your job search is going.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {summaryCards.map(({ label, value, icon: Icon }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card>
              <Icon className="w-4 h-4 text-primary-500 mb-3" />
              <p className="text-xl font-semibold text-[var(--color-text-primary)]">{value}</p>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1">{label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <StatsChart byStatus={stats?.byStatus} />
    </div>
  );
}