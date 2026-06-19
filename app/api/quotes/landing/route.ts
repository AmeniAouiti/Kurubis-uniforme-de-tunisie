import { NextResponse } from "next/server";
import { sendQuoteNotificationEmail } from "@/lib/email/send-mail";
import { emitConversationEvent, emitAdminNotification } from "@/lib/socket/io";
import { getDbAsync } from "@/lib/supabase/db";
import { createConversationWithMessage } from "@/lib/supabase/conversations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clientName, clientEmail, phone, company, subject, message, items } = body;

    if (!clientName || !clientEmail || !message) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
    }

    const db = await getDbAsync();
    const { conv, msg } = await createConversationWithMessage(db, {
      clientId: null,
      clientEmail,
      clientName,
      phone,
      company,
      subject: subject || "Demande de devis — Landing",
      message,
      source: "landing",
      items: items || [],
    });

    sendQuoteNotificationEmail({
      clientName,
      clientEmail,
      phone,
      company,
      subject: conv.subject,
      message: message.trim(),
      items: items || [],
      source: "landing",
    }).catch(console.error);

    emitConversationEvent(conv.id, "conversation:new", {
      conversationId: conv.id,
      message: msg,
      clientName,
      source: "landing",
    });

    emitAdminNotification({
      id: `devis-${conv.id}`,
      type: "devis",
      title: "Nouvelle demande de devis (landing)",
      body: `${clientName} a envoyé une demande depuis le site`,
      href: `/admin/devis?c=${conv.id}`,
      clientName,
      createdAt: conv.created_at,
    });

    return NextResponse.json({
      ok: true,
      conversationId: conv.id,
      message:
        "Demande enregistrée. Créez un compte avec le même email pour suivre les réponses en ligne.",
    });
  } catch (e) {
    console.error("[quotes/landing]", e);
    return NextResponse.json(
      {
        error: e instanceof Error ? e.message : String(e),
        hint: "Exécutez supabase/setup-messaging.sql dans Supabase → SQL Editor",
      },
      { status: 500 }
    );
  }
}
