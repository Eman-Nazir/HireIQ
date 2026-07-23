import { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Users, Lightbulb } from 'lucide-react';
import Card from '../components/ui/Card';
import JobDescriptionInput from '../components/resume/JobDescriptionInput';
import { useResumes } from '../hooks/useResume';
import { useInterviewQuestions } from '../hooks/useAI';
import { useToast } from '../hooks/useToast';

const filters = [
  { key: 'all', label: 'All' },
  { key: 'technical', label: 'Technical' },
  { key: 'behavioral', label: 'Behavioral' },
];

export default function InterviewPrep() {
  const { data } = useResumes();
  const latestResume = data?.resumes?.[0];
  const { mutate: getQuestions, data: result, isPending, isError, error } = useInterviewQuestions();
  const { showToast } = useToast();
  const [activeFilter, setActiveFilter] = useState('all');

  const handleGenerate = (jobDescription) => {
    if (!latestResume) return;
    getQuestions(
      { resumeId: latestResume._id, jobDescription },
      {
        onSuccess: (data) => {
          showToast(`Generated ${data.questions.length} interview questions`, 'success');
          setActiveFilter('all');
        },
        onError: (err) => showToast(err?.response?.data?.message || 'Failed to generate questions', 'error'),
      }
    );
  };

  const filteredQuestions = result?.questions?.filter((q) =>
    activeFilter === 'all' ? true : q.type === activeFilter
  );

  return (
    <div className="min-h-screen bg-[var(--color-surface)] px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-1">Interview Prep</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mb-8">Paste a job description to generate likely interview questions.</p>

        {!latestResume ? (
          <p className="text-sm text-[var(--color-text-muted)]">Upload a resume first to generate tailored questions.</p>
        ) : (
          <JobDescriptionInput onSubmit={handleGenerate} isPending={isPending} buttonLabel="Generate Questions" />
        )}

        {isError && <p className="text-sm text-red-500 mt-3 text-center">{error.message}</p>}

        {result?.questions?.length > 0 && (
          <>
            <div className="flex items-center gap-2 mt-8 mb-4">
              {filters.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveFilter(key)}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                    activeFilter === key
                      ? 'bg-primary-500 text-white'
                      : 'bg-[var(--color-surface-card)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:bg-[var(--color-surface)]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {filteredQuestions.map((q, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card>
                    <div className="flex gap-3">
                      {q.type === 'technical' ? (
                        <Briefcase className="w-4 h-4 text-primary-500 mt-0.5 shrink-0" />
                      ) : (
                        <Users className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      )}
                      <div className="min-w-0">
                        <p className="text-sm text-[var(--color-text-primary)]">{q.question}</p>
                        <span className="text-xs text-[var(--color-text-muted)] capitalize">{q.type}</span>
                      </div>
                    </div>

                    {q.suggestedAnswer && (
                      <div className="mt-3 pt-3 border-t border-[var(--color-border)] flex gap-2">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{q.suggestedAnswer}</p>
                      </div>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}