import { NextResponse } from "next/server";
import { getAuthUser, getDbAsync, getProfile } from "@/lib/supabase/db";
import { canAccessConversation } from "@/lib/supabase/conversations";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { as } = await request.json();
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const profile = await getProfile(user.id);
  const isAdmin = profile?.role === "admin";

  if (as === "admin" && !isAdmin) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const db = await getDbAsync();
  const { data: conv } = await db.from("conversations").select("*").eq("id", id).single();

  if (!conv) {
    return NextResponse.json({ error: "Conversation introuvable" }, { status: 404 });
  }

  const userEmail = profile?.email || user.email || "";
  if (!canAccessConversation(conv, user.id, userEmail, isAdmin)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const updates =
    as === "admin" ? { unread_by_admin: false } : { unread_by_client: false };

  const { error } = await db.from("conversations").update(updates).eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
