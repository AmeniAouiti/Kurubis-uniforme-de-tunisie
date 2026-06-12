import type { Conversation, PlatformData } from "@/lib/platform/types";
import { generateId } from "@/lib/cms/utils";

interface LegacyMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  body: string;
  createdAt: string;
  status: string;
  replies?: { body: string; createdAt: string }[];
}

interface LegacyQuote {
  id: string;
  clientName: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  items: Conversation["quoteItems"];
  status: Conversation["quoteStatus"];
  createdAt: string;
  adminNotes?: string;
}

export function normalizePlatformData(raw: unknown): PlatformData {
  const data = raw as Record<string, unknown>;

  if (Array.isArray(data.conversations)) {
    return {
      conversations: data.conversations as Conversation[],
      clients: (data.clients as PlatformData["clients"]) ?? [],
    };
  }

  const conversations: Conversation[] = [];

  for (const m of (data.messages as LegacyMessage[]) ?? []) {
    const thread = [
      {
        id: generateId(),
        sender: "client" as const,
        body: m.body,
        createdAt: m.createdAt,
      },
      ...(m.replies ?? []).map((r) => ({
        id: generateId(),
        sender: "admin" as const,
        body: r.body,
        createdAt: r.createdAt,
      })),
    ];
    conversations.push({
      id: m.id,
      clientEmail: m.email,
      clientName: m.name,
      phone: m.phone,
      subject: m.subject,
      type: "contact",
      source: "landing",
      quoteItems: [],
      quoteStatus: "nouveau",
      thread,
      createdAt: m.createdAt,
      updatedAt: thread[thread.length - 1]?.createdAt ?? m.createdAt,
      unreadByAdmin: m.status === "nouveau",
      unreadByClient: (m.replies?.length ?? 0) > 0 && m.status !== "repondu",
    });
  }

  for (const q of (data.quotes as LegacyQuote[]) ?? []) {
    conversations.push({
      id: q.id,
      clientEmail: q.email,
      clientName: q.clientName,
      phone: q.phone,
      company: q.company,
      subject: `Demande de devis — ${q.items.length} article(s)`,
      type: "devis",
      source: "account",
      quoteItems: q.items,
      quoteStatus: q.status,
      thread: [
        {
          id: generateId(),
          sender: "client",
          body: q.message || "Demande de devis envoyée depuis le panier.",
          createdAt: q.createdAt,
        },
      ],
      createdAt: q.createdAt,
      updatedAt: q.createdAt,
      unreadByAdmin: q.status === "nouveau",
      unreadByClient: false,
      adminNotes: q.adminNotes,
    });
  }

  return {
    conversations,
    clients: (data.clients as PlatformData["clients"]) ?? [],
  };
}
