"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Mail, Send } from "lucide-react";
import { AdminPage } from "@/components/admin/admin-page";
import { StatusBadge } from "@/components/admin/status-badge";
import { ConversationThread } from "@/components/messaging/conversation-thread";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useConversations } from "@/hooks/use-conversations";
import { useSocket } from "@/hooks/use-socket";
import { formatDate } from "@/lib/platform/format";
import type { QuoteStatus } from "@/lib/platform/types";
import { cn } from "@/lib/utils";

const statusOptions: { value: QuoteStatus; label: string }[] = [
  { value: "nouveau", label: "Nouveau" },
  { value: "en_cours", label: "En cours" },
  { value: "accepte", label: "Accepté" },
  { value: "refuse", label: "Refusé" },
];

export default function AdminDevisPage() {
  const searchParams = useSearchParams();
  const { conversations, refresh, pendingQuotes } = useConversations();
  const { socket } = useSocket();
  const devisList = conversations
    .filter((c) => c.type === "devis")
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const [selectedId, setSelectedId] = useState("");
  const [notes, setNotes] = useState("");
  const [reply, setReply] = useState("");

  const selected = devisList.find((c) => c.id === selectedId);

  useEffect(() => {
    const paramId = searchParams.get("c");
    if (paramId) setSelectedId(paramId);
    else if (devisList[0] && !selectedId) setSelectedId(devisList[0].id);
  }, [searchParams, devisList, selectedId]);

  useEffect(() => {
    if (!socket || !selectedId) return;
    socket.emit("join-conversation", { conversationId: selectedId });
  }, [socket, selectedId]);

  useEffect(() => {
    if (selected) setNotes(selected.adminNotes ?? "");
  }, [selected]);

  useEffect(() => {
    if (selected?.unreadByAdmin) {
      fetch(`/api/conversations/${selected.id}/read`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ as: "admin" }),
      }).then(() => refresh());
    }
  }, [selected?.id, selected?.unreadByAdmin, refresh]);

  async function updateStatus(status: QuoteStatus) {
    if (!selected) return;
    await fetch(`/api/conversations/${selected.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quoteStatus: status, adminNotes: notes }),
    });
    refresh();
  }

  async function saveNotes() {
    if (!selected) return;
    await fetch(`/api/conversations/${selected.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quoteStatus: selected.quoteStatus, adminNotes: notes }),
    });
    refresh();
  }

  async function handleReply(e: React.FormEvent) {
    e.preventDefault();
    if (!selected || !reply.trim()) return;
    await fetch(`/api/conversations/${selected.id}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: reply.trim() }),
    });
    setReply("");
    refresh();
  }

  return (
    <AdminPage title="Demandes de devis" subtitle={`${pendingQuotes} en attente · Landing + espace client`}>
      <div className="grid gap-6 lg:grid-cols-5 min-h-[560px]">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
          <ul className="divide-y divide-border max-h-[600px] overflow-y-auto">
            {devisList.length === 0 ? (
              <li className="p-8 text-center text-sm text-muted">Aucune demande de devis</li>
            ) : (
              devisList.map((conv) => (
                <li key={conv.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(conv.id)}
                    className={cn(
                      "w-full text-left px-4 py-4 hover:bg-google-blue-50/50",
                      selectedId === conv.id && "bg-google-blue-light/60 border-l-2 border-google-blue"
                    )}
                  >
                    <div className="flex justify-between gap-2 mb-1">
                      <p className="font-medium text-sm truncate">{conv.clientName}</p>
                      <StatusBadge status={conv.quoteStatus} />
                    </div>
                    <p className="text-xs text-muted truncate">{conv.subject}</p>
                    <p className="text-xs text-muted mt-1">
                      {conv.quoteItems.length} article(s) · {formatDate(conv.createdAt)}
                      {conv.source === "landing" && " · Landing"}
                      {conv.unreadByAdmin && " · Non lu"}
                    </p>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="lg:col-span-3 rounded-2xl border border-border bg-white shadow-sm flex flex-col">
          {!selected ? (
            <div className="flex h-full items-center justify-center text-muted text-sm">Sélectionnez une demande</div>
          ) : (
            <>
              <div className="p-6 border-b border-border">
                <h2 className="text-lg font-semibold">{selected.subject}</h2>
                <a href={`mailto:${selected.clientEmail}`} className="text-sm text-google-blue flex items-center gap-1 mt-2">
                  <Mail className="h-4 w-4" />{selected.clientEmail}
                </a>
                {selected.source === "landing" && (
                  <p className="text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2 mt-3">
                    Demande depuis le site public. Le client la verra dans son espace s&apos;il crée un compte avec cet email.
                  </p>
                )}
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                <ConversationThread conversation={selected} viewer="admin" />
              </div>
              <div className="p-4 border-t space-y-4">
                <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Notes internes (non visibles par le client)" />
                <Button type="button" variant="secondary" size="sm" onClick={saveNotes}>Enregistrer notes</Button>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => updateStatus(opt.value)}
                      className={cn(
                        "rounded-full px-4 py-2 text-sm border",
                        selected.quoteStatus === opt.value ? "bg-google-blue text-white border-google-blue" : "border-border"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <form onSubmit={handleReply} className="flex gap-2">
                  <Textarea value={reply} onChange={(e) => setReply(e.target.value)} rows={2} className="flex-1" placeholder="Répondre au client (plateforme + email)" />
                  <Button type="submit"><Send className="h-4 w-4" /></Button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </AdminPage>
  );
}
