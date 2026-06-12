import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { emitConversationEvent } from "@/lib/socket/io";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: conversationId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { body: messageBody } = await request.json();
  if (!messageBody?.trim()) {
    return NextResponse.json({ error: "Message vide" }, { status: 400 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const sender = profile?.role === "admin" ? "admin" : "client";

  const { data: msg, error } = await supabase
    .from("conversation_messages")
    .insert({
      conversation_id: conversationId,
      sender,
      body: messageBody.trim(),
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await supabase
    .from("conversations")
    .update({
      updated_at: new Date().toISOString(),
      unread_by_admin: sender === "client",
      unread_by_client: sender === "admin",
    })
    .eq("id", conversationId);

  const payload = {
    id: msg.id,
    conversationId,
    sender: msg.sender,
    body: msg.body,
    createdAt: msg.created_at,
  };

  emitConversationEvent(conversationId, "message:new", payload);

  return NextResponse.json({ message: payload });
}
