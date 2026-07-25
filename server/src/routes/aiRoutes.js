import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { jobDescriptionSchema } from '../validators/aiValidators.js';
import { scoreResume, getInterviewQuestions } from '../controllers/aiController.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/score/:resumeId', validate(jobDescriptionSchema), scoreResume);
router.post('/interview-prep/:resumeId', validate(jobDescriptionSchema), getInterviewQuestions);

export default router;