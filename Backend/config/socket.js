// Real-time socket configuration for backend
import { Server } from "socket.io";
import { firebaseAdmin } from "./firebase.js";
import User from "../models/User.js";

let io = null;

export const initSocket = (server, allowedOrigins) => {
  io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  });

  io.on("connection", async (socket) => {
    // Authenticate socket using firebase token from query or auth headers
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    
    if (token) {
      try {
        const decoded = await firebaseAdmin.auth().verifySessionCookie(token);
        const email = decoded.email?.toLowerCase();
        const user = await User.findOne({
          $or: [
            { firebaseUid: decoded.uid },
            ...(email ? [{ email }] : []),
          ],
        });

        if (user) {
          const userId = user._id.toString();
          const role = user.role;

          // Join user's personal room
          socket.join(userId);
          
          // If user is admin, join admin room
          if (role === "admin") {
            socket.join("admin");
          }

          console.log(`Socket connected: User ${userId} (${role}) joined rooms: ${[...socket.rooms]}`);
        } else {
          console.error("Socket connected but user not found in database");
        }
      } catch (err) {
        console.error("Socket Firebase authentication failed:", err.message);
      }
    } else {
      console.log("Socket connected without authentication");
    }

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  return io;
};
