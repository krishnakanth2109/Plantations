import mongoose from "mongoose";

const wishlistItemSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
    serviceTitle: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

wishlistItemSchema.index({ customerId: 1, serviceId: 1 }, { unique: true });

export default mongoose.model("WishlistItem", wishlistItemSchema);
