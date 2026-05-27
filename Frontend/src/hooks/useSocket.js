import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { getToken } from "../lib/auth";
import { baseURL } from "../api";
import { toast } from "sonner";

// Extract base URL without the /api suffix (if it exists)
const socketURL = baseURL.replace(/\/api\/?$/, "");

let globalSocket = null;
const listeners = new Set();

export function useSocket(onNotificationReceived) {
  const [connected, setConnected] = useState(false);
  const callbackRef = useRef(onNotificationReceived);

  useEffect(() => {
    callbackRef.current = onNotificationReceived;
  }, [onNotificationReceived]);

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    if (!globalSocket) {
      globalSocket = io(socketURL, {
        auth: { token },
        query: { token },
        transports: ["websocket", "polling"],
      });

      globalSocket.on("connect", () => {
        console.log("WebSocket connected");
      });

      globalSocket.on("disconnect", () => {
        console.log("WebSocket disconnected");
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
    }

    setConnected(globalSocket.connected);

    const handleConnect = () => setConnected(true);
    const handleDisconnect = () => setConnected(false);
    
    globalSocket.on("connect", handleConnect);
    globalSocket.on("disconnect", handleDisconnect);

    const localListener = (notif) => {
      if (callbackRef.current) {
        callbackRef.current(notif);
      }
    };
    listeners.add(localListener);

    return () => {
      if (globalSocket) {
        globalSocket.off("connect", handleConnect);
        globalSocket.off("disconnect", handleDisconnect);
      }
      listeners.delete(localListener);
      
      // If no listeners are active, we can optionally close socket or keep it alive globally.
      // Keeping it globally alive is better for continuous background notification delivery.
    };
  }, []);

  return { socket: globalSocket, connected };
}
