import { Router } from "express";
import { login, me, register, forgotPassword } from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.get("/me", requireAuth, me);

export default router;



