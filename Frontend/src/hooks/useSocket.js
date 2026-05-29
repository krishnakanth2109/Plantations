import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { getToken } from "../lib/auth";
import { baseURL } from "../api";
import { toast } from "sonner";

// Extract base URL without the /api suffix (if it exists)
const socketURL = baseURL.replace(/\/api\/?$/, "");

let globalSocket = null;
const listeners = new Set();
const connectionListeners = new Set();

function getOrCreateSocket(token) {
  if (!token) {
    disconnectSocket();
    return null;
  }

  if (globalSocket) {
    if (globalSocket.token === token) {
      return globalSocket;
    }
    // Token changed, disconnect old one
    disconnectSocket();
  }

  globalSocket = io(socketURL, {
    auth: { token },
    query: { token },
    transports: ["websocket", "polling"],
  });
  globalSocket.token = token;

  globalSocket.on("connect", () => {
    console.log("WebSocket connected");
    connectionListeners.forEach((listener) => listener(true));
  });

  globalSocket.on("disconnect", () => {
    console.log("WebSocket disconnected");
    connectionListeners.forEach((listener) => listener(false));
  });

  globalSocket.on("notification", (notif) => {
    console.log("WebSocket notification received:", notif);
    toast.info(notif.title, {
      description: notif.body,
      action: {
        label: "View",
        onClick: () => {
          window.location.href = notif.type === "booking" ? "/dashboard/bookings" : "/dashboard/notifications";
        },
      },
    });
    
    // Notify all active listeners
    listeners.forEach((listener) => listener(notif));
  });

  return globalSocket;
}

function disconnectSocket() {
  if (globalSocket) {
    globalSocket.disconnect();
    globalSocket = null;
  }
}

export function useSocket(onNotificationReceived) {
  const [connected, setConnected] = useState(false);
  const callbackRef = useRef(onNotificationReceived);

  useEffect(() => {
    callbackRef.current = onNotificationReceived;
  }, [onNotificationReceived]);

  useEffect(() => {
    const handleConnectionChange = (isConnected) => {
      setConnected(isConnected);
    };
    connectionListeners.add(handleConnectionChange);

    const syncSocket = () => {
      const token = getToken();
      const socket = getOrCreateSocket(token);
      if (socket) {
        setConnected(socket.connected);
      } else {
        setConnected(false);
      }
    };

    // Sync on mount
    syncSocket();

    window.addEventListener("yp-auth-change", syncSocket);
    window.addEventListener("storage", syncSocket);

    const localListener = (notif) => {
      if (callbackRef.current) {
        callbackRef.current(notif);
      }
    };
    listeners.add(localListener);

    return () => {
      connectionListeners.delete(handleConnectionChange);
      window.removeEventListener("yp-auth-change", syncSocket);
      window.removeEventListener("storage", syncSocket);
      listeners.delete(localListener);
    };
  }, []);

  return { socket: globalSocket, connected };
}

