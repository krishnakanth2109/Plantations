import mongoose from "mongoose";

const plantLibraryArticleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    summary: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    category: { type: String, default: "General", trim: true },
    tags: [{ type: String, trim: true }],
    isPublished: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

plantLibraryArticleSchema.index({ isPublished: 1, sortOrder: 1 });

export default mongoose.model("PlantLibraryArticle", plantLibraryArticleSchema);
