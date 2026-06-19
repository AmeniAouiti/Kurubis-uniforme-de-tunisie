import type { SupabaseClient } from "@supabase/supabase-js";

type ConvRow = {
  id: string;
  client_id: string | null;
  client_email: string;
  client_name: string;
  phone?: string | null;
  company?: string | null;
  subject: string;
  type: string;
  source: string;
};

export async function linkConversationsToUser(
  db: SupabaseClient,
  userId: string,
  email: string
) {
  if (!email) return;

  await db
    .from("conversations")
    .update({ client_id: userId })
    .ilike("client_email", email)
    .is("client_id", null);
}

export async function getProfileIdByEmail(db: SupabaseClient, email: string) {
  const { data } = await db
    .from("profiles")
    .select("id")
    .ilike("email", email)
    .maybeSingle();
  return data?.id ?? null;
}

export function canAccessConversation(
  conv: Pick<ConvRow, "client_id" | "client_email">,
  userId: string,
  userEmail: string,
  isAdmin: boolean
) {
  if (isAdmin) return true;
  const email = userEmail.toLowerCase();
  return (
    conv.client_id === userId ||
    conv.client_email?.toLowerCase() === email
  );
}

export async function insertQuoteItems(
  db: SupabaseClient,
  conversationId: string,
  items: { productId?: string; productName: string; sku?: string; quantity: number }[]
) {
  if (!items.length) return;

  const { error } = await db.from("quote_items").insert(
    items.map((i) => ({
      conversation_id: conversationId,
      product_id: i.productId || null,
      product_name: i.productName,
      sku: i.sku || "",
      quantity: i.quantity,
    }))
  );

  if (error) console.error("[quote_items]", error);
}

export async function createConversationWithMessage(
  db: SupabaseClient,
  params: {
    clientId: string | null;
    clientEmail: string;
    clientName: string;
    phone?: string;
    company?: string;
    subject: string;
    message: string;
    source: "landing" | "account";
    items?: { productId?: string; productName: string; sku?: string; quantity: number }[];
  }
) {
  const { data: conv, error: convError } = await db
    .from("conversations")
    .insert({
      client_id: params.clientId,
      client_email: params.clientEmail.toLowerCase(),
      client_name: params.clientName,
      phone: params.phone || null,
      company: params.company || null,
      subject: params.subject,
      type: "devis",
      source: params.source,
      quote_status: "nouveau",
      unread_by_admin: true,
      unread_by_client: false,
    })
    .select()
    .single();

  if (convError || !conv) {
    throw new Error(convError?.message || "Impossible de créer la conversation");
  }

  await insertQuoteItems(db, conv.id, params.items || []);

  const { data: msg, error: msgError } = await db
    .from("conversation_messages")
    .insert({
      conversation_id: conv.id,
      sender: "client",
      body: params.message.trim(),
    })
    .select()
    .single();

  if (msgError || !msg) {
    throw new Error(msgError?.message || "Erreur message");
  }

  return { conv, msg };
}
