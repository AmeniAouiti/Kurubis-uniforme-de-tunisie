"use client";

import { useCallback, useEffect, useState } from "react";
import type { Conversation } from "@/lib/platform/types";
import { useAuth } from "@/contexts/auth-context";
import { useSocket } from "@/hooks/use-socket";

export function useConversations() {
  const { isAuthenticated, user, isAdmin } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const { socket } = useSocket();

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setConversations([]);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/conversations");
      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations || []);
      }
    } catch {
      /* fallback silent */
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!socket || !isAuthenticated) return;

    if (isAdmin) socket.emit("join-admin");
    if (user?.id) socket.emit("join-user", { userId: user.id });

    const onNew = () => refresh();
    socket.on("conversation:new", onNew);
    socket.on("message:new", onNew);

    return () => {
      socket.off("conversation:new", onNew);
      socket.off("message:new", onNew);
    };
  }, [socket, isAuthenticated, isAdmin, user?.id, refresh]);

  const unreadByAdmin = conversations.filter((c) => c.unreadByAdmin).length;
  const pendingQuotes = conversations.filter(
    (c) => c.type === "devis" && c.quoteStatus === "nouveau"
  ).length;

  return {
    conversations,
    loading,
    refresh,
    unreadByAdmin,
    pendingQuotes,
  };
}
