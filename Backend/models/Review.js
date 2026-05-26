import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String, required: true, trim: true },
    approved: { type: Boolean, default: false },
    approvedAt: { type: Date },
  },
  { timestamps: true },
);

reviewSchema.index({ approved: 1, createdAt: -1 });

export default mongoose.model("Review", reviewSchema);
