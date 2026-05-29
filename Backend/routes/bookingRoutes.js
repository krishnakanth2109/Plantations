import { Router } from "express";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import Booking from "../models/Booking.js";
import Notification from "../models/Notification.js";
import Service from "../models/Service.js";
import User from "../models/User.js";
import { getIO } from "../config/socket.js";

const router = Router();
const bookingPopulate = [
  { path: "customerId", select: "name email phone address" },
  { path: "serviceId", select: "title slug category imageUrl" },
];

router.post("/", requireAuth, async (req, res, next) => {
  try {
    const { serviceId, serviceType, date, address, notes = "", amount = 0 } = req.body;
    if (!date || !address || (!serviceId && !serviceType)) {
      return res.status(400).json({ message: "Service, date, and address are required" });
    }

    const service = serviceId ? await Service.findById(serviceId) : null;
    if (serviceId && !service) return res.status(404).json({ message: "Service not found" });

    const booking = await Booking.create({
      customerId: req.user.id,
      serviceId: service?._id,
      serviceType: service?.title || serviceType,
      date,
      address,
      notes,
      amount,
      status: "Pending",
    });

    await booking.populate(bookingPopulate);

    // Create notification for the customer
    const customerNotification = await Notification.create({
      userId: req.user.id,
      title: "Booking requested",
      body: `Your booking for ${booking.serviceType} on ${new Date(booking.date).toLocaleDateString("en-IN")} has been submitted. We'll confirm within 24 hours.`,
      type: "booking",
      refId: booking._id,
    });
    const io = getIO();
    if (io) io.to(req.user.id.toString()).emit("notification", customerNotification);

    // Also notify all admins about the new booking
    const admins = await User.find({ role: "admin" }).select("_id");
    if (admins.length > 0) {
      const adminNotifications = await Notification.insertMany(
        admins.map((admin) => ({
          userId: admin._id,
          title: "New booking received",
          body: `${req.user.name || "A customer"} booked ${booking.serviceType} for ${new Date(booking.date).toLocaleDateString("en-IN")}.`,
          type: "booking",
          refId: booking._id,
        }))
      );
      // Send real-time notification to the admin room (take first one as representative or just emit a generic event)
      if (adminNotifications.length > 0) {
        const io = getIO();
        if (io) io.to("admin").emit("notification", adminNotifications[0]);
      }
    }

    return res.status(201).json({ booking });
  } catch (error) {
    next(error);
  }
});

router.get("/my", requireAuth, async (req, res, next) => {
  try {
    const bookings = await Booking.find({ customerId: req.user.id })
      .populate(bookingPopulate)
      .sort({ date: -1 });
    return res.json({ bookings });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id/cancel", requireAuth, async (req, res, next) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, customerId: req.user.id, status: { $nin: ["Completed", "Cancelled"] } },
      { status: "Cancelled", cancelReason: req.body.cancelReason || "" },
      { new: true, runValidators: true },
    ).populate(bookingPopulate);

    if (!booking) return res.status(404).json({ message: "Cancelable booking not found" });

    // Notify customer about cancellation
    const customerNotification = await Notification.create({
      userId: req.user.id,
      title: "Booking cancelled",
      body: `Your booking for ${booking.serviceType} has been cancelled.`,
      type: "booking",
      refId: booking._id,
    });
    const io = getIO();
    if (io) io.to(req.user.id.toString()).emit("notification", customerNotification);

    // Notify admins about the cancellation
    const admins = await User.find({ role: "admin" }).select("_id");
    if (admins.length > 0) {
      const adminNotifications = await Notification.insertMany(
        admins.map((admin) => ({
          userId: admin._id,
          title: "Booking cancelled by customer",
          body: `${req.user.name || "A customer"} cancelled their ${booking.serviceType} booking.`,
          type: "booking",
          refId: booking._id,
        }))
      );
      if (adminNotifications.length > 0) {
        const io = getIO();
        if (io) io.to("admin").emit("notification", adminNotifications[0]);
      }
    }

    return res.json({ booking });
  } catch (error) {
    next(error);
  }
});

router.get("/", requireAuth, requireAdmin, async (_req, res, next) => {
  try {
    const bookings = await Booking.find({}).populate(bookingPopulate).sort({ date: -1 });
    return res.json({ bookings });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id/status", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { status, amount } = req.body;
    const update = { status };
    if (amount !== undefined) update.amount = amount;

    const booking = await Booking.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    }).populate(bookingPopulate);

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Notify the customer about the status change
    if (booking.customerId) {
      const customerId = typeof booking.customerId === "object" ? booking.customerId._id : booking.customerId;
      const statusNotification = await Notification.create({
        userId: customerId,
        title: `Booking ${status.toLowerCase()}`,
        body: `Your booking for ${booking.serviceType} has been updated to "${status}".`,
        type: "booking",
        refId: booking._id,
      });
      const io = getIO();
      if (io) io.to(customerId.toString()).emit("notification", statusNotification);
    }

    return res.json({ booking });
  } catch (error) {
    next(error);
  }
});

export default router;
