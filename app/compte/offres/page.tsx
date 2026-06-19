"use client";

import Link from "next/link";
import { AccountPage } from "@/components/account/account-page";
import { StatusBadge } from "@/components/admin/status-badge";
import { useConversations } from "@/hooks/use-conversations";
import { formatDateShort } from "@/lib/platform/format";
import { Tag } from "lucide-react";

export default function OffresPage() {
  const { conversations, loading } = useConversations();
  const offers = conversations
    .filter((c) => c.type === "devis" && c.quoteStatus !== "refuse")
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  return (
    <AccountPage title="Mes offres" breadcrumb="Mes offres">
      <p className="text-sm text-muted mb-6">
        Devis en cours et propositions de notre équipe commerciale.
      </p>
      {loading ? (
        <p className="text-sm text-muted py-8 text-center">Chargement...</p>
      ) : offers.length === 0 ? (
        <div className="rounded-2xl border border-border bg-white p-12 text-center text-muted text-sm">
          Aucune offre en cours.
        </div>
      ) : (
        <div className="space-y-3">
          {offers.map((offer) => (
            <Link
              key={offer.id}
              href={`/compte/conversations?c=${offer.id}`}
              className="flex items-center gap-4 rounded-2xl border border-border bg-white p-5 hover:border-google-blue/30 hover:shadow-md transition-all"
            >
              <Tag className="h-5 w-5 text-google-blue shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{offer.subject}</p>
                <p className="text-xs text-muted">
                  DEV-{offer.id.slice(0, 8).toUpperCase()} — {formatDateShort(offer.updatedAt)}
                  {offer.source === "landing" && " · Via site public"}
                </p>
              </div>
              <StatusBadge status={offer.quoteStatus} />
            </Link>
          ))}
        </div>
      )}
    </AccountPage>
  );
}
