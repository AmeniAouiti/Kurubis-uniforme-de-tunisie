"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type {
  PlatformData,
  PlatformClient,
  Conversation,
  CreateConversationInput,
  QuoteStatus,
  ClientStatus,
} from "@/lib/platform/types";
import {
  PLATFORM_STORAGE_KEY,
  getDefaultPlatformData,
} from "@/lib/platform/defaults";
import { normalizePlatformData } from "@/lib/platform/migrate";
import { generateId } from "@/lib/cms/utils";

interface PlatformContextType {
  conversations: Conversation[];
  clients: PlatformClient[];
  hydrated: boolean;
  createConversation: (input: CreateConversationInput) => string;
  addThreadMessage: (conversationId: string, sender: "client" | "admin", body: string) => void;
  markReadByAdmin: (conversationId: string) => void;
  markReadByClient: (conversationId: string) => void;
  updateQuoteStatus: (conversationId: string, status: QuoteStatus, adminNotes?: string) => void;
  deleteConversation: (conversationId: string) => void;
  getConversationsForEmail: (email: string) => Conversation[];
  registerClient: (data: Omit<PlatformClient, "id" | "createdAt" | "status" | "lastLoginAt">) => PlatformClient;
  recordLogin: (email: string) => void;
  updateClientStatus: (id: string, status: ClientStatus) => void;
  deleteClient: (id: string) => void;
  unreadConversationsCount: number;
  pendingQuotesCount: number;
  activeClientsCount: number;
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

function loadPlatform(): PlatformData {
  if (typeof window === "undefined") return getDefaultPlatformData();
  try {
    const stored = localStorage.getItem(PLATFORM_STORAGE_KEY);
    if (stored) return normalizePlatformData(JSON.parse(stored));
  } catch {
    /* ignore */
  }
  return getDefaultPlatformData();
}

export function PlatformProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<PlatformData>(getDefaultPlatformData);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setData(loadPlatform());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(PLATFORM_STORAGE_KEY, JSON.stringify(data));
  }, [data, hydrated]);

  const persist = useCallback((updater: (prev: PlatformData) => PlatformData) => {
    setData(updater);
  }, []);

  const createConversation = useCallback(
    (input: CreateConversationInput) => {
      const id = generateId();
      const now = new Date().toISOString();
      const conversation: Conversation = {
        id,
        clientEmail: input.clientEmail,
        clientName: input.clientName,
        phone: input.phone,
        company: input.company,
        subject: input.subject,
        type: input.type,
        source: input.source ?? "account",
        quoteItems: input.quoteItems ?? [],
        quoteStatus: "nouveau",
        thread: [
          {
            id: generateId(),
            sender: "client",
            body: input.initialMessage,
            createdAt: now,
          },
        ],
        createdAt: now,
        updatedAt: now,
        unreadByAdmin: true,
        unreadByClient: false,
      };
      persist((prev) => ({
        ...prev,
        conversations: [conversation, ...prev.conversations],
      }));
      return id;
    },
    [persist]
  );

  const addThreadMessage = useCallback(
    (conversationId: string, sender: "client" | "admin", body: string) => {
      const now = new Date().toISOString();
      persist((prev) => ({
        ...prev,
        conversations: prev.conversations.map((c) =>
          c.id === conversationId
            ? {
                ...c,
                updatedAt: now,
                unreadByAdmin: sender === "client" ? true : c.unreadByAdmin,
                unreadByClient: sender === "admin" ? true : c.unreadByClient,
                thread: [
                  ...c.thread,
                  { id: generateId(), sender, body, createdAt: now },
                ],
              }
            : c
        ),
      }));
    },
    [persist]
  );

  const markReadByAdmin = useCallback(
    (conversationId: string) => {
      persist((prev) => ({
        ...prev,
        conversations: prev.conversations.map((c) =>
          c.id === conversationId ? { ...c, unreadByAdmin: false } : c
        ),
      }));
    },
    [persist]
  );

  const markReadByClient = useCallback(
    (conversationId: string) => {
      persist((prev) => ({
        ...prev,
        conversations: prev.conversations.map((c) =>
          c.id === conversationId ? { ...c, unreadByClient: false } : c
        ),
      }));
    },
    [persist]
  );

  const updateQuoteStatus = useCallback(
    (conversationId: string, status: QuoteStatus, adminNotes?: string) => {
      persist((prev) => ({
        ...prev,
        conversations: prev.conversations.map((c) =>
          c.id === conversationId
            ? {
                ...c,
                quoteStatus: status,
                ...(adminNotes !== undefined ? { adminNotes } : {}),
              }
            : c
        ),
      }));
    },
    [persist]
  );

  const deleteConversation = useCallback(
    (conversationId: string) => {
      persist((prev) => ({
        ...prev,
        conversations: prev.conversations.filter((c) => c.id !== conversationId),
      }));
    },
    [persist]
  );

  const getConversationsForEmail = useCallback(
    (email: string) =>
      data.conversations
        .filter((c) => c.clientEmail.toLowerCase() === email.toLowerCase())
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
    [data.conversations]
  );

  const registerClient = useCallback(
    (client: Omit<PlatformClient, "id" | "createdAt" | "status" | "lastLoginAt">) => {
      let result: PlatformClient | null = null;
      persist((prev) => {
        const existing = prev.clients.find(
          (c) => c.email.toLowerCase() === client.email.toLowerCase()
        );
        if (existing) {
          result = existing;
          return prev;
        }
        const newClient: PlatformClient = {
          ...client,
          id: generateId(),
          createdAt: new Date().toISOString(),
          status: "actif",
        };
        result = newClient;
        return { ...prev, clients: [newClient, ...prev.clients] };
      });
      return result!;
    },
    [persist]
  );

  const recordLogin = useCallback(
    (email: string) => {
      persist((prev) => ({
        ...prev,
        clients: prev.clients.map((c) =>
          c.email.toLowerCase() === email.toLowerCase()
            ? { ...c, lastLoginAt: new Date().toISOString(), status: "actif" as const }
            : c
        ),
      }));
    },
    [persist]
  );

  const updateClientStatus = useCallback(
    (id: string, status: ClientStatus) => {
      persist((prev) => ({
        ...prev,
        clients: prev.clients.map((c) => (c.id === id ? { ...c, status } : c)),
      }));
    },
    [persist]
  );

  const deleteClient = useCallback(
    (id: string) => {
      persist((prev) => ({
        ...prev,
        clients: prev.clients.filter((c) => c.id !== id),
      }));
    },
    [persist]
  );

  const unreadConversationsCount = data.conversations.filter((c) => c.unreadByAdmin).length;
  const pendingQuotesCount = data.conversations.filter(
    (c) => c.type === "devis" && c.quoteStatus === "nouveau"
  ).length;
  const activeClientsCount = data.clients.filter((c) => c.status === "actif").length;

  return (
    <PlatformContext.Provider
      value={{
        conversations: data.conversations,
        clients: data.clients,
        hydrated,
        createConversation,
        addThreadMessage,
        markReadByAdmin,
        markReadByClient,
        updateQuoteStatus,
        deleteConversation,
        getConversationsForEmail,
        registerClient,
        recordLogin,
        updateClientStatus,
        deleteClient,
        unreadConversationsCount,
        pendingQuotesCount,
        activeClientsCount,
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
}

export function usePlatform() {
  const ctx = useContext(PlatformContext);
  if (!ctx) throw new Error("usePlatform must be used within PlatformProvider");
  return ctx;
}
