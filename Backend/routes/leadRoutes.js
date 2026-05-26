import { Router } from "express";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import Lead from "../models/Lead.js";

const router = Router();

router.post("/", async (req, res, next) => {
  try {
    const { name, phone, email = "", source = "Website", interest = "", message = "", status = "New" } = req.body;
    if (!name || !phone) return res.status(400).json({ message: "Name and phone are required" });

    const lead = await Lead.create({ name, phone, email, source, interest, message, status });
    return res.status(201).json({ lead });
  } catch (error) {
    next(error);
  }
});

router.get("/", requireAuth, requireAdmin, async (_req, res, next) => {
  try {
    const leads = await Lead.find({}).sort({ createdAt: -1 });
    return res.json({ leads });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id/status", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true },
    );
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    return res.json({ lead });
  } catch (error) {
    next(error);
  }
});

export default router;
