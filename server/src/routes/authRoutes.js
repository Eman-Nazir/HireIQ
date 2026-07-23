import express from 'express';
import passport from 'passport';
import {
  register, login, googleCallback, getMe, logout, logoutAllDevices, refreshAccessToken, updateProfile,
} from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { authLimiter } from '../middleware/rateLimitMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { registerSchema, loginSchema } from '../validators/authValidators.js';



const router = express.Router();

// router.post('/register', authLimiter, register);
// router.post('/login', authLimiter, login);
router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/logout', logout);
router.post('/logout-all', authMiddleware, logoutAllDevices);
router.post('/refresh', refreshAccessToken);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  googleCallback
);

router.get('/me', authMiddleware, getMe);
router.patch('/profile', authMiddleware, updateProfile);

export default router;