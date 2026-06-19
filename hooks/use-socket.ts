"use client";

import { useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Socket.io nécessite server.mjs (local) — indisponible sur Vercel serverless
    if (process.env.NEXT_PUBLIC_VERCEL === "1") return;

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
