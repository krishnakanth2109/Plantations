import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: {
      type: String,
      enum: ["Styling", "Maintenance", "Wellness", "Landscaping", "Fertilizing", "Other"],
      default: "Other",
    },
    description: { type: String, required: true, trim: true },
    imageUrl: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    features: [{ type: String, trim: true }],
    priceNote: { type: String, default: "" },
  },
  { timestamps: true },
);

serviceSchema.index({ isActive: 1, sortOrder: 1 });

export default mongoose.model("Service", serviceSchema);
