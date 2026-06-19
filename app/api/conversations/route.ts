import { NextResponse } from "next/server";
import { mapConversation } from "@/lib/db/map-conversation";
import { getAuthUser, getDbAsync, getProfile } from "@/lib/supabase/db";

async function loadConversationDetails(ids: string[]) {
  if (!ids.length) return [];

  const db = await getDbAsync();

  const { data: rows, error } = await db
    .from("conversations")
    .select("*")
    .in("id", ids)
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);
  if (!rows?.length) return [];

  const { data: allItems } = await db
    .from("quote_items")
    .select("*")
    .in("conversation_id", ids);

  const { data: allMsgs } = await db
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
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const profile = await getProfile(user.id);
    const db = await getDbAsync();
    const isAdmin = profile?.role === "admin";

    let query = db.from("conversations").select("id");

    if (!isAdmin) {
      const email = (profile?.email || user.email || "").toLowerCase();
      query = query.or(`client_id.eq.${user.id},client_email.ilike.${email}`);
    }

    const { data: ids, error } = await query.order("updated_at", { ascending: false });

    if (error) {
      console.error("[conversations GET]", error);
      const needsSetup = error.message?.includes("conversations");
      return NextResponse.json(
        {
          error: error.message,
          hint: needsSetup
            ? "Exécutez supabase/setup-messaging.sql dans Supabase → SQL Editor → Run"
            : "Vérifiez que schema.sql a été exécuté dans Supabase",
        },
        { status: 500 }
      );
    }

    const conversations = await loadConversationDetails((ids || []).map((r) => r.id));
    return NextResponse.json({ conversations });
  } catch (e) {
    console.error("[conversations GET]", e);
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json(
      {
        error: msg,
        hint: msg.includes("SUPABASE_DB_PASSWORD") || msg.includes("DATABASE_URL")
          ? "Ajoutez SUPABASE_DB_PASSWORD dans .env.local (Supabase → Settings → Database → mot de passe), puis redémarrez npm run dev"
          : undefined,
      },
      { status: 500 }
    );
  }
}
