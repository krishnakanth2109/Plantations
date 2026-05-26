import mongoose from "mongoose";

const maintenancePlanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true, trim: true },
    features: [{ type: String, trim: true }],
    priceNote: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

maintenancePlanSchema.index({ isActive: 1, sortOrder: 1 });

export default mongoose.model("MaintenancePlan", maintenancePlanSchema);
