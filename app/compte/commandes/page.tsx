"use client";

import Link from "next/link";
import { AccountPage } from "@/components/account/account-page";
import { StatusBadge } from "@/components/admin/status-badge";
import { useConversations } from "@/hooks/use-conversations";
import { formatDateShort } from "@/lib/platform/format";
import { Package, MessageSquare } from "lucide-react";

export default function CommandesPage() {
  const { conversations, loading } = useConversations();
  const devis = conversations
    .filter((c) => c.type === "devis")
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  return (
    <AccountPage title="Commandes & devis" breadcrumb="Commandes">
      <p className="text-sm text-muted mb-6">
        Vos demandes de devis et leur suivi. Cliquez pour ouvrir la conversation avec notre équipe.
      </p>
      <div className="rounded-2xl border border-border bg-white overflow-hidden">
        {loading ? (
          <p className="p-8 text-center text-sm text-muted">Chargement...</p>
        ) : devis.length === 0 ? (
          <div className="py-16 text-center text-muted">
            <Package className="h-10 w-10 mx-auto mb-3 text-border" />
            <p className="text-sm">Aucune demande de devis pour le moment.</p>
            <Link href="/boutique" className="text-google-blue text-sm hover:underline mt-2 inline-block">
              Parcourir le catalogue →
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-surface border-b border-border">
              <tr>
                <th className="px-5 py-3 text-left font-semibold">Référence</th>
                <th className="px-5 py-3 text-left font-semibold hidden sm:table-cell">Date</th>
                <th className="px-5 py-3 text-left font-semibold">Objet</th>
                <th className="px-5 py-3 text-left font-semibold">Statut</th>
                <th className="px-5 py-3 text-right font-semibold hidden sm:table-cell">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {devis.map((order) => (
                <tr key={order.id} className="hover:bg-google-blue-50/50 transition-colors">
                  <td className="px-5 py-4 font-medium font-mono text-xs">
                    DEV-{order.id.slice(0, 8).toUpperCase()}
                  </td>
                  <td className="px-5 py-4 text-muted hidden sm:table-cell">
                    {formatDateShort(order.createdAt)}
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-medium truncate max-w-[200px]">{order.subject}</p>
                    <p className="text-xs text-muted">{order.quoteItems.length} article(s)</p>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={order.quoteStatus} />
                  </td>
                  <td className="px-5 py-4 text-right hidden sm:table-cell">
                    <Link
                      href={`/compte/conversations?c=${order.id}`}
                      className="inline-flex items-center gap-1 text-google-blue hover:underline text-xs font-medium"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      Voir conversation
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AccountPage>
  );
}
