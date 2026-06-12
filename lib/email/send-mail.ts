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
      ? "Landing page (email uniquement)"
      : "Espace client (email + plateforme)";

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
