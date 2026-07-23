import { motion } from 'framer-motion';
import { FileText, Trash2, ExternalLink } from 'lucide-react';
import { useResumes, useDeleteResume } from '../../hooks/useResume';
import { useToast } from '../../hooks/useToast';
import Skeleton from '../ui/Skeleton';

export default function ResumeVersionList({ onSelect, selectedId }) {
  const { data, isLoading, isError } = useResumes();
  const { mutate: deleteResume } = useDeleteResume();
  const { showToast } = useToast();

  const handleDelete = (resume) => {
    deleteResume(resume._id, {
      onSuccess: () => showToast(`Deleted ${resume.fileName}`, 'success'),
      onError: () => showToast('Failed to delete resume', 'error'),
    });
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-xl mx-auto mt-8 space-y-2">
        {[...Array(2)].map((_, i) => <Skeleton key={i} className="h-16" />)}
      </div>
    );
  }

  if (isError) return <p className="text-sm text-red-500">Failed to load resumes.</p>;

  const resumes = data?.resumes || [];
  if (resumes.length === 0) return <p className="text-sm text-[var(--color-text-muted)]">No resumes uploaded yet.</p>;

  return (
    <div className="w-full max-w-xl mx-auto mt-8 space-y-2">
      <h3 className="text-sm font-medium text-[var(--color-text-primary)] mb-3">Your Resume Versions</h3>

      {resumes.map((resume) => (
        <motion.div
          key={resume._id}
          onClick={() => onSelect?.(resume._id)}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center justify-between rounded-xl border px-4 py-3 cursor-pointer transition-colors ${
            selectedId === resume._id ? 'bg-primary-50 border-primary-200' : 'bg-[var(--color-surface-card)] border-[var(--color-border)]'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <FileText className="w-4 h-4 text-primary-500 shrink-0" />
            <div className="min-w-0">
              <p className="text-sm text-[var(--color-text-primary)] truncate">{resume.fileName}</p>
              <p className="text-xs text-[var(--color-text-muted)]">
                {resume.versionLabel} · {new Date(resume.createdAt).toLocaleDateString()}
                {resume.atsScore != null && ` · ${resume.atsScore}% match`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a href={resume.fileUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
              className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">
              <ExternalLink className="w-4 h-4" />
            </a>
            <button onClick={(e) => { e.stopPropagation(); handleDelete(resume); }}
              className="text-[var(--color-text-muted)] hover:text-red-500 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}