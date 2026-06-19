import nodemailer from "nodemailer";

const ADMIN_TO = process.env.MAIL_ADMIN_TO || "kurubis.uniforme@gmail.com";

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.MAIL_HOST || "smtp.gmail.com",
    port: Number(process.env.MAIL_PORT || 587),
    secure: process.env.MAIL_SECURE === "true",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS?.replace(/\s/g, ""),
    },
  });
}

export async function sendQuoteNotificationEmail(params: {
  clientName: string;
  clientEmail: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
  items?: { productName: string; sku: string; quantity: number }[];
  source: "landing" | "account";
}) {
  if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
    console.warn("[email] MAIL_USER/MAIL_PASS non configurés");
    return { ok: false, error: "Mail non configuré" };
  }

  const itemsHtml =
    params.items && params.items.length > 0
      ? `<ul>${params.items.map((i) => `<li>${i.productName} (SKU: ${i.sku}) × ${i.quantity}</li>`).join("")}</ul>`
      : "<p>Aucun article listé</p>";

  const sourceLabel =
    params.source === "landing"
      ? "Landing page (site public)"
      : "Espace client connecté";

  const html = `
    <h2>Nouvelle demande de devis — Kurubis uniforme</h2>
    <p><strong>Source :</strong> ${sourceLabel}</p>
    <p><strong>Client :</strong> ${params.clientName}</p>
    <p><strong>Email :</strong> ${params.clientEmail}</p>
    ${params.phone ? `<p><strong>Téléphone :</strong> ${params.phone}</p>` : ""}
    ${params.company ? `<p><strong>Entreprise :</strong> ${params.company}</p>` : ""}
    <p><strong>Objet :</strong> ${params.subject}</p>
    <h3>Message</h3>
    <p>${params.message.replace(/\n/g, "<br>")}</p>
    <h3>Articles</h3>
    ${itemsHtml}
    <hr>
    <p style="color:#666;font-size:12px">Notification automatique Kurubis uniforme</p>
  `;

  try {
    await getTransporter().sendMail({
      from: `"${process.env.MAIL_FROM_NAME || "Kurubis"}" <${process.env.MAIL_USER}>`,
      to: ADMIN_TO,
      replyTo: params.clientEmail,
      subject: `[Devis] ${params.subject} — ${params.clientName}`,
      html,
    });
    return { ok: true };
  } catch (err) {
    console.error("[email]", err);
    return { ok: false, error: String(err) };
  }
}

export async function sendAdminReplyToClientEmail(params: {
  clientEmail: string;
  clientName: string;
  subject: string;
  replyBody: string;
  conversationUrl?: string;
}) {
  if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
    return { ok: false, error: "Mail non configuré" };
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const link = params.conversationUrl || `${appUrl}/compte/conversations`;

  const html = `
    <h2>Réponse à votre demande — Kurubis uniforme</h2>
    <p>Bonjour <strong>${params.clientName}</strong>,</p>
    <p>Notre équipe a répondu à votre demande : <strong>${params.subject}</strong></p>
    <div style="background:#f5f8ff;border-left:4px solid #1A73E8;padding:16px;margin:16px 0;border-radius:8px">
      ${params.replyBody.replace(/\n/g, "<br>")}
    </div>
    <p>
      <a href="${link}" style="display:inline-block;background:#1A73E8;color:white;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:600">
        Voir la conversation
      </a>
    </p>
    <p style="color:#666;font-size:12px;margin-top:24px">
      Vous pouvez aussi répondre depuis votre espace client → Messagerie & devis.
    </p>
  `;

  try {
    await getTransporter().sendMail({
      from: `"${process.env.MAIL_FROM_NAME || "Kurubis"}" <${process.env.MAIL_USER}>`,
      to: params.clientEmail,
      subject: `Réponse Kurubis — ${params.subject}`,
      html,
    });
    return { ok: true };
  } catch (err) {
    console.error("[email reply]", err);
    return { ok: false, error: String(err) };
  }
}
