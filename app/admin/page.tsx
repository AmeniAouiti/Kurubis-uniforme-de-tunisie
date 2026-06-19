"use client";

import Link from "next/link";
import { Package, MessageSquare, FileText, Users, ArrowRight, Clock } from "lucide-react";
import { AdminPage } from "@/components/admin/admin-page";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import { StatusBadge } from "@/components/admin/status-badge";
import { useCms } from "@/contexts/cms-context";
import { useConversations } from "@/hooks/use-conversations";
import { formatDate } from "@/lib/platform/format";

export default function AdminDashboardPage() {
  const { products } = useCms();
  const { conversations, unreadByAdmin: unreadConversationsCount, pendingQuotes: pendingQuotesCount } = useConversations();
  const activeClientsCount = 0;

  const recentActivity = [...conversations]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 6);

  return (
    <AdminPage
      title="Tableau de bord"
      subtitle="Vue d'ensemble de votre plateforme Kurubis uniforme"
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-8">
        <AdminStatCard
          label="Conversations"
          value={unreadConversationsCount}
          icon={MessageSquare}
          href="/admin/messagerie"
          accent="amber"
          badge={unreadConversationsCount}
        />
        <AdminStatCard
          label="Devis en attente"
          value={pendingQuotesCount}
          icon={FileText}
          href="/admin/devis"
          accent="purple"
          badge={pendingQuotesCount}
        />
        <AdminStatCard
          label="Clients actifs"
          value={activeClientsCount}
          icon={Users}
          href="/admin/clients"
          accent="green"
        />
        <AdminStatCard
          label="Articles"
          value={products.length}
          icon={Package}
          href="/admin/produits"
          accent="blue"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-lg">Conversations récentes</h2>
            <Clock className="h-4 w-4 text-muted" />
          </div>
          {recentActivity.length === 0 ? (
            <p className="text-sm text-muted py-8 text-center">Aucune activité</p>
          ) : (
            <ul className="space-y-3">
              {recentActivity.map((conv) => (
                <li key={conv.id}>
                  <Link
                    href={conv.type === "devis" ? "/admin/devis" : "/admin/messagerie"}
                    className="flex items-center justify-between gap-4 rounded-xl border border-border p-4 hover:border-google-blue/30 hover:bg-google-blue-50/50 transition-all group"
                  >
                    <div className="min-w-0">
                      <p className="font-medium truncate group-hover:text-google-blue">{conv.subject}</p>
                      <p className="text-sm text-muted truncate">{conv.clientName} · {conv.clientEmail}</p>
                      <p className="text-xs text-muted mt-1">{formatDate(conv.updatedAt)}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {conv.unreadByAdmin && (
                        <span className="h-2 w-2 rounded-full bg-red-500" />
                      )}
                      {conv.type === "devis" ? (
                        <StatusBadge status={conv.quoteStatus} />
                      ) : (
                        <span className="text-xs text-muted">Message</span>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h2 className="font-semibold mb-4">Accès rapide</h2>
            <div className="space-y-2">
              {[
                { href: "/admin/messagerie", label: "Répondre aux clients", count: conversations.length },
                { href: "/admin/devis", label: "Traiter les devis", count: conversations.filter((c) => c.type === "devis").length },
                { href: "/admin/clients", label: "Gérer les clients", count: activeClientsCount },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between rounded-xl px-4 py-3 text-sm hover:bg-google-blue-50 transition-colors group"
                >
                  <span className="group-hover:text-google-blue">{link.label}</span>
                  <span className="flex items-center gap-2 text-muted">
                    <span className="text-xs font-semibold bg-surface px-2 py-0.5 rounded-full">{link.count}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-2xl gradient-blue p-6 text-white shadow-lg shadow-google-blue/20">
            <h2 className="font-semibold mb-2">Messagerie intégrée</h2>
            <p className="text-sm text-white/80 leading-relaxed">
              Les demandes de devis des clients apparaissent ici. Répondez directement — le client voit
              la réponse dans son espace compte.
            </p>
          </div>
        </div>
      </div>
    </AdminPage>
  );
}
