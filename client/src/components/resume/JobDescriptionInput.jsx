import { useState } from 'react';
import Button from '../ui/Button';

export default function JobDescriptionInput({ onSubmit, isPending, buttonLabel = 'Analyze' }) {
  const [jd, setJd] = useState('');

  return (
    <div className="w-full max-w-xl mx-auto">
      <textarea
        value={jd}
        onChange={(e) => setJd(e.target.value)}
        placeholder="Paste the job description here..."
        rows={5}
        className="w-full rounded-lg bg-[var(--color-surface-card)] border border-[var(--color-border)] p-3
          text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] resize-none
          focus:outline-none focus:ring-2 focus:ring-primary-500/40"
      />
      <Button onClick={() => jd.trim() && onSubmit(jd)} disabled={!jd.trim()} isLoading={isPending} className="w-full mt-3">
        {isPending ? 'Analyzing...' : buttonLabel}
      </Button>
    </div>
  );
}