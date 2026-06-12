import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { mapConversation } from "@/lib/db/map-conversation";

async function loadConversationDetails(
  supabase: Awaited<ReturnType<typeof createClient>>,
  ids: string[]
) {
  if (!ids.length) return [];

  const { data: rows } = await supabase
    .from("conversations")
    .select("*")
    .in("id", ids)
    .order("updated_at", { ascending: false });

  if (!rows?.length) return [];

  const { data: allItems } = await supabase
    .from("quote_items")
    .select("*")
    .in("conversation_id", ids);

  const { data: allMsgs } = await supabase
    .from("conversation_messages")
    .select("*")
    .in("conversation_id", ids)
    .order("created_at", { ascending: true });

  return rows.map((row) => {
    const items = (allItems || [])
      .filter((i) => i.conversation_id === row.id)
      .map((i) => ({
        productId: i.product_id || "",
        productName: i.product_name,
        sku: i.sku || "",
        quantity: i.quantity,
      }));
    const thread = (allMsgs || [])
      .filter((m) => m.conversation_id === row.id)
      .map((m) => ({
        id: m.id,
        sender: m.sender as "client" | "admin",
        body: m.body,
        createdAt: m.created_at,
      }));
    return mapConversation(row, items, thread);
  });
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, email")
    .eq("id", user.id)
    .single();

  let query = supabase.from("conversations").select("id").eq("source", "account");

  if (profile?.role !== "admin") {
    query = query.or(`client_id.eq.${user.id},client_email.eq.${profile?.email || user.email}`);
  }

  const { data: ids, error } = await query.order("updated_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const conversations = await loadConversationDetails(
    supabase,
    (ids || []).map((r) => r.id)
  );

  return NextResponse.json({ conversations });
}
