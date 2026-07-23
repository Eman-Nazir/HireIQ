import Resume from '../models/Resume.js';
import { extractTextFromPDF } from '../services/pdfService.js';
import { uploadPDFToCloudinary, deleteFromCloudinary } from '../services/cloudinaryUploadService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

// Lightweight heuristic check — not perfect, but filters out obviously non-resume PDFs
const looksLikeResume = (text) => {
  if (!text || text.length < 100) return false;
  const keywords = [
    'experience', 'education', 'skills', 'work', 'project',
    'university', 'college', 'email', 'phone', 'objective', 'summary',
  ];
  const lowerText = text.toLowerCase();
  const matchCount = keywords.filter((kw) => lowerText.includes(kw)).length;
  return matchCount >= 3;
};

// POST /api/resume/upload
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) return errorResponse(res, 400, 'No file uploaded');
    const { jobDescription } = req.body;

    const parsedText = await extractTextFromPDF(req.file.buffer);

    if (!looksLikeResume(parsedText)) {
      return errorResponse(res, 400, "This file doesn't appear to be a resume. Please upload an actual resume PDF.");
    }

    const cloudinaryResult = await uploadPDFToCloudinary(req.file.buffer, req.file.originalname);

    const existingCount = await Resume.countDocuments({ userId: req.user.id });
    const versionLabel = `v${existingCount + 1}`;

    const resume = await Resume.create({
      userId: req.user.id,
      fileUrl: cloudinaryResult.secure_url,
      cloudinaryId: cloudinaryResult.public_id,
      fileName: req.file.originalname,
      versionLabel,
      parsedText,
      jobDescription: jobDescription || '',
    });

    return successResponse(res, 201, 'Resume uploaded successfully', resume);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// GET /api/resume?page=1&limit=10
export const getResumes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [resumes, total] = await Promise.all([
      Resume.find({ userId: req.user.id })
        .select('-parsedText')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Resume.countDocuments({ userId: req.user.id }),
    ]);

    return successResponse(res, 200, 'Resumes fetched', {
      resumes,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// GET /api/resume/:id
export const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user.id });
    if (!resume) return errorResponse(res, 404, 'Resume not found');

    return successResponse(res, 200, 'Resume fetched', resume);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// DELETE /api/resume/:id
export const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user.id });
    if (!resume) return errorResponse(res, 404, 'Resume not found');

    await deleteFromCloudinary(resume.cloudinaryId);
    await resume.deleteOne();

    return successResponse(res, 200, 'Resume deleted successfully');
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// GET /api/resume/compare?ids=id1,id2
export const compareVersions = async (req, res) => {
  try {
    const ids = req.query.ids?.split(',') || [];
    if (ids.length < 2) return errorResponse(res, 400, 'Provide at least 2 resume IDs to compare');

    const resumes = await Resume.find({ _id: { $in: ids }, userId: req.user.id }).select(
      'versionLabel atsScore fileName createdAt'
    );

    return successResponse(res, 200, 'Comparison fetched', resumes);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};