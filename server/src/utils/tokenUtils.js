import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export const generateAccessToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
  });

export const generateRefreshToken = () => crypto.randomBytes(40).toString('hex');

export const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

export const getRefreshTokenExpiryDate = () => {
  const days = parseInt(process.env.JWT_REFRESH_EXPIRES_IN) || 7;
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
};