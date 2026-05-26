import { Router } from "express";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import Payment from "../models/Payment.js";

const router = Router();
const paymentPopulate = { path: "customerId", select: "name email" };

router.get("/my", requireAuth, async (req, res, next) => {
  try {
    const payments = await Payment.find({ customerId: req.user.id }).populate(paymentPopulate).sort({ date: -1 });
    return res.json({ payments });
  } catch (error) {
    next(error);
  }
});

router.get("/", requireAuth, requireAdmin, async (_req, res, next) => {
  try {
    const payments = await Payment.find({}).populate(paymentPopulate).sort({ date: -1 });
    return res.json({ payments });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id/status", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true },
    ).populate(paymentPopulate);
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    return res.json({ payment });
  } catch (error) {
    next(error);
  }
});

export default router;
