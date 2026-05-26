import { Router } from "express";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import PlantLibraryArticle from "../models/PlantLibraryArticle.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const articles = await PlantLibraryArticle.find({ isPublished: true }).sort({ sortOrder: 1, title: 1 });
    return res.json({ articles });
  } catch (error) {
    next(error);
  }
});

router.get("/:slug", async (req, res, next) => {
  try {
    const article = await PlantLibraryArticle.findOne({ slug: req.params.slug });
    if (!article || !article.isPublished) {
      return res.status(404).json({ message: "Library article not found" });
    }
    return res.json({ article });
  } catch (error) {
    next(error);
  }
});

router.post("/", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const article = await PlantLibraryArticle.create(req.body);
    return res.status(201).json({ article });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const article = await PlantLibraryArticle.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!article) return res.status(404).json({ message: "Library article not found" });
    return res.json({ article });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const article = await PlantLibraryArticle.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json({ message: "Library article not found" });
    return res.json({ message: "Library article deleted" });
  } catch (error) {
    next(error);
  }
});

export default router;
