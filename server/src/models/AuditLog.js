import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  
  {
    action: {
      type: String,
      enum: ['ROLE_PROMOTED', 'ROLE_DEMOTED', 'USER_DELETED'],
      required: true,
    },
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    performedByEmail: { type: String, required: true }, // denormalized — survives even if the admin account is later deleted
    targetUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    targetUserEmail: { type: String, required: true },
    details: { type: String },
  },
  { timestamps: true }
);

auditLogSchema.index({ createdAt: -1 });

export default mongoose.model('AuditLog', auditLogSchema);