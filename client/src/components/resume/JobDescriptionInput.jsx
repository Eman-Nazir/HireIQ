import { useState } from 'react';
import Button from '../ui/Button';

const MIN_JD_LENGTH = 100;
const MIN_WORD_COUNT = 15;

const getValidationState = (text) => {
  const trimmed = text.trim();
  if (trimmed.length === 0) return { valid: false, message: '' };

  const words = trimmed.split(/\s+/).filter(Boolean);
  const uniqueWords = new Set(words.map((w) => w.toLowerCase()));

  if (trimmed.length < MIN_JD_LENGTH) {
    return { valid: false, message: `Add ${MIN_JD_LENGTH - trimmed.length} more characters` };
  }
  if (words.length < MIN_WORD_COUNT) {
    return { valid: false, message: `Add more detail — needs at least ${MIN_WORD_COUNT} words` };
  }
  if (uniqueWords.size < MIN_WORD_COUNT * 0.5) {
    return { valid: false, message: 'This looks like repeated or placeholder text' };
  }

  return { valid: true, message: `${trimmed.length} characters, ${words.length} words` };
};

export default function JobDescriptionInput({ onSubmit, isPending, buttonLabel = 'Analyze' }) {
  const [jd, setJd] = useState('');
  const { valid, message } = getValidationState(jd);

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

      {message && (
        <p className={`text-xs mt-1 mb-3 ${valid ? 'text-[var(--color-text-muted)]' : 'text-amber-600'}`}>
          {message}
        </p>
      )}

      <Button onClick={() => valid && onSubmit(jd)} disabled={!valid} isLoading={isPending} className="w-full">
        {isPending ? 'Analyzing...' : buttonLabel}
      </Button>
    </div>
  );
}