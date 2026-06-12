import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendQuoteNotificationEmail } from "@/lib/email/send-mail";
import { emitConversationEvent } from "@/lib/socket/io";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const body = await request.json();
    const { clientName, clientEmail, phone, company, subject, message, items } = body;

    const { data: conv, error: convError } = await supabase
      .from("conversations")
      .insert({
        client_id: user.id,
        client_email: clientEmail || user.email,
        client_name: clientName,
        phone,
        company,
        subject: subject || "Demande de devis",
        type: "devis",
        source: "account",
        quote_status: "nouveau",
        unread_by_admin: true,
        unread_by_client: false,
      })
      .select()
      .single();

    if (convError || !conv) {
      return NextResponse.json({ error: convError?.message || "Erreur création" }, { status: 500 });
    }

    if (items?.length) {
      await supabase.from("quote_items").insert(
        items.map((i: { productId: string; productName: string; sku: string; quantity: number }) => ({
          conversation_id: conv.id,
          product_id: i.productId,
          product_name: i.productName,
          sku: i.sku,
          quantity: i.quantity,
        }))
      );
    }

    const { data: msg, error: msgError } = await supabase
      .from("conversation_messages")
      .insert({
        conversation_id: conv.id,
        sender: "client",
        body: message,
      })
      .select()
      .single();

    if (msgError) {
      return NextResponse.json({ error: msgError.message }, { status: 500 });
    }

    await sendQuoteNotificationEmail({
      clientName,
      clientEmail: clientEmail || user.email!,
      phone,
      company,
      subject: conv.subject,
      message,
      items: items || [],
      source: "account",
    });

    emitConversationEvent(conv.id, "conversation:new", { conversationId: conv.id, message: msg });

    return NextResponse.json({ ok: true, conversationId: conv.id });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
