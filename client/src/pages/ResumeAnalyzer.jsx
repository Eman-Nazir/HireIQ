import { useState } from 'react';
import UploadBox from '../components/resume/UploadBox';
import ResumeVersionList from '../components/resume/ResumeVersionList';
import JobDescriptionInput from '../components/resume/JobDescriptionInput';
import ScoreCard from '../components/resume/ScoreCard';
import { useResumes } from '../hooks/useResume';
import { useScoreResume } from '../hooks/useAI';
import { useToast } from '../hooks/useToast';

export default function ResumeAnalyzer() {
  const { data } = useResumes();
  const [selectedResumeId, setSelectedResumeId] = useState(null);
  const { mutate: scoreResume, data: scoreResult, isPending, isError, error } = useScoreResume();
  const { showToast } = useToast();

  const latestResume = data?.resumes?.[0];
  const activeResumeId = selectedResumeId || latestResume?._id;

  const handleScore = (jobDescription) => {
    if (!activeResumeId) return;
    scoreResume(
      { resumeId: activeResumeId, jobDescription },
      {
        onSuccess: (result) => showToast(`Scored ${result.atsScore}% match`, 'success'),
        onError: (err) => showToast(err?.response?.data?.message || 'Failed to score resume', 'error'),
      }
    );
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface)] px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-1">Resume Analyzer</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mb-8">Upload your resume and get AI-powered feedback against a job description.</p>

        <UploadBox />
        <ResumeVersionList onSelect={setSelectedResumeId} selectedId={activeResumeId} />

        {activeResumeId && (
          <div className="mt-8">
            <h2 className="text-sm font-medium text-[var(--color-text-primary)] mb-3">Score Against Job Description</h2>
            <JobDescriptionInput onSubmit={handleScore} isPending={isPending} buttonLabel="Score Resume" />
          </div>
        )}

        {isError && <p className="text-sm text-red-500 mt-3 text-center">{error.message}</p>}
        <ScoreCard result={scoreResult} />
      </div>
    </div>
  );
}