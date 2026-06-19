import { NextResponse } from "next/server";
import { sendQuoteNotificationEmail } from "@/lib/email/send-mail";
import { emitConversationEvent, emitAdminNotification } from "@/lib/socket/io";
import { getAuthUser, getDbAsync, ensureProfile } from "@/lib/supabase/db";
import { createConversationWithMessage } from "@/lib/supabase/conversations";

export async function POST(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    await ensureProfile(user);

    const body = await request.json();
    const { clientName, clientEmail, phone, company, subject, message, items } = body;

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message requis" }, { status: 400 });
    }

    const db = await getDbAsync();
    const email = clientEmail || user.email || "";

    const { conv, msg } = await createConversationWithMessage(db, {
      clientId: user.id,
      clientEmail: email,
      clientName: clientName || "Client",
      phone,
      company,
      subject: subject || "Demande de devis",
      message,
      source: "account",
      items: items || [],
    });

    sendQuoteNotificationEmail({
      clientName: clientName || "Client",
      clientEmail: email,
      phone,
      company,
      subject: conv.subject,
      message: message.trim(),
      items: items || [],
      source: "account",
    }).catch(console.error);

    emitConversationEvent(conv.id, "conversation:new", {
      conversationId: conv.id,
      message: msg,
      clientName: clientName || "Client",
      source: "account",
    });

    emitAdminNotification({
      id: `devis-${conv.id}`,
      type: "devis",
      title: "Nouvelle demande de devis",
      body: `${clientName || "Client"} a envoyé une demande depuis son espace client`,
      href: `/admin/devis?c=${conv.id}`,
      clientName: clientName || "Client",
      createdAt: conv.created_at,
    });

    return NextResponse.json({ ok: true, conversationId: conv.id });
  } catch (e) {
    console.error("[quotes/account]", e);
    return NextResponse.json(
      {
        error: e instanceof Error ? e.message : String(e),
        hint: "Exécutez supabase/setup-messaging.sql dans Supabase → SQL Editor",
      },
      { status: 500 }
    );
  }
}
