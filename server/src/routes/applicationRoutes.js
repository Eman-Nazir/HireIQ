import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  createApplication,
  getApplications,
  updateApplication,
  updateApplicationStatus,
  deleteApplication,
  getApplicationStats,
} from '../controllers/applicationController.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', createApplication);
router.get('/', getApplications);
router.get('/stats', getApplicationStats);
router.patch('/:id', updateApplication);
router.patch('/:id/status', updateApplicationStatus);
router.delete('/:id', deleteApplication);

export default router;