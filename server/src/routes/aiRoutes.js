import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { scoreResume, getInterviewQuestions } from '../controllers/aiController.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/score/:resumeId', scoreResume);
router.post('/interview-prep/:resumeId', getInterviewQuestions);

export default router;