import { Router } from "express";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import Ticket from "../models/Ticket.js";

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
    return res.json({ ticket });
  } catch (error) {
    next(error);
  }
});

export default router;
