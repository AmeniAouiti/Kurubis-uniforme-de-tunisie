"use client";

import { useCallback, useEffect, useState } from "react";
import type { Conversation } from "@/lib/platform/types";
import { useAuth } from "@/contexts/auth-context";
import { useSocket } from "@/hooks/use-socket";
import { cacheGet, cacheSet, cacheGetSession, cacheInvalidate } from "@/lib/cache/memory";

const CONV_CACHE_KEY = "conversations";

export function useConversations() {
  const { isAuthenticated, user, isAdmin } = useAuth();
  const initial = cacheGet<Conversation[]>(CONV_CACHE_KEY) || cacheGetSession<Conversation[]>(CONV_CACHE_KEY);
  const [conversations, setConversations] = useState<Conversation[]>(initial || []);
  const [loading, setLoading] = useState(!initial?.length);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const { socket } = useSocket();

  const refresh = useCallback(async (silent = false) => {
    if (!isAuthenticated) {
      setConversations([]);
      setFetchError(null);
      setLoading(false);
      return;
    }
    if (!silent && !conversations.length) setLoading(true);
    try {
      const res = await fetch("/api/conversations");
      const data = await res.json();
      if (res.ok) {
        const list = data.conversations || [];
        setConversations(list);
        cacheSet(CONV_CACHE_KEY, list);
        setFetchError(null);
      } else {
        const msg = data.hint || data.error || "Impossible de charger les conversations";
        setFetchError(msg);
      }
    } catch {
      setFetchError("Erreur réseau lors du chargement des conversations.");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, conversations.length]);

  useEffect(() => {
    const hasCache = !!cacheGet<Conversation[]>(CONV_CACHE_KEY) || !!cacheGetSession<Conversation[]>(CONV_CACHE_KEY);
    void refresh(!!hasCache);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  useEffect(() => {
    if (!socket || !isAuthenticated) return;

    if (isAdmin) socket.emit("join-admin");
    if (user?.id) socket.emit("join-user", { userId: user.id });

    const onNew = () => {
      cacheInvalidate(CONV_CACHE_KEY);
      refresh(true);
    };
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
    fetchError,
    refresh,
    unreadByAdmin,
    pendingQuotes,
  };
}
