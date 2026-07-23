import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    resumeId: { type: mongoose.Schema.Types.ObjectId, ref: "Resume" },
    company: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    roleType: { type: String, trim: true }, // e.g. "Frontend", "Backend", "Full Stack"
    status: {
      type: String,
      enum: ["Applied", "Interview", "Offer", "Rejected"],
      default: "Applied",
    },
    appliedDate: { type: Date, default: Date.now },
    notes: { type: String },
  },
  { timestamps: true },
);

applicationSchema.index({ userId: 1, status: 1 });
applicationSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model("Application", applicationSchema);
