import { NextResponse } from "next/server";
import {
  emitConversationEvent,
  emitAdminNotification,
  emitUserNotification,
} from "@/lib/socket/io";
import { sendAdminReplyToClientEmail } from "@/lib/email/send-mail";
import { getAuthUser, getDbAsync, getProfile } from "@/lib/supabase/db";
import {
  canAccessConversation,
  getProfileIdByEmail,
} from "@/lib/supabase/conversations";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: conversationId } = await params;
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { body: messageBody } = await request.json();
    if (!messageBody?.trim()) {
      return NextResponse.json({ error: "Message vide" }, { status: 400 });
    }

    const profile = await getProfile(user.id);
    const isAdmin = profile?.role === "admin";
    const sender = isAdmin ? "admin" : "client";
    const db = await getDbAsync();

    const { data: conv } = await db
      .from("conversations")
      .select("*")
      .eq("id", conversationId)
      .single();

    if (!conv) {
      return NextResponse.json({ error: "Conversation introuvable" }, { status: 404 });
    }

    const userEmail = profile?.email || user.email || "";
    if (!canAccessConversation(conv, user.id, userEmail, isAdmin)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const { data: msg, error } = await db
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

    await db
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
      clientName: conv.client_name,
    };

    emitConversationEvent(conversationId, "message:new", payload);

    if (sender === "client") {
      emitAdminNotification({
        id: `msg-${msg.id}`,
        type: "message",
        title: "Nouveau message client",
        body: `${conv.client_name} : ${msg.body.slice(0, 100)}`,
        href: `/admin/messagerie?c=${conversationId}`,
        clientName: conv.client_name,
        createdAt: msg.created_at,
      });
    }

    if (sender === "admin") {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const conversationUrl = `${appUrl}/compte/conversations?c=${conversationId}`;

      sendAdminReplyToClientEmail({
        clientEmail: conv.client_email,
        clientName: conv.client_name,
        subject: conv.subject,
        replyBody: msg.body,
        conversationUrl,
      }).catch(console.error);

      const notifyUserId =
        conv.client_id || (await getProfileIdByEmail(db, conv.client_email));

      if (notifyUserId) {
        emitUserNotification(notifyUserId, {
          id: `reply-${msg.id}`,
          type: "reply",
          title: "Réponse à votre demande de devis",
          body: msg.body.slice(0, 140),
          href: `/compte/conversations?c=${conversationId}`,
          createdAt: msg.created_at,
        });
      }
    }

    return NextResponse.json({ message: payload });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
