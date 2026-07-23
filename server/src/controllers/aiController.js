import Resume from '../models/Resume.js';
import { scoreResumeAgainstJD, generateInterviewQuestions } from '../services/aiService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

// POST /api/ai/score/:resumeId
export const scoreResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.resumeId, userId: req.user.id });
    if (!resume) return errorResponse(res, 404, 'Resume not found');

    const jobDescription = req.body.jobDescription || resume.jobDescription;
    if (!jobDescription) return errorResponse(res, 400, 'Job description required for scoring');

    const result = await scoreResumeAgainstJD(resume.parsedText, jobDescription);
console.log("Resume text length:", resume.parsedText.length);
console.log("Job description length:", jobDescription.length);
console.log("Resume preview:", resume.parsedText.substring(0, 300));
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
    if (!jobDescription) return errorResponse(res, 400, 'Job description required');

    const questions = await generateInterviewQuestions(jobDescription, resume.parsedText);

    return successResponse(res, 200, 'Interview questions generated', { questions });
  } catch (error) {
    console.error('Interview Prep Error:', error);
    return errorResponse(res, 500, error.message);
  }
};