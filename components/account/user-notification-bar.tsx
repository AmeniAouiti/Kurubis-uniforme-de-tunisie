"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, X } from "lucide-react";
import { useSocket } from "@/hooks/use-socket";
import { useAuth } from "@/contexts/auth-context";
import type { UserNotificationPayload } from "@/lib/socket/io";

export function UserNotificationBar() {
  const { socket } = useSocket();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [notification, setNotification] = useState<UserNotificationPayload | null>(null);

  useEffect(() => {
    if (!socket || !isAuthenticated || isAdmin || !user?.id) return;

    socket.emit("join-user", { userId: user.id });

    const onNotif = (payload: UserNotificationPayload) => setNotification(payload);

    const onAdminMsg = (payload: { sender: string; body: string; conversationId: string }) => {
      if (payload.sender !== "admin") return;
      setNotification({
        id: `reply-${payload.conversationId}-${Date.now()}`,
        type: "reply",
        title: "Réponse de Kurubis uniforme",
        body: payload.body.slice(0, 140) + (payload.body.length > 140 ? "…" : ""),
        href: `/compte/conversations?c=${payload.conversationId}`,
        createdAt: new Date().toISOString(),
      });
    };

    socket.on("user:notification", onNotif);
    socket.on("message:new", onAdminMsg);

    return () => {
      socket.off("user:notification", onNotif);
      socket.off("message:new", onAdminMsg);
    };
  }, [socket, isAuthenticated, isAdmin, user?.id]);

  if (!notification) return null;

  return (
    <div className="border-b border-google-blue/20 bg-google-blue-50">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-3">
        <Bell className="h-5 w-5 text-google-blue shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-google-blue-dark">{notification.title}</p>
          <p className="text-xs text-muted truncate">{notification.body}</p>
        </div>
        <Link
          href={notification.href}
          className="shrink-0 rounded-full bg-google-blue px-4 py-1.5 text-xs font-semibold text-white hover:bg-google-blue-dark"
        >
          Lire
        </Link>
        <button
          type="button"
          onClick={() => setNotification(null)}
          className="text-muted hover:text-foreground"
          aria-label="Fermer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
