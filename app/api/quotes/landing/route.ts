import { NextResponse } from "next/server";
import { sendQuoteNotificationEmail } from "@/lib/email/send-mail";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clientName, clientEmail, phone, company, subject, message, items } = body;

    if (!clientName || !clientEmail || !message) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
    }

    const result = await sendQuoteNotificationEmail({
      clientName,
      clientEmail,
      phone,
      company,
      subject: subject || "Demande de devis — Landing",
      message,
      items: items || [],
      source: "landing",
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ ok: true, emailOnly: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
