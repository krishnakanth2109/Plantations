import { Router } from "express";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import Ticket from "../models/Ticket.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import { getIO } from "../config/socket.js";

const router = Router();
const ticketPopulate = { path: "customerId", select: "name email phone address" };

router.post("/", requireAuth, async (req, res, next) => {
  try {
    const { issue, photos = [] } = req.body;
    if (!issue) return res.status(400).json({ message: "Issue is required" });

    const ticket = await Ticket.create({
      customerId: req.user.id,
      issue,
      photos,
      status: "Open",
      createdAt: new Date(),
    });

    await ticket.populate(ticketPopulate);

    // Create notification for the customer
    const customerNotification = await Notification.create({
      userId: req.user.id,
      title: "Wellness ticket created",
      body: `Your wellness ticket for "${issue.slice(0, 40)}${issue.length > 40 ? "..." : ""}" has been received.`,
      type: "wellness",
      refId: ticket._id,
    });
    const io = getIO();
    if (io) io.to(req.user.id.toString()).emit("notification", customerNotification);

    // Notify superadmins about the new wellness ticket
    const superadmins = await User.find({ role: { $in: ["superadmin", "admin"] }, isActive: { $ne: false } }).select("_id");
    if (superadmins.length > 0) {
      const superadminNotifications = await Notification.insertMany(
        superadmins.map((superadmin) => ({
          userId: superadmin._id,
          title: "New wellness ticket",
          body: `${req.user.name || "A customer"} opened a wellness ticket: "${issue.slice(0, 40)}${issue.length > 40 ? "..." : ""}"`,
          type: "wellness",
          refId: ticket._id,
        }))
      );
      if (superadminNotifications.length > 0) {
        const io = getIO();
        if (io) io.to("superadmin").emit("notification", superadminNotifications[0]);
      }
    }

    return res.status(201).json({ ticket });
  } catch (error) {
    next(error);
  }
});

router.get("/my", requireAuth, async (req, res, next) => {
  try {
    const tickets = await Ticket.find({ customerId: req.user.id })
      .populate(ticketPopulate)
      .sort({ createdAt: -1 });
    return res.json({ tickets });
  } catch (error) {
    next(error);
  }
});

router.get("/", requireAuth, requireAdmin, async (_req, res, next) => {
  try {
    const tickets = await Ticket.find({}).populate(ticketPopulate).sort({ createdAt: -1 });
    return res.json({ tickets });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id/diagnose", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { diagnosis: req.body.diagnosis, status: "Diagnosed" },
      { new: true, runValidators: true },
    ).populate(ticketPopulate);
    if (!ticket) return res.status(404).json({ message: "Wellness ticket not found" });

    // Notify client about diagnosis
    if (ticket.customerId) {
      const customerId = typeof ticket.customerId === "object" ? ticket.customerId._id : ticket.customerId;
      const statusNotification = await Notification.create({
        userId: customerId,
        title: "Wellness ticket diagnosed",
        body: `Your wellness ticket has been diagnosed: "${req.body.diagnosis.slice(0, 50)}..."`,
        type: "wellness",
        refId: ticket._id,
      });
      const io = getIO();
      if (io) io.to(customerId.toString()).emit("notification", statusNotification);
    }

    return res.json({ ticket });
  } catch (error) {
    next(error);
  }
});

router.post("/:id/diagnose", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { diagnosis: req.body.diagnosis, status: "Diagnosed" },
      { new: true, runValidators: true },
    ).populate(ticketPopulate);
    if (!ticket) return res.status(404).json({ message: "Wellness ticket not found" });

    // Notify client about diagnosis
    if (ticket.customerId) {
      const customerId = typeof ticket.customerId === "object" ? ticket.customerId._id : ticket.customerId;
      const statusNotification = await Notification.create({
        userId: customerId,
        title: "Wellness ticket diagnosed",
        body: `Your wellness ticket has been diagnosed: "${req.body.diagnosis.slice(0, 50)}..."`,
        type: "wellness",
        refId: ticket._id,
      });
      const io = getIO();
      if (io) io.to(customerId.toString()).emit("notification", statusNotification);
    }

    return res.json({ ticket });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id/resolve", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { status: "Resolved", resolvedAt: new Date() },
      { new: true, runValidators: true },
    ).populate(ticketPopulate);
    if (!ticket) return res.status(404).json({ message: "Wellness ticket not found" });

    // Notify client about resolution
    if (ticket.customerId) {
      const customerId = typeof ticket.customerId === "object" ? ticket.customerId._id : ticket.customerId;
      const statusNotification = await Notification.create({
        userId: customerId,
        title: "Wellness ticket resolved",
        body: `Your wellness ticket has been marked as resolved.`,
        type: "wellness",
        refId: ticket._id,
      });
      const io = getIO();
      if (io) io.to(customerId.toString()).emit("notification", statusNotification);
    }

    return res.json({ ticket });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Wellness ticket not found" });

    if (ticket.customerId.toString() !== req.user.id && req.user.role !== "superadmin") {
      return res.status(403).json({ message: "Unauthorized to delete this ticket" });
    }

    await Ticket.findByIdAndDelete(req.params.id);
    return res.json({ ok: true, message: "Ticket deleted successfully" });
  } catch (error) {
    next(error);
  }
});

export default router;
