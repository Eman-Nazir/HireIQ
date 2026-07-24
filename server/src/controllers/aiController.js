import Resume from '../models/Resume.js';
import { scoreResumeAgainstJD, generateInterviewQuestions } from '../services/aiService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

const MIN_JD_LENGTH = 100;
const MIN_WORD_COUNT = 15;

const isValidJobDescription = (text) => {
  if (!text) return false;
  const trimmed = text.trim();

  if (trimmed.length < MIN_JD_LENGTH) return false;

  // Count actual distinct words, not just characters
  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length < MIN_WORD_COUNT) return false;

  // Reject if too few unique words relative to total (catches "nnnn..." or "aaaa bbbb aaaa bbbb")
  const uniqueWords = new Set(words.map((w) => w.toLowerCase()));
  if (uniqueWords.size < MIN_WORD_COUNT * 0.5) return false;

  // Reject if the text is dominated by a single repeated character (catches "nnnnnnnn...")
  const charCounts = {};
  for (const char of trimmed.toLowerCase().replace(/\s/g, '')) {
    charCounts[char] = (charCounts[char] || 0) + 1;
  }
  const totalChars = trimmed.replace(/\s/g, '').length;
  const maxCharRatio = Math.max(...Object.values(charCounts)) / totalChars;
  if (maxCharRatio > 0.4) return false; // any single character making up >40% of text = spam

  return true;
};

// POST /api/ai/score/:resumeId
export const scoreResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.resumeId, userId: req.user.id });
    if (!resume) return errorResponse(res, 404, 'Resume not found');

    const jobDescription = req.body.jobDescription || resume.jobDescription;

    if (!isValidJobDescription(jobDescription)) {
      return errorResponse(
        res,
        400,
        'Please paste a real job description with role details, responsibilities, and requirements — not placeholder or repeated text.'
      );
    }

    const result = await scoreResumeAgainstJD(resume.parsedText, jobDescription);

    resume.atsScore = result.atsScore;
    resume.suggestions = result.suggestions;
    resume.jobDescription = jobDescription;
    await resume.save();

    return successResponse(res, 200, 'Resume scored successfully', {
      atsScore: result.atsScore,
      matchedSkills: result.matchedSkills,
      missingSkills: result.missingSkills,
      suggestions: result.suggestions,
    });
  } catch (error) {
    console.error('Score Resume Error:', error);
    return errorResponse(res, 500, error.message);
  }
};

// POST /api/ai/interview-prep/:resumeId
export const getInterviewQuestions = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.resumeId, userId: req.user.id });
    if (!resume) return errorResponse(res, 404, 'Resume not found');

    const jobDescription = req.body.jobDescription || resume.jobDescription;

    if (!isValidJobDescription(jobDescription)) {
      return errorResponse(
        res,
        400,
        'Please paste a real job description with role details, responsibilities, and requirements — not placeholder or repeated text.'
      );
    }

    const questions = await generateInterviewQuestions(jobDescription, resume.parsedText);

    return successResponse(res, 200, 'Interview questions generated', { questions });
  } catch (error) {
    console.error('Interview Prep Error:', error);
    return errorResponse(res, 500, error.message);
  }
};