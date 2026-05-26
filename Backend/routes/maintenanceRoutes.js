import { Router } from "express";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import MaintenancePlan from "../models/MaintenancePlan.js";
import Subscription from "../models/Subscription.js";

export const maintenancePlanRouter = Router();
export const subscriptionRouter = Router();

const subscriptionPopulate = [
  { path: "customerId", select: "name email phone address" },
  { path: "planId", select: "name slug" },
];

maintenancePlanRouter.get("/", async (_req, res, next) => {
  try {
    const plans = await MaintenancePlan.find({ isActive: true }).sort({ sortOrder: 1, name: 1 });
    return res.json({ plans });
  } catch (error) {
    next(error);
  }
});

maintenancePlanRouter.post("/", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const plan = await MaintenancePlan.create(req.body);
    return res.status(201).json({ plan });
  } catch (error) {
    next(error);
  }
});

maintenancePlanRouter.put("/:id", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const plan = await MaintenancePlan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!plan) return res.status(404).json({ message: "Maintenance plan not found" });
    return res.json({ plan });
  } catch (error) {
    next(error);
  }
});

maintenancePlanRouter.delete("/:id", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const plan = await MaintenancePlan.findByIdAndDelete(req.params.id);
    if (!plan) return res.status(404).json({ message: "Maintenance plan not found" });
    return res.json({ message: "Maintenance plan deleted" });
  } catch (error) {
    next(error);
  }
});

subscriptionRouter.post("/", requireAuth, async (req, res, next) => {
  try {
    const {
      customerId,
      planId,
      plan,
      plantsCount,
      startDate = new Date(),
      renewalDate,
      notes = "",
    } = req.body;

    const planDoc = planId ? await MaintenancePlan.findById(planId) : null;
    if (planId && !planDoc) return res.status(404).json({ message: "Maintenance plan not found" });

    const start = new Date(startDate);
    const renewal = renewalDate ? new Date(renewalDate) : new Date(start);
    if (!renewalDate) renewal.setMonth(renewal.getMonth() + 6);

    const subscription = await Subscription.create({
      customerId: req.user.role === "admin" && customerId ? customerId : req.user.id,
      planId: planDoc?._id,
      plan: planDoc?.name || plan,
      plantsCount,
      startDate: start,
      renewalDate: renewal,
      notes,
      status: "Active",
    });

    await subscription.populate(subscriptionPopulate);
    return res.status(201).json({ subscription });
  } catch (error) {
    next(error);
  }
});

subscriptionRouter.get("/my", requireAuth, async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find({ customerId: req.user.id })
      .populate(subscriptionPopulate)
      .sort({ renewalDate: 1 });
    return res.json({ subscriptions });
  } catch (error) {
    next(error);
  }
});

subscriptionRouter.get("/", requireAuth, requireAdmin, async (_req, res, next) => {
  try {
    const subscriptions = await Subscription.find({})
      .populate(subscriptionPopulate)
      .sort({ renewalDate: 1 });
    return res.json({ subscriptions });
  } catch (error) {
    next(error);
  }
});

subscriptionRouter.patch("/:id/status", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const subscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status, notes: req.body.notes },
      { new: true, runValidators: true },
    ).populate(subscriptionPopulate);
    if (!subscription) return res.status(404).json({ message: "Subscription not found" });
    return res.json({ subscription });
  } catch (error) {
    next(error);
  }
});

subscriptionRouter.patch("/:id/renew", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const months = Number(req.body.months || 6);
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) return res.status(404).json({ message: "Subscription not found" });

    const renewal = new Date(subscription.renewalDate);
    renewal.setMonth(renewal.getMonth() + months);
    subscription.renewalDate = renewal;
    subscription.status = "Active";
    await subscription.save();
    await subscription.populate(subscriptionPopulate);

    return res.json({ subscription });
  } catch (error) {
    next(error);
  }
});
