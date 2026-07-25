import { useState } from 'react';
import Button from '../ui/Button';


const MIN_LENGTH = 100;
const MIN_WORD_COUNT = 15;

const getQuickFeedback = (text) => {
  const trimmed = text.trim();
  if (trimmed.length === 0) return null;
  if (trimmed.length < MIN_LENGTH) return `Add ${MIN_LENGTH - trimmed.length} more characters`;
  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length < MIN_WORD_COUNT) return `Add more detail — needs at least ${MIN_WORD_COUNT} words`;
  return `${trimmed.length} characters, ${words.length} words`;
};

export default function JobDescriptionInput({ onSubmit, isPending, buttonLabel = 'Analyze' }) {
  const [jd, setJd] = useState('');
  const feedback = getQuickFeedback(jd);
  const meetsMinimum = jd.trim().length >= MIN_LENGTH;

  return (
    <div className="w-full max-w-xl mx-auto">
      <textarea
        value={jd}
        onChange={(e) => setJd(e.target.value)}
        placeholder="Paste the full job description here (responsibilities, requirements, etc.)..."
        rows={5}
        className="w-full rounded-lg bg-[var(--color-surface-card)] border border-[var(--color-border)] p-3
          text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] resize-none
          focus:outline-none focus:ring-2 focus:ring-primary-500/40"
      />

      {feedback && <p className="text-xs mt-1 mb-3 text-[var(--color-text-muted)]">{feedback}</p>}

      <Button onClick={() => meetsMinimum && onSubmit(jd)} disabled={!meetsMinimum} isLoading={isPending} className="w-full">
        {isPending ? 'Analyzing...' : buttonLabel}
      </Button>
    </div>
  );
}