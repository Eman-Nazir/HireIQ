import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    fileUrl: { type: String, required: true }, // Cloudinary URL
    cloudinaryId: { type: String, required: true }, // for deletion later
    fileName: { type: String, required: true },
    versionLabel: { type: String, default: "v1" },
    parsedText: { type: String }, // raw text from pdf-parse
    jobDescription: { type: String },
    atsScore: { type: Number, min: 0, max: 100 },
    suggestions: [{ section: String, suggestion: String }],
  },
  { timestamps: true },
);

resumeSchema.index({ userId: 1, createdAt: -1 }); // fast "latest versions" queries

export default mongoose.model("Resume", resumeSchema);
