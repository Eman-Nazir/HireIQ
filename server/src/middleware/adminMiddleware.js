import { errorResponse } from '../utils/apiResponse.js';

export const adminMiddleware = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return errorResponse(res, 403, 'Admin access only');
  }
  next();
};