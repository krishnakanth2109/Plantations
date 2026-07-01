import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import libraryRoutes from "./routes/libraryRoutes.js";
import leadRoutes from "./routes/leadRoutes.js";
import { maintenancePlanRouter, subscriptionRouter } from "./routes/maintenanceRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import seedRoutes from "./routes/seedRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import wellnessRoutes from "./routes/wellnessRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import cmsRoutes from "./routes/cmsRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";
import superadminRoutes from "./routes/superadminRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173,https://plantation-yogini.netlify.app,https://plantations.onrender.com")
  .replace(/['"]/g, "")
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

console.log("Allowed Origins:", allowedOrigins);


app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "yogini-planters-api" });
});

app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/maintenance-plans", maintenancePlanRouter);
app.use("/api/subscriptions", subscriptionRouter);
app.use("/api/payments", paymentRoutes);
app.use("/api/wellness-tickets", wellnessRoutes);
app.use("/api/library", libraryRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/seed", seedRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/cms", cmsRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/superadmin/admins", superadminRoutes);

app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(error.status || 500).json({
    message: error.message || "Internal server error",
    ...(error.code ? { code: error.code } : {}),
  });
});

import { createServer } from "http";
import { initSocket } from "./config/socket.js";

connectDB()
  .then(() => {
    const httpServer = createServer(app);
    initSocket(httpServer, allowedOrigins);
    
    httpServer.listen(port, () => {
      console.log(`API server listening on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start API server:", error.message);
    process.exit(1);
  });
