import { Router } from "express";
import { requireAuth, requireSuperadmin } from "../middleware/auth.js";
import Inventory from "../models/Inventory.js";

const router = Router();

// Get all inventory items (public, no auth required to view)
router.get("/", async (req, res, next) => {
  try {
    const items = await Inventory.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    next(error);
  }
});

// Create new inventory item (auth + superadmin required)
router.post("/", requireAuth, requireSuperadmin, async (req, res, next) => {
  try {
    const newItem = new Inventory(req.body);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    next(error);
  }
});

// Update inventory item (auth + superadmin required)
router.put("/:id", requireAuth, requireSuperadmin, async (req, res, next) => {
  try {
    const updatedItem = await Inventory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json(updatedItem);
  } catch (error) {
    next(error);
  }
});

// Delete inventory item (auth + superadmin required)
router.delete("/:id", requireAuth, requireSuperadmin, async (req, res, next) => {
  try {
    const deletedItem = await Inventory.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    next(error);
  }
});

export default router;
