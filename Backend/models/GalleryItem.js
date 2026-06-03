import mongoose from "mongoose";

const galleryItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    image: { type: String, default: "", trim: true },
    before: { type: String, default: "", trim: true },
    after: { type: String, default: "", trim: true },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

galleryItemSchema.index({ isActive: 1, sortOrder: 1, createdAt: -1 });

export default mongoose.model("GalleryItem", galleryItemSchema);
