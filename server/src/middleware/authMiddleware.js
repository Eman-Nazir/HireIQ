import jwt from 'jsonwebtoken';
import { errorResponse } from '../utils/apiResponse.js';

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return errorResponse(res, 401, 'No access token provided');

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (error) {
    return errorResponse(res, 401, 'Access token expired or invalid');
  }
};