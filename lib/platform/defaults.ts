import type { PlatformData } from "@/lib/platform/types";

export const PLATFORM_STORAGE_KEY = "kurubis-platform";

export function getDefaultPlatformData(): PlatformData {
  return {
    conversations: [
      {
        id: "conv-1",
        clientEmail: "aouiti.ameeni@kurubis.tn",
        clientName: "Ameeni Aouiti",
        company: "Entreprise professionnelle",
        subject: "Devis — Polo manche longue (50 pcs)",
        type: "devis",
        source: "account",
        quoteItems: [
          { productId: "1", productName: "Polo manche longue", sku: "PML001", quantity: 50 },
        ],
        quoteStatus: "en_cours",
        thread: [
          {
            id: "msg-1",
            sender: "client",
            body: "Bonjour, je souhaite un devis pour 50 polos manche longue avec broderie logo. Merci.",
            createdAt: "2026-06-05T16:45:00.000Z",
          },
          {
            id: "msg-2",
            sender: "admin",
            body: "Bonjour Ameeni, nous avons bien reçu votre demande. Le devis avec broderie vous sera envoyé sous 24h.",
            createdAt: "2026-06-06T09:00:00.000Z",
          },
        ],
        createdAt: "2026-06-05T16:45:00.000Z",
        updatedAt: "2026-06-06T09:00:00.000Z",
        unreadByAdmin: false,
        unreadByClient: true,
        adminNotes: "Personnalisation logo broderie demandée",
      },
      {
        id: "conv-2",
        clientEmail: "sami.benali@entreprise.tn",
        clientName: "Sami Ben Ali",
        phone: "+216 22 111 222",
        subject: "Combinaisons anti-feu — 45 ouvriers",
        type: "contact",
        source: "account",
        quoteItems: [],
        quoteStatus: "nouveau",
        thread: [
          {
            id: "msg-3",
            sender: "client",
            body: "Bonjour, nous cherchons des combinaisons anti-feu pour 45 ouvriers. Pouvez-vous nous envoyer un devis avec délais de livraison ?",
            createdAt: "2026-06-10T09:30:00.000Z",
          },
        ],
        createdAt: "2026-06-10T09:30:00.000Z",
        updatedAt: "2026-06-10T09:30:00.000Z",
        unreadByAdmin: true,
        unreadByClient: false,
      },
      {
        id: "conv-3",
        clientEmail: "m.trabelsi@btp.tn",
        clientName: "Mohamed Trabelsi",
        phone: "+216 24 555 123",
        company: "Trabelsi BTP",
        subject: "Devis chantier — combinaisons et salopettes",
        type: "devis",
        source: "account",
        quoteItems: [
          { productId: "2", productName: "Combinaison bicolore avec poches genoux", sku: "CBPG001", quantity: 30 },
          { productId: "4", productName: "Salopette hommes", sku: "SH001", quantity: 20 },
        ],
        quoteStatus: "nouveau",
        thread: [
          {
            id: "msg-4",
            sender: "client",
            body: "Devis pour équipe chantier — livraison Korba. Merci de nous contacter.",
            createdAt: "2026-06-11T11:00:00.000Z",
          },
        ],
        createdAt: "2026-06-11T11:00:00.000Z",
        updatedAt: "2026-06-11T11:00:00.000Z",
        unreadByAdmin: true,
        unreadByClient: false,
      },
    ],
    clients: [
      {
        id: "client-1",
        firstName: "Ameeni",
        lastName: "Aouiti",
        email: "aouiti.ameeni@kurubis.tn",
        phone: "+216 24 553 769",
        company: "Entreprise professionnelle",
        status: "actif",
        createdAt: "2026-05-20T10:00:00.000Z",
        lastLoginAt: "2026-06-12T08:00:00.000Z",
      },
      {
        id: "client-2",
        firstName: "Karim",
        lastName: "Mansouri",
        email: "karim.mansouri@industrie.tn",
        phone: "+216 20 888 999",
        company: "Industrie Mansouri",
        status: "actif",
        createdAt: "2026-06-01T12:30:00.000Z",
        lastLoginAt: "2026-06-09T17:20:00.000Z",
      },
    ],
  };
}
