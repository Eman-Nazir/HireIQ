import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';
import {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  getPlatformStats,
  getAllApplications,
  getAuditLogs
} from '../controllers/adminController.js';

const router = express.Router();

// Every route here requires: logged in AND role === 'admin'
router.use(authMiddleware, adminMiddleware);

router.get('/stats', getPlatformStats);
router.get('/audit-logs', getAuditLogs);

router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.patch('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);
router.get('/applications', getAllApplications);

export default router;