import { firebaseAdmin } from "../config/firebase.js";
import User from "../models/User.js";

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization ?? "";
    const [scheme, token] = header.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ message: "Firebase ID token is required" });
    }

    const decoded = await firebaseAdmin.auth().verifyIdToken(token);
    const email = decoded.email?.toLowerCase();
    const user = await User.findOne({
      $or: [
        { firebaseUid: decoded.uid },
        ...(email ? [{ email }] : []),
      ],
    });

    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    if (!user.firebaseUid) {
      user.firebaseUid = decoded.uid;
      await user.save();
    }

    req.user = {
      id: user._id.toString(),
      firebaseUid: decoded.uid,
      role: user.role,
      email: user.email,
    };
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired Firebase token" });
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
}
