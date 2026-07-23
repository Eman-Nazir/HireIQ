import { Trash2, Building2 } from 'lucide-react';
import { useDeleteApplication } from '../../hooks/useApplications';
import { useToast } from '../../hooks/useToast';

export default function ApplicationCard({ application, onDragStart }) {
  const { mutate: deleteApplication } = useDeleteApplication();
  const { showToast } = useToast();

  const handleDelete = () => {
    deleteApplication(application._id, {
      onSuccess: () => showToast(`Removed ${application.role} at ${application.company}`, 'success'),
      onError: () => showToast('Failed to delete application', 'error'),
    });
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
          className="opacity-0 group-hover:opacity-100 text-[var(--color-text-muted)] hover:text-red-500 transition-all shrink-0">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
      {application.roleType && (
        <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full bg-primary-50 text-primary-600">{application.roleType}</span>
      )}
    </div>
  );
}