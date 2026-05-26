import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import Service from "../models/Service.js";
import WishlistItem from "../models/WishlistItem.js";

const router = Router();

router.get("/", requireAuth, async (req, res, next) => {
  try {
    const items = await WishlistItem.find({ customerId: req.user.id })
      .populate({ path: "serviceId", select: "title slug category description imageUrl priceNote" })
      .sort({ createdAt: -1 });
    return res.json({ items });
  } catch (error) {
    next(error);
  }
});

router.post("/", requireAuth, async (req, res, next) => {
  try {
    const { serviceId } = req.body;
    if (!serviceId) return res.status(400).json({ message: "serviceId is required" });

    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json({ message: "Service not found" });

    const item = await WishlistItem.findOneAndUpdate(
      { customerId: req.user.id, serviceId: service._id },
      { serviceTitle: service.title },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    ).populate({ path: "serviceId", select: "title slug category description imageUrl priceNote" });

    return res.status(201).json({ item });
  } catch (error) {
    next(error);
  }
});

router.delete("/:serviceId", requireAuth, async (req, res, next) => {
  try {
    await WishlistItem.deleteOne({ customerId: req.user.id, serviceId: req.params.serviceId });
    return res.json({ message: "Wishlist item removed" });
  } catch (error) {
    next(error);
  }
});

export default router;
