import { Router } from "express";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import GalleryItem from "../models/GalleryItem.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const galleryItems = await GalleryItem.find({ isActive: true }).sort({ sortOrder: 1, createdAt: -1 });
    return res.json({ galleryItems });
  } catch (error) {
    next(error);
  }
});

router.get("/superadmin", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const galleryItems = await GalleryItem.find({}).sort({ sortOrder: 1, createdAt: -1 });
    return res.json({ galleryItems });
  } catch (error) {
    next(error);
  }
});

router.post("/", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { title, category, image, before = "", after = "", isActive = true, sortOrder = 0 } = req.body;
    if (!title || !category || !image) {
      return res.status(400).json({ message: "Title, category, and image are required" });
    }

    const galleryItem = await GalleryItem.create({
      title,
      category,
      image,
      before,
      after,
      isActive,
      sortOrder,
    });

    return res.status(201).json({ galleryItem });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const galleryItem = await GalleryItem.findByIdAndDelete(req.params.id);
    if (!galleryItem) return res.status(404).json({ message: "Gallery item not found" });
    return res.json({ message: "Gallery item deleted" });
  } catch (error) {
    next(error);
  }
});

export default router;
