// Notification API routes
import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import Notification from "../models/Notification.js";

const router = Router();

// Get my notifications (most recent first)
router.get("/my", requireAuth, async (req, res, next) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);
    return res.json({ notifications });
  } catch (error) {
    next(error);
  }
});

// Mark a single notification as read
router.patch("/:id/read", requireAuth, async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { read: true },
      { new: true },
    );
    if (!notification) return res.status(404).json({ message: "Notification not found" });
    return res.json({ notification });
  } catch (error) {
    next(error);
  }
});

// Mark all notifications as read
router.patch("/read-all", requireAuth, async (req, res, next) => {
  try {
    await Notification.updateMany({ userId: req.user.id, read: false }, { read: true });
    return res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

// Get unread count
router.get("/unread-count", requireAuth, async (req, res, next) => {
  try {
    const count = await Notification.countDocuments({ userId: req.user.id, read: false });
    return res.json({ count });
  } catch (error) {
    next(error);
  }
});

// Delete a single notification
router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ message: "Notification not found" });

    if (notification.userId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized to delete this notification" });
    }

    await Notification.findByIdAndDelete(req.params.id);
    return res.json({ ok: true, message: "Notification deleted successfully" });
  } catch (error) {
    next(error);
  }
});

export default router;
