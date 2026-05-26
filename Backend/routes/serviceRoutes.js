import { Router } from "express";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import Service from "../models/Service.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ sortOrder: 1, title: 1 });
    return res.json({ services });
  } catch (error) {
    next(error);
  }
});

router.get("/:slug", async (req, res, next) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug });
    if (!service || !service.isActive) {
      return res.status(404).json({ message: "Service not found" });
    }
    return res.json({ service });
  } catch (error) {
    next(error);
  }
});

router.post("/", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const service = await Service.create(req.body);
    return res.status(201).json({ service });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!service) return res.status(404).json({ message: "Service not found" });
    return res.json({ service });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });
    return res.json({ message: "Service deleted" });
  } catch (error) {
    next(error);
  }
});

export default router;
