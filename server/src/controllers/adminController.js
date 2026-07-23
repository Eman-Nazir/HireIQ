import User from '../models/User.js';
import Application from '../models/Application.js';
import Resume from '../models/Resume.js';
import AuditLog from '../models/AuditLog.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

// GET /api/admin/users?page=1&limit=20
export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find().select('-password').sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(),
    ]);

    return successResponse(res, 200, 'Users fetched', {
      users,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// GET /api/admin/users/:id
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return errorResponse(res, 404, 'User not found');

    const [resumes, applications] = await Promise.all([
      Resume.find({ userId: user._id }).sort({ createdAt: -1 }),
      Application.find({ userId: user._id }).sort({ createdAt: -1 }),
    ]);

    return successResponse(res, 200, 'User details fetched', { user, resumes, applications });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// PATCH /api/admin/users/:id/role
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) return errorResponse(res, 400, 'Invalid role');

    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return errorResponse(res, 404, 'User not found');

    if (targetUser.isProtected && role !== 'admin') {
      return errorResponse(res, 403, 'This account is protected and cannot be demoted');
    }

    const previousRole = targetUser.role;
    targetUser.role = role;
    await targetUser.save();

    const admin = await User.findById(req.user.id);

    await AuditLog.create({
      action: role === 'admin' ? 'ROLE_PROMOTED' : 'ROLE_DEMOTED',
      performedBy: req.user.id,
      performedByEmail: admin.email,
      targetUser: targetUser._id,
      targetUserEmail: targetUser.email,
      details: `${admin.email} changed ${targetUser.email}'s role from ${previousRole} to ${role}`,
    });

    return successResponse(res, 200, 'Role updated', targetUser);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// DELETE /api/admin/users/:id
export const deleteUser = async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      return errorResponse(res, 400, 'Cannot delete your own admin account');
    }

    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return errorResponse(res, 404, 'User not found');

    if (targetUser.isProtected) {
      return errorResponse(res, 403, 'This account is protected and cannot be deleted');
    }

    const admin = await User.findById(req.user.id);

    await AuditLog.create({
      action: 'USER_DELETED',
      performedBy: req.user.id,
      performedByEmail: admin.email,
      targetUserEmail: targetUser.email,
      details: `${admin.email} deleted user ${targetUser.email}`,
    });

    await targetUser.deleteOne();
    await Promise.all([
      Resume.deleteMany({ userId: req.params.id }),
      Application.deleteMany({ userId: req.params.id }),
    ]);

    return successResponse(res, 200, 'User and their data deleted');
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// GET /api/admin/stats — platform-wide overview
export const getPlatformStats = async (req, res) => {
  try {
    const [totalUsers, totalResumes, totalApplications, avgScoreResult, statusBreakdown] = await Promise.all([
      User.countDocuments(),
      Resume.countDocuments(),
      Application.countDocuments(),
      Resume.aggregate([
        { $match: { atsScore: { $exists: true } } },
        { $group: { _id: null, avgScore: { $avg: '$atsScore' } } },
      ]),
      Application.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    ]);

    return successResponse(res, 200, 'Platform stats fetched', {
      totalUsers,
      totalResumes,
      totalApplications,
      avgAtsScore: avgScoreResult[0]?.avgScore?.toFixed(1) || 0,
      applicationsByStatus: statusBreakdown.reduce((acc, s) => ({ ...acc, [s._id]: s.count }), {}),
    });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// GET /api/admin/applications?page=1&limit=20 — all applications across all users
export const getAllApplications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [applications, total] = await Promise.all([
      Application.find()
        .populate('userId', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Application.countDocuments(),
    ]);

    return successResponse(res, 200, 'Applications fetched', {
      applications,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// GET /api/admin/audit-logs?page=1&limit=20
export const getAuditLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      AuditLog.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      AuditLog.countDocuments(),
    ]);

    return successResponse(res, 200, 'Audit logs fetched', {
      logs,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};