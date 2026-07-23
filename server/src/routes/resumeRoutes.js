import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';
import {
  uploadResume,
  getResumes,
  getResumeById,
  deleteResume,
  compareVersions,
} from '../controllers/resumeController.js';

const router = express.Router();

router.use(authMiddleware); // every resume route requires login

router.post('/upload', upload.single('resume'), uploadResume);
router.get('/', getResumes);
router.get('/compare', compareVersions);
router.get('/:id', getResumeById);
router.delete('/:id', deleteResume);

export default router;