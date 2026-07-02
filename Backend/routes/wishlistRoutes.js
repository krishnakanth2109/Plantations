import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import Service from "../models/Service.js";
import Inventory from "../models/Inventory.js";
import WishlistItem from "../models/WishlistItem.js";

const router = Router();

router.get("/", requireAuth, async (req, res, next) => {
  try {
    const items = await WishlistItem.find({ customerId: req.user.id })
      .populate({ path: "serviceId", select: "title slug category description imageUrl priceNote" })
      .populate({ path: "productId", select: "name category description image price stock" })
      .sort({ createdAt: -1 });
    return res.json({ items });
  } catch (error) {
    next(error);
  }
});

router.post("/", requireAuth, async (req, res, next) => {
  try {
    const { serviceId, productId } = req.body;
    if (!serviceId && !productId) return res.status(400).json({ message: "serviceId or productId is required" });

    if (serviceId) {
      const service = await Service.findById(serviceId);
      if (!service) return res.status(404).json({ message: "Service not found" });

      const item = await WishlistItem.findOneAndUpdate(
        { customerId: req.user.id, serviceId: service._id },
        { serviceTitle: service.title },
        { new: true, upsert: true, setDefaultsOnInsert: true },
      ).populate({ path: "serviceId", select: "title slug category description imageUrl priceNote" });

      return res.status(201).json({ item });
    } else if (productId) {
      const product = await Inventory.findById(productId);
      if (!product) return res.status(404).json({ message: "Product not found" });

      const item = await WishlistItem.findOneAndUpdate(
        { customerId: req.user.id, productId: product._id },
        { productTitle: product.name },
        { new: true, upsert: true, setDefaultsOnInsert: true },
      ).populate({ path: "productId", select: "name category description image price stock" });

      return res.status(201).json({ item });
    }
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const id = req.params.id;
    await WishlistItem.deleteOne({ customerId: req.user.id, $or: [{ serviceId: id }, { productId: id }] });
    return res.json({ message: "Wishlist item removed" });
  } catch (error) {
    next(error);
  }
});

export default router;
