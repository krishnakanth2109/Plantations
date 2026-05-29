import { Router } from "express";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import Cms from "../models/Cms.js";

const router = Router();

// Get active CMS settings
router.get("/", async (req, res, next) => {
  try {
    let cms = await Cms.findOne();
    if (!cms) {
      // Return defaults if none exists
      cms = await Cms.create({});
    }
    return res.json({ cms });
  } catch (error) {
    next(error);
  }
});

// Update CMS settings
router.post("/", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const cms = await Cms.findOneAndUpdate(
      {},
      req.body,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    return res.json({ cms });
  } catch (error) {
    next(error);
  }
});

export default router;
