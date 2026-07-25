import Resume from '../models/Resume.js';
import { scoreResumeAgainstJD, generateInterviewQuestions } from '../services/aiService.js';
import { isValidJobDescription } from '../utils/textQuality.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

// POST /api/ai/score/:resumeId
export const scoreResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.resumeId, userId: req.user.id });
    if (!resume) return errorResponse(res, 404, 'Resume not found');

    const jobDescription = req.body.jobDescription || resume.jobDescription;

    // Fast free instant heuristic gate  catches obvious spam before an API call
    if (!isValidJobDescription(jobDescription)) {
      return errorResponse(res, 400, "This doesn't look like a real job description. Please paste an actual job posting.");
    }

    const result = await scoreResumeAgainstJD(resume.parsedText, jobDescription);

    // Smarter AI-based second check catches anything the heuristic missed
    if (result.isValid === false) {
      return errorResponse(res, 400, result.reason || "This doesn't look like a real job description.");
    }

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
    return errorResponse(res, 500, 'Failed to score resume. Please try again.');
  }
};

// POST /api/ai/interview-prep/:resumeId
export const getInterviewQuestions = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.resumeId, userId: req.user.id });
    if (!resume) return errorResponse(res, 404, 'Resume not found');

    const jobDescription = req.body.jobDescription || resume.jobDescription;

    if (!isValidJobDescription(jobDescription)) {
      return errorResponse(res, 400, "This doesn't look like a real job description. Please paste an actual job posting.");
    }

    const result = await generateInterviewQuestions(jobDescription, resume.parsedText);

    if (result.isValid === false) {
      return errorResponse(res, 400, result.reason || "This doesn't look like a real job description.");
    }

    return successResponse(res, 200, 'Interview questions generated', { questions: result.questions });
  } catch (error) {
    console.error('Interview Prep Error:', error);
    return errorResponse(res, 500, 'Failed to generate interview questions. Please try again.');
  }
};