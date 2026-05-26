import { Router } from "express";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import Booking from "../models/Booking.js";
import Service from "../models/Service.js";

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
    return res.json({ booking });
  } catch (error) {
    next(error);
  }
});

export default router;
