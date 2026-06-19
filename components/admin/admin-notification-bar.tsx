"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Bell, FileText, MessageSquare, X } from "lucide-react";
import { useSocket } from "@/hooks/use-socket";
import { useAuth } from "@/contexts/auth-context";
import type { AdminNotificationPayload } from "@/lib/socket/io";
import { cn } from "@/lib/utils";

export function AdminNotificationBar() {
  const { socket } = useSocket();
  const { isAdmin } = useAuth();
  const [notifications, setNotifications] = useState<AdminNotificationPayload[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const addNotification = useCallback((n: AdminNotificationPayload) => {
    setNotifications((prev) => [n, ...prev.filter((x) => x.id !== n.id)].slice(0, 5));
  }, []);

  useEffect(() => {
    if (!socket || !isAdmin) return;
    socket.emit("join-admin");

    const onAdminNotif = (payload: AdminNotificationPayload) => addNotification(payload);

    const onNewConv = (payload: { conversationId?: string; clientName?: string }) => {
      addNotification({
        id: `conv-${payload.conversationId}-${Date.now()}`,
        type: "devis",
        title: "Nouvelle demande de devis",
        body: payload.clientName
          ? `${payload.clientName} a envoyé une demande depuis son espace client`
          : "Un client a envoyé une nouvelle demande de devis",
        href: "/admin/devis",
        clientName: payload.clientName || "Client",
        createdAt: new Date().toISOString(),
      });
    };

    const onNewMsg = (payload: {
      conversationId: string;
      sender: string;
      body: string;
      clientName?: string;
    }) => {
      if (payload.sender !== "client") return;
      addNotification({
        id: `msg-${payload.conversationId}-${Date.now()}`,
        type: "message",
        title: "Nouveau message client",
        body: payload.body.slice(0, 120) + (payload.body.length > 120 ? "…" : ""),
        href: "/admin/messagerie",
        clientName: payload.clientName || "Client",
        createdAt: new Date().toISOString(),
      });
    };

    socket.on("admin:notification", onAdminNotif);
    socket.on("conversation:new", onNewConv);
    socket.on("message:new", onNewMsg);

    return () => {
      socket.off("admin:notification", onAdminNotif);
      socket.off("conversation:new", onNewConv);
      socket.off("message:new", onNewMsg);
    };
  }, [socket, isAdmin, addNotification]);

  const visible = notifications.filter((n) => !dismissed.has(n.id));
  const latest = visible[0];

  if (!isAdmin || !latest) return null;

  return (
    <div className="border-b border-google-blue/20 bg-gradient-to-r from-google-blue to-google-blue-600 text-white">
      <div className="mx-auto max-w-[1400px] px-4 py-3 lg:px-8 flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 animate-pulse">
          <Bell className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold flex items-center gap-2">
            {latest.type === "devis" ? (
              <FileText className="h-4 w-4 shrink-0" />
            ) : (
              <MessageSquare className="h-4 w-4 shrink-0" />
            )}
            {latest.title}
            {visible.length > 1 && (
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">
                +{visible.length - 1}
              </span>
            )}
          </p>
          <p className="text-xs text-white/85 truncate">{latest.body}</p>
        </div>
        <Link
          href={latest.href}
          className="shrink-0 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-google-blue hover:bg-white/90 transition-colors"
        >
          Voir
        </Link>
        <button
          type="button"
          onClick={() => setDismissed((s) => new Set(s).add(latest.id))}
          className="shrink-0 rounded-full p-1 hover:bg-white/20 transition-colors"
          aria-label="Fermer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      {visible.length > 1 && (
        <div className="mx-auto max-w-[1400px] px-4 pb-2 lg:px-8 flex gap-2 overflow-x-auto">
          {visible.slice(1, 4).map((n) => (
            <Link
              key={n.id}
              href={n.href}
              className={cn(
                "shrink-0 rounded-lg bg-white/10 px-3 py-1.5 text-xs hover:bg-white/20 transition-colors"
              )}
            >
              {n.clientName} — {n.type === "devis" ? "Devis" : "Message"}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
