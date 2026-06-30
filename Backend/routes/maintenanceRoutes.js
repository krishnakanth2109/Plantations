import { Router } from "express";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import MaintenancePlan from "../models/MaintenancePlan.js";
import Subscription from "../models/Subscription.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

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

    const targetCustomerId = req.user.role === "superadmin" && customerId ? customerId : req.user.id;
    
    // Find if there is an existing active or pending subscription for this customer
    const existingSubscription = await Subscription.findOne({ 
      customerId: targetCustomerId,
      status: { $in: ["Active", "Pending"] }
    });

    const start = new Date(startDate);
    const renewal = renewalDate ? new Date(renewalDate) : new Date(start);
    if (!renewalDate) renewal.setMonth(renewal.getMonth() + 6);

    // If there is an existing subscription and the customer is trying to select a DIFFERENT plan,
    // we create a pending upgrade request instead of direct switching!
    if (existingSubscription) {
      const planName = planDoc?.name || plan;
      
      if (existingSubscription.plan !== planName) {
        // Create an upgrade/change request!
        existingSubscription.pendingUpgradePlanId = planDoc?._id;
        existingSubscription.pendingUpgradePlanName = planName;
        existingSubscription.pendingUpgradePlantsCount = plantsCount;
        existingSubscription.upgradeRequestStatus = "Pending";
        
        await existingSubscription.save();
        await existingSubscription.populate(subscriptionPopulate);

        // Notify superadmins about the upgrade/change request
        const user = await User.findById(targetCustomerId);
        const superadmins = await User.find({ role: { $in: ["superadmin", "admin"] }, isActive: { $ne: false } }).select("_id");
        const isUpgrade = planName === "Fully Customized";
        const actionVerb = isUpgrade ? "upgrade" : "change";
        const requestTitle = isUpgrade ? "Plan Upgrade Requested" : "Plan Change Requested";
        if (superadmins.length > 0) {
          const superadminNotifications = await Notification.insertMany(
            superadmins.map((superadmin) => ({
              userId: superadmin._id,
              title: requestTitle,
              body: `${user?.name || "A customer"} requested to ${actionVerb} from the ${existingSubscription.plan} Plan to the ${planName} Plan.`,
              type: "subscription",
              refId: existingSubscription._id,
            }))
          );
          if (superadminNotifications.length > 0) {
            const { getIO } = await import("../config/socket.js");
            const io = getIO();
            if (io) io.to("superadmin").emit("notification", superadminNotifications[0]);
          }
        }

        return res.status(200).json({ subscription: existingSubscription, upgradeRequested: true });
      } else {
        // Re-booking/renewing same plan directly
        existingSubscription.plantsCount = plantsCount;
        existingSubscription.startDate = start;
        existingSubscription.renewalDate = renewal;
        existingSubscription.notes = notes || existingSubscription.notes;
        existingSubscription.status = "Active";

        await existingSubscription.save();
        await existingSubscription.populate(subscriptionPopulate);
        return res.status(200).json({ subscription: existingSubscription });
      }
    }

    const subscription = await Subscription.create({
      customerId: targetCustomerId,
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

subscriptionRouter.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) return res.status(404).json({ message: "Subscription not found" });

    if (subscription.customerId.toString() !== req.user.id && req.user.role !== "superadmin") {
      return res.status(403).json({ message: "Unauthorized to delete this subscription" });
    }

    await Subscription.findByIdAndDelete(req.params.id);
    return res.json({ ok: true, message: "Subscription deleted successfully" });
  } catch (error) {
    next(error);
  }
});

subscriptionRouter.patch("/:id/upgrade-resolve", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { action } = req.body; // "approve" or "reject"
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) return res.status(404).json({ message: "Subscription not found" });

    if (subscription.upgradeRequestStatus !== "Pending") {
      return res.status(400).json({ message: "No pending upgrade request found" });
    }

    const { getIO } = await import("../config/socket.js");
    const Notification = (await import("../models/Notification.js")).default;

    if (action === "approve") {
      const targetPlanName = subscription.pendingUpgradePlanName || "new";
      const isUpgrade = targetPlanName === "Fully Customized";

      subscription.planId = subscription.pendingUpgradePlanId;
      subscription.plan = subscription.pendingUpgradePlanName;
      if (subscription.pendingUpgradePlantsCount) {
        subscription.plantsCount = subscription.pendingUpgradePlantsCount;
      }
      subscription.upgradeRequestStatus = "Approved";

      // Notify customer
      const clientNotif = await Notification.create({
        userId: subscription.customerId,
        title: isUpgrade ? "Upgrade Approved!" : "Plan Change Approved!",
        body: isUpgrade 
          ? `Your request to upgrade to the ${subscription.plan} Plan has been approved.`
          : `Your request to change to the ${subscription.plan} Plan has been approved.`,
        type: "subscription",
        refId: subscription._id,
      });
      const io = getIO();
      if (io) io.to(subscription.customerId.toString()).emit("notification", clientNotif);
    } else {
      const targetPlanName = subscription.pendingUpgradePlanName || "new";
      const isUpgrade = targetPlanName === "Fully Customized";

      subscription.upgradeRequestStatus = "Rejected";

      // Notify customer
      const clientNotif = await Notification.create({
        userId: subscription.customerId,
        title: isUpgrade ? "Upgrade Declined" : "Plan Change Declined",
        body: isUpgrade
          ? `Your request to upgrade to the ${targetPlanName} Plan was declined.`
          : `Your request to change to the ${targetPlanName} Plan was declined.`,
        type: "subscription",
        refId: subscription._id,
      });
      const io = getIO();
      if (io) io.to(subscription.customerId.toString()).emit("notification", clientNotif);
    }

    // Reset pending upgrade fields
    subscription.pendingUpgradePlanId = null;
    subscription.pendingUpgradePlanName = null;
    subscription.pendingUpgradePlantsCount = null;
    subscription.upgradeRequestStatus = "None";

    await subscription.save();
    await subscription.populate(subscriptionPopulate);
    return res.json({ subscription });
  } catch (error) {
    next(error);
  }
});

