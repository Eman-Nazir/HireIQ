import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { sanitize } from 'express-mongo-sanitize';
import passport from './config/passport.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import { apiLimiter } from './middleware/rateLimitMiddleware.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const app = express();

app.set('etag', false);

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  if (req.body) req.body = sanitize(req.body);
  next();
});

app.use(passport.initialize());

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

app.use('/api', apiLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/application', applicationRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;