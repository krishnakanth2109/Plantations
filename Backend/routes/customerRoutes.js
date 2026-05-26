import { Router } from "express";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import User from "../models/User.js";
import { firebaseAdmin } from "../config/firebase.js";

const router = Router();

// Require admin for all customer management endpoints
router.use(requireAuth, requireAdmin);

// 1. Get all customers
router.get("/", async (req, res, next) => {
  try {
    const customers = await User.find({ role: "customer" }).sort({ createdAt: -1 });
    res.json(customers.map(c => c.toAuthJSON()));
  } catch (error) {
    next(error);
  }
});

// 2. Create customer
router.post("/", async (req, res, next) => {
  try {
    const { name, email, phone = "", address = "", tag = "Homeowner" } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ message: "A user with this email already exists" });
    }

    // Create a placeholder user in Firebase Auth with a random password
    let firebaseUser;
    const randomPassword = Math.random().toString(36).slice(-10);
    try {
      firebaseUser = await firebaseAdmin.auth().createUser({
        email: normalizedEmail,
        password: randomPassword,
        displayName: name,
      });
    } catch (error) {
      if (error.code === "auth/email-already-exists") {
        firebaseUser = await firebaseAdmin.auth().getUserByEmail(normalizedEmail);
      } else {
        throw error;
      }
    }

    const customer = await User.create({
      firebaseUid: firebaseUser.uid,
      name,
      email: normalizedEmail,
      phone,
      address,
      tag,
      role: "customer",
    });

    res.status(201).json(customer.toAuthJSON());
  } catch (error) {
    next(error);
  }
});

// 3. Update customer
router.put("/:id", async (req, res, next) => {
  try {
    const { name, email, phone, address, tag } = req.body;
    const customer = await User.findById(req.params.id);
    if (!customer || customer.role !== "customer") {
      return res.status(404).json({ message: "Customer not found" });
    }

    if (email) {
      const normalizedEmail = email.trim().toLowerCase();
      if (normalizedEmail !== customer.email) {
        const existing = await User.findOne({ email: normalizedEmail });
        if (existing) {
          return res.status(409).json({ message: "Email already in use" });
        }
        
        if (customer.firebaseUid) {
          await firebaseAdmin.auth().updateUser(customer.firebaseUid, {
            email: normalizedEmail,
          });
        }
        customer.email = normalizedEmail;
      }
    }

    if (name) {
      customer.name = name;
      if (customer.firebaseUid) {
        await firebaseAdmin.auth().updateUser(customer.firebaseUid, {
          displayName: name,
        });
      }
    }
    
    if (phone !== undefined) customer.phone = phone;
    if (address !== undefined) customer.address = address;
    if (tag !== undefined) customer.tag = tag;

    await customer.save();
    res.json(customer.toAuthJSON());
  } catch (error) {
    next(error);
  }
});

// 4. Delete customer
router.delete("/:id", async (req, res, next) => {
  try {
    const customer = await User.findById(req.params.id);
    if (!customer || customer.role !== "customer") {
      return res.status(404).json({ message: "Customer not found" });
    }

    if (customer.firebaseUid) {
      try {
        await firebaseAdmin.auth().deleteUser(customer.firebaseUid);
      } catch (err) {
        console.error("Failed to delete firebase user:", err);
      }
    }

    await User.deleteOne({ _id: req.params.id });
    res.json({ message: "Customer deleted successfully" });
  } catch (error) {
    next(error);
  }
});

export default router;
