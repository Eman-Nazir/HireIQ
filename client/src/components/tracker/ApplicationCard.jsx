
import { Trash2, Building2, ChevronDown } from 'lucide-react';
import { useDeleteApplication, useUpdateApplicationStatus } from '../../hooks/useApplications';
import { useToast } from '../../hooks/useToast';

const STATUSES = ['Applied', 'Interview', 'Offer', 'Rejected'];

export default function ApplicationCard({ application, onDragStart }) {
  const { mutate: deleteApplication } = useDeleteApplication();
  const { mutate: updateStatus } = useUpdateApplicationStatus();
  const { showToast } = useToast();

  const handleDelete = () => {
    deleteApplication(application._id, {
      onSuccess: () => showToast(`Removed ${application.role} at ${application.company}`, 'success'),
      onError: () => showToast('Failed to delete application', 'error'),
    });
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    if (newStatus === application.status) return;
    updateStatus(
      { id: application._id, status: newStatus },
      {
        onSuccess: () => showToast(`Moved to ${newStatus}`, 'success'),
        onError: () => showToast('Failed to update status', 'error'),
      }
    );
  };

  return (
    <div draggable onDragStart={(e) => onDragStart(e, application._id)}
      className="rounded-xl bg-[var(--color-surface-card)] border border-[var(--color-border)] p-3 cursor-grab active:cursor-grabbing
        hover:border-primary-200 transition-colors group">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 min-w-0">
          <Building2 className="w-3.5 h-3.5 text-[var(--color-text-muted)] mt-0.5 shrink-0" />
          <div className="min-w-0">
            <p className="text-sm text-[var(--color-text-primary)] font-medium truncate">{application.role}</p>
            <p className="text-xs text-[var(--color-text-muted)] truncate">{application.company}</p>
          </div>
        </div>
        <button onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 md:group-hover:opacity-100 text-[var(--color-text-muted)] hover:text-red-500 transition-all shrink-0">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {application.roleType && (
        <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full bg-primary-50 text-primary-600">{application.roleType}</span>
      )}

      {/* Mobile-friendly status selector — works on touch devices where drag doesn't */}
      <div className="mt-3 pt-2 border-t border-[var(--color-border)] md:hidden">
        <div className="relative">
          <select
            value={application.status}
            onChange={handleStatusChange}
            className="w-full appearance-none text-xs bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg
              pl-2 pr-7 py-1.5 text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-primary-500/40"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none" />
        </div>
      </div>
    </div>
  );
}