import mongoose from 'mongoose';
import Application from '../models/Application.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

// POST /api/application
export const createApplication = async (req, res) => {
  try {
    const { company, role, roleType, status, appliedDate, notes, resumeId } = req.body;

    const application = await Application.create({
      userId: req.user.id,
      company,
      role,
      roleType,
      status: status || 'Applied',
      appliedDate: appliedDate || Date.now(),
      notes,
      resumeId,
    });

    return successResponse(res, 201, 'Application created', application);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// GET /api/application
export const getApplications = async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.user.id }).sort({ createdAt: -1 });
    return successResponse(res, 200, 'Applications fetched', applications);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// PATCH /api/application/:id
export const updateApplication = async (req, res) => {
  try {
    const application = await Application.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!application) return errorResponse(res, 404, 'Application not found');

    return successResponse(res, 200, 'Application updated', application);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// PATCH /api/application/:id/status — used specifically for drag-and-drop
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Applied', 'Interview', 'Offer', 'Rejected'].includes(status)) {
      return errorResponse(res, 400, 'Invalid status');
    }

    const application = await Application.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { status },
      { new: true }
    );
    if (!application) return errorResponse(res, 404, 'Application not found');

    return successResponse(res, 200, 'Status updated', application);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// DELETE /api/application/:id
export const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!application) return errorResponse(res, 404, 'Application not found');

    return successResponse(res, 200, 'Application deleted');
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// GET /api/application/stats — for Dashboard pipeline overview
export const getApplicationStats = async (req, res) => {
  try {
    const userObjectId = new mongoose.Types.ObjectId(req.user.id);

    const stats = await Application.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const byRoleType = await Application.aggregate([
      { $match: { userId: userObjectId } },
      {
        $group: {
          _id: '$roleType',
          total: { $sum: 1 },
          offers: { $sum: { $cond: [{ $eq: ['$status', 'Offer'] }, 1, 0] } },
        },
      },
    ]);

    return successResponse(res, 200, 'Stats fetched', {
      byStatus: stats.reduce((acc, s) => ({ ...acc, [s._id]: s.count }), {}),
      byRoleType,
    });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};