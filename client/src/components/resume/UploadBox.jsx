import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileText, X } from 'lucide-react';
import { useUploadResume } from '../../hooks/useResume';
import { useToast } from '../../hooks/useToast';
import Button from '../ui/Button';

export default function UploadBox() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const inputRef = useRef(null);

  const { mutate: uploadResume, isPending, isError, error } = useUploadResume();
  const { showToast } = useToast();

  const handleFile = (selectedFile) => {
    if (selectedFile?.type === 'application/pdf') setFile(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = () => {
    if (!file) return;
    uploadResume(
      { file, jobDescription },
      {
        onSuccess: () => {
          setFile(null);
          setJobDescription('');
          showToast('Resume uploaded successfully', 'success');
        },
        onError: (err) => {
          showToast(err?.response?.data?.message || 'Upload failed', 'error');
        },
      }
    );
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative rounded-xl border-2 border-dashed p-10 text-center cursor-pointer transition-colors duration-200
          ${isDragging ? 'border-primary-500 bg-primary-50' : 'border-[var(--color-border)] bg-[var(--color-surface-card)]'}`}
      >
        <input ref={inputRef} type="file" accept="application/pdf" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />

        <AnimatePresence mode="wait">
          {file ? (
            <motion.div key="file" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center gap-3">
              <FileText className="w-6 h-6 text-primary-500" />
              <span className="text-sm text-[var(--color-text-primary)]">{file.name}</span>
              <button onClick={(e) => { e.stopPropagation(); setFile(null); }} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-2">
              <UploadCloud className="w-8 h-8 text-[var(--color-text-muted)]" />
              <p className="text-sm text-[var(--color-text-secondary)]">Drag & drop your resume PDF, or click to browse</p>
              <p className="text-xs text-[var(--color-text-muted)]">Max 5MB · PDF only</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <textarea
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        placeholder="Paste the job description (optional, enables ATS scoring later)"
        rows={4}
        className="w-full mt-4 rounded-lg bg-[var(--color-surface-card)] border border-[var(--color-border)] p-3
          text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] resize-none
          focus:outline-none focus:ring-2 focus:ring-primary-500/40"
      />

      <Button onClick={handleSubmit} disabled={!file} isLoading={isPending} className="w-full mt-4">
        {isPending ? 'Uploading...' : 'Upload Resume'}
      </Button>

      {isError && <p className="text-xs text-red-500 mt-2">{error?.response?.data?.message || 'Upload failed'}</p>}
    </div>
  );
}