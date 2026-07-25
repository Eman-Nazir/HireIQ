import User from '../models/User.js';
import RefreshToken from '../models/RefreshToken.js';
import {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  getRefreshTokenExpiryDate,
} from '../utils/tokenUtils.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

const accessCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 15 * 60 * 1000, // 15 min
};

const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const issueTokens = async (res, user, userAgent) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken();

  await RefreshToken.create({
    userId: user._id,
    tokenHash: hashToken(refreshToken),
    expiresAt: getRefreshTokenExpiryDate(),
    userAgent,
  });

  res.cookie('accessToken', accessToken, accessCookieOptions);
  res.cookie('refreshToken', refreshToken, refreshCookieOptions);
};

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return errorResponse(res, 409, 'Email already in use');

    const user = await User.create({ name, email, password, authProvider: 'local' });
    await issueTokens(res, user, req.headers['user-agent']);

    return successResponse(res, 201, 'Registered successfully', {
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('Register Error:', error);
    return errorResponse(res, 500, 'Failed to register. Please try again.');
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !user.password) return errorResponse(res, 401, 'Invalid credentials');

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return errorResponse(res, 401, 'Invalid credentials');

    await issueTokens(res, user, req.headers['user-agent']);

    return successResponse(res, 200, 'Logged in successfully', {
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('Login Error:', error);
    return errorResponse(res, 500, 'Failed to log in. Please try again.');
  }
};

// GET /api/auth/google/callback
export const googleCallback = async (req, res) => {
  try {
    await issueTokens(res, req.user, req.headers['user-agent']);
    res.redirect(`${process.env.CLIENT_URL}/dashboard`);
  } catch (error) {
    console.error('Google Callback Error:', error);
    res.redirect(`${process.env.CLIENT_URL}/login?error=google_auth_failed`);
  }
};

// POST /api/auth/refresh
export const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return errorResponse(res, 401, 'No refresh token provided');

    const tokenHash = hashToken(refreshToken);
    const storedToken = await RefreshToken.findOne({ tokenHash });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      return errorResponse(res, 401, 'Refresh token expired or invalid, please log in again');
    }

    const user = await User.findById(storedToken.userId);
    if (!user) return errorResponse(res, 401, 'User not found');

    // Rotate: delete old refresh token, issue a new pair
    await storedToken.deleteOne();
    await issueTokens(res, user, req.headers['user-agent']);

    return successResponse(res, 200, 'Token refreshed');
  } catch (error) {
    console.error('Refresh Token Error:', error);
    return errorResponse(res, 500, 'Failed to refresh session. Please log in again.');
  }
};

// GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return errorResponse(res, 404, 'User not found');
    return successResponse(res, 200, 'User fetched', user);
  } catch (error) {
    console.error('Get Me Error:', error);
    return errorResponse(res, 500, 'Failed to fetch your profile. Please try again.');
  }
};

// POST /api/auth/logout
export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      await RefreshToken.deleteOne({ tokenHash: hashToken(refreshToken) });
    }
    res.clearCookie('accessToken', accessCookieOptions);
    res.clearCookie('refreshToken', refreshCookieOptions);
    return successResponse(res, 200, 'Logged out successfully');
  } catch (error) {
    console.error('Logout Error:', error);
    return errorResponse(res, 500, 'Failed to log out. Please try again.');
  }
};

// POST /api/auth/logout-all — bonus: revoke every session for this user
export const logoutAllDevices = async (req, res) => {
  try {
    await RefreshToken.deleteMany({ userId: req.user.id });
    res.clearCookie('accessToken', accessCookieOptions);
    res.clearCookie('refreshToken', refreshCookieOptions);
    return successResponse(res, 200, 'Logged out from all devices');
  } catch (error) {
    console.error('Logout All Devices Error:', error);
    return errorResponse(res, 500, 'Failed to log out from all devices. Please try again.');
  }
};

// PATCH /api/auth/profile
export const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, { name }, { new: true, runValidators: true });
    if (!user) return errorResponse(res, 404, 'User not found');
    return successResponse(res, 200, 'Profile updated', user);
  } catch (error) {
    console.error('Update Profile Error:', error);
    return errorResponse(res, 500, 'Failed to update profile. Please try again.');
  }
};