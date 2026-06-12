"use client";

import { useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const s = io({
      path: "/api/socketio",
      addTrailingSlash: false,
      transports: ["websocket", "polling"],
    });

    setSocket(s);
    s.on("connect", () => setConnected(true));
    s.on("disconnect", () => setConnected(false));

    return () => {
      s.disconnect();
      setSocket(null);
    };
  }, []);

  return { socket, connected };
}
