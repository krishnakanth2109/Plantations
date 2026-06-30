import { Router } from "express";
import { firebaseAdmin } from "../config/firebase.js";
import User from "../models/User.js";
import { requireAuth, requireSuperadmin } from "../middleware/auth.js";

const router = Router();

// Apply superadmin protections to all routes in this router
router.use(requireAuth, requireSuperadmin);

// GET /api/superadmin/admins - List all admins
router.get("/", async (req, res, next) => {
  try {
    const admins = await User.find({ role: "admin" }).sort({ createdAt: -1 });
    return res.json({ admins: admins.map((u) => u.toAuthJSON()) });
  } catch (error) {
    next(error);
  }
});

// POST /api/superadmin/admins - Create a new admin user
router.post("/", async (req, res, next) => {
  try {
    const { name, email, password, phone = "", address = "" } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ message: "An account already exists for this email" });
    }

    let firebaseUser;
    try {
      firebaseUser = await firebaseAdmin.auth().createUser({
        email: normalizedEmail,
        password,
        displayName: name,
      });
    } catch (error) {
      if (error.code === "auth/email-already-exists") {
        firebaseUser = await firebaseAdmin.auth().getUserByEmail(normalizedEmail);
      } else {
        throw error;
      }
    }

    const newAdmin = await User.create({
      firebaseUid: firebaseUser.uid,
      name,
      email: normalizedEmail,
      phone,
      address,
      role: "admin",
      isActive: true,
    });

    return res.status(201).json({ user: newAdmin.toAuthJSON() });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/superadmin/admins/:id/status - Toggle active/deactive status of an admin
router.patch("/:id/status", async (req, res, next) => {
  try {
    const { isActive } = req.body;
    if (typeof isActive !== "boolean") {
      return res.status(400).json({ message: "isActive status must be a boolean" });
    }

    const adminUser = await User.findById(req.params.id);
    if (!adminUser) {
      return res.status(404).json({ message: "Admin user not found" });
    }

    if (adminUser.role !== "admin") {
      return res.status(400).json({ message: "Only admin accounts can be deactivated/activated via this endpoint" });
    }

    adminUser.isActive = isActive;
    await adminUser.save();

    if (adminUser.firebaseUid) {
      try {
        await firebaseAdmin.auth().updateUser(adminUser.firebaseUid, {
          disabled: !isActive,
        });
      } catch (err) {
        console.error("Failed to sync disabled state to Firebase Auth:", err.message);
        return res.status(500).json({ message: "Failed to update authentication status: " + err.message });
      }
    }

    return res.json({ user: adminUser.toAuthJSON() });
  } catch (error) {
    next(error);
  }
});

// PUT /api/superadmin/admins/:id - Update admin name/password
router.put("/:id", async (req, res, next) => {
  try {
    const { name, password } = req.body;

    const adminUser = await User.findById(req.params.id);
    if (!adminUser) {
      return res.status(404).json({ message: "Admin user not found" });
    }

    if (adminUser.role !== "admin") {
      return res.status(400).json({ message: "Only admin accounts can be modified via this endpoint" });
    }

    const firebaseUpdates = {};
    if (name) firebaseUpdates.displayName = name;
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }
      firebaseUpdates.password = password;
    }

    if (adminUser.firebaseUid && Object.keys(firebaseUpdates).length > 0) {
      try {
        await firebaseAdmin.auth().updateUser(adminUser.firebaseUid, firebaseUpdates);
      } catch (err) {
        console.error("Failed to update Firebase user data:", err.message);
        return res.status(500).json({ message: "Failed to update authentication account: " + err.message });
      }
    }

    if (name) {
      adminUser.name = name;
      await adminUser.save();
    }

    return res.json({ user: adminUser.toAuthJSON() });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/superadmin/admins/:id - Delete an admin user account
router.delete("/:id", async (req, res, next) => {
  try {
    const adminUser = await User.findById(req.params.id);
    if (!adminUser) {
      return res.status(404).json({ message: "Admin user not found" });
    }

    if (adminUser.role !== "admin") {
      return res.status(400).json({ message: "Only admin accounts can be deleted via this endpoint" });
    }

    if (adminUser.firebaseUid) {
      try {
        await firebaseAdmin.auth().deleteUser(adminUser.firebaseUid);
      } catch (err) {
        if (err.code !== "auth/user-not-found") {
          console.error("Failed to delete user from Firebase Auth:", err.message);
          return res.status(500).json({ message: "Failed to delete authentication account: " + err.message });
        }
      }
    }

    await User.findByIdAndDelete(req.params.id);
    return res.json({ message: "Admin account deleted successfully" });
  } catch (error) {
    next(error);
  }
});

export default router;
