import type { Conversation, ConversationMessage, QuoteItem } from "@/lib/platform/types";

export function mapConversation(
  row: Record<string, unknown>,
  items: QuoteItem[],
  thread: ConversationMessage[]
): Conversation {
  return {
    id: row.id as string,
    clientEmail: row.client_email as string,
    clientName: row.client_name as string,
    phone: row.phone as string | undefined,
    company: row.company as string | undefined,
    subject: row.subject as string,
    type: row.type as Conversation["type"],
    source: ((row.source as Conversation["source"]) || "account"),
    quoteItems: items,
    quoteStatus: row.quote_status as Conversation["quoteStatus"],
    thread,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    unreadByAdmin: row.unread_by_admin as boolean,
    unreadByClient: row.unread_by_client as boolean,
    adminNotes: row.admin_notes as string | undefined,
  };
}
