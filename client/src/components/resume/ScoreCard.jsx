import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import Card from '../ui/Card';

const scoreColor = (score) => (score >= 75 ? 'text-emerald-600' : score >= 50 ? 'text-amber-600' : 'text-red-600');
const ringColor = (score) => (score >= 75 ? '#059669' : score >= 50 ? '#d97706' : '#dc2626');

export default function ScoreCard({ result }) {
  if (!result) return null;
  const { atsScore, matchedSkills, missingSkills, suggestions } = result;
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (atsScore / 100) * circumference;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-xl mx-auto mt-8">
      <Card>
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24 shrink-0">
            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-border)" strokeWidth="8" />
              <motion.circle cx="50" cy="50" r="40" fill="none" stroke={ringColor(atsScore)} strokeWidth="8" strokeLinecap="round"
                strokeDasharray={circumference} initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset: offset }} transition={{ duration: 1, ease: 'easeOut' }} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-xl font-semibold ${scoreColor(atsScore)}`}>{atsScore}%</span>
            </div>
          </div>
          <div>
            <h3 className="text-[var(--color-text-primary)] font-medium">ATS Match Score</h3>
            <p className="text-sm text-[var(--color-text-secondary)]">Based on the job description provided</p>
          </div>
        </div>

        {matchedSkills?.length > 0 && (
          <div className="mt-5">
            <p className="text-xs font-medium text-[var(--color-text-secondary)] mb-2 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Matched Skills
            </p>
            <div className="flex flex-wrap gap-2">
              {matchedSkills.map((skill, i) => (
                <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">{skill}</span>
              ))}
            </div>
          </div>
        )}

        {missingSkills?.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-medium text-[var(--color-text-secondary)] mb-2 flex items-center gap-1">
              <XCircle className="w-3.5 h-3.5 text-red-500" /> Missing Skills
            </p>
            <div className="flex flex-wrap gap-2">
              {missingSkills.map((skill, i) => (
                <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-100">{skill}</span>
              ))}
            </div>
          </div>
        )}

        {suggestions?.length > 0 && (
          <div className="mt-5 pt-5 border-t border-[var(--color-border)]">
            <p className="text-xs font-medium text-[var(--color-text-secondary)] mb-3 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-primary-500" /> Rewrite Suggestions
            </p>
            <div className="space-y-3">
              {suggestions.map((s, i) => (
                <div key={i} className="text-sm">
                  <span className="text-primary-600 font-medium">{s.section}:</span>{' '}
                  <span className="text-[var(--color-text-secondary)]">{s.suggestion}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
}