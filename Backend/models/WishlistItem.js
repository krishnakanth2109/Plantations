import mongoose from "mongoose";

const wishlistItemSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Inventory" },
    serviceTitle: { type: String, trim: true },
    productTitle: { type: String, trim: true },
  },
  { timestamps: true },
);

wishlistItemSchema.index({ customerId: 1, serviceId: 1 }, { unique: true, sparse: true });
wishlistItemSchema.index({ customerId: 1, productId: 1 }, { unique: true, sparse: true });

export default mongoose.model("WishlistItem", wishlistItemSchema);
