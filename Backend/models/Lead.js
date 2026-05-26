import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, default: "", trim: true, lowercase: true },
    source: {
      type: String,
      enum: ["Website", "WhatsApp", "Instagram", "Phone", "Email", "Referral", "Admin"],
      default: "Website",
    },
    interest: { type: String, default: "", trim: true },
    message: { type: String, default: "", trim: true },
    status: {
      type: String,
      enum: ["New", "Contacted", "Follow-up", "Scheduled", "In Progress", "Converted", "Completed", "Cancelled", "Lost"],
      default: "New",
    },
  },
  { timestamps: true },
);

leadSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model("Lead", leadSchema);
