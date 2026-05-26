import { Router } from "express";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import Review from "../models/Review.js";
import User from "../models/User.js";

const router = Router();
const reviewPopulate = { path: "customerId", select: "name email" };

router.post("/", requireAuth, async (req, res, next) => {
  try {
    const { rating, text } = req.body;
    if (!rating || !text) return res.status(400).json({ message: "Rating and review text are required" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const review = await Review.create({
      customerId: user._id,
      name: user.name,
      rating,
      text,
      approved: false,
    });

    await review.populate(reviewPopulate);
    return res.status(201).json({ review });
  } catch (error) {
    next(error);
  }
});

router.get("/my", requireAuth, async (req, res, next) => {
  try {
    const reviews = await Review.find({ customerId: req.user.id }).sort({ createdAt: -1 });
    return res.json({ reviews });
  } catch (error) {
    next(error);
  }
});

router.get("/public", async (_req, res, next) => {
  try {
    const reviews = await Review.find({ approved: true }).sort({ createdAt: -1 });
    return res.json({ reviews });
  } catch (error) {
    next(error);
  }
});

router.get("/", requireAuth, requireAdmin, async (_req, res, next) => {
  try {
    const reviews = await Review.find({}).populate(reviewPopulate).sort({ createdAt: -1 });
    return res.json({ reviews });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id/approve", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { approved: true, approvedAt: new Date() },
      { new: true, runValidators: true },
    ).populate(reviewPopulate);
    if (!review) return res.status(404).json({ message: "Review not found" });
    return res.json({ review });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });
    return res.json({ message: "Review deleted" });
  } catch (error) {
    next(error);
  }
});

export default router;
