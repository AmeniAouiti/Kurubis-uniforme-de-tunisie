"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Mail, Phone, Send } from "lucide-react";
import { AdminPage } from "@/components/admin/admin-page";
import { ConversationThread } from "@/components/messaging/conversation-thread";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useConversations } from "@/hooks/use-conversations";
import { useSocket } from "@/hooks/use-socket";
import { formatDate } from "@/lib/platform/format";
import { cn } from "@/lib/utils";

export default function AdminMessageriePage() {
  const searchParams = useSearchParams();
  const { conversations, refresh, unreadByAdmin } = useConversations();
  const { socket } = useSocket();
  const sorted = [...conversations].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
  const [selectedId, setSelectedId] = useState("");
  const [reply, setReply] = useState("");

  const selected = sorted.find((c) => c.id === selectedId);

  useEffect(() => {
    const paramId = searchParams.get("c");
    if (paramId) setSelectedId(paramId);
    else if (sorted[0] && !selectedId) setSelectedId(sorted[0].id);
  }, [searchParams, sorted, selectedId]);

  useEffect(() => {
    if (!socket || !selectedId) return;
    socket.emit("join-conversation", { conversationId: selectedId });
  }, [socket, selectedId]);

  useEffect(() => {
    if (selected?.unreadByAdmin) {
      fetch(`/api/conversations/${selected.id}/read`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ as: "admin" }),
      }).then(() => refresh());
    }
  }, [selected?.id, selected?.unreadByAdmin, refresh]);

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
    <AdminPage
      title="Messagerie"
      subtitle={`${unreadByAdmin} non lue(s) · Répondez ici (plateforme + email client) ou via le lien email direct`}
    >
      <div className="grid gap-6 lg:grid-cols-5 min-h-[560px]">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-white shadow-sm overflow-hidden flex flex-col">
          <ul className="overflow-y-auto flex-1 divide-y divide-border">
            {sorted.length === 0 ? (
              <li className="p-8 text-center text-sm text-muted">Aucune conversation</li>
            ) : (
              sorted.map((conv) => (
                <li key={conv.id}>
                  <button
                    type="button"
                    onClick={() => { setSelectedId(conv.id); setReply(""); }}
                    className={cn(
                      "w-full text-left px-4 py-4 hover:bg-google-blue-50/50",
                      selectedId === conv.id && "bg-google-blue-light/60 border-l-2 border-google-blue"
                    )}
                  >
                    <div className="flex justify-between gap-2">
                      <p className="font-medium text-sm truncate">{conv.clientName}</p>
                      {conv.unreadByAdmin && <span className="h-2 w-2 rounded-full bg-red-500 shrink-0" />}
                    </div>
                    <p className="text-sm text-muted truncate">{conv.subject}</p>
                    <p className="text-xs text-muted mt-1">
                      {formatDate(conv.updatedAt)}
                      {conv.source === "landing" && " · Landing"}
                    </p>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="lg:col-span-3 rounded-2xl border border-border bg-white shadow-sm flex flex-col">
          {!selected ? (
            <div className="flex flex-1 items-center justify-center text-muted text-sm">Sélectionnez une conversation</div>
          ) : (
            <>
              <div className="p-6 border-b border-border">
                <h2 className="text-lg font-semibold">{selected.subject}</h2>
                <p className="text-sm text-muted">{selected.clientName}</p>
                <div className="mt-3 flex flex-wrap gap-4 text-sm">
                  <a href={`mailto:${selected.clientEmail}`} className="flex items-center gap-1 text-google-blue">
                    <Mail className="h-4 w-4" />{selected.clientEmail}
                  </a>
                  {selected.phone && (
                    <a href={`tel:${selected.phone}`} className="flex items-center gap-1 text-muted">
                      <Phone className="h-4 w-4" />{selected.phone}
                    </a>
                  )}
                </div>
                <p className="text-xs text-muted mt-3">
                  Réponse via le formulaire ci-dessous : enregistrée dans la plateforme + email au client.
                  Le lien email ouvre Gmail pour un contact direct (hors plateforme).
                </p>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                <ConversationThread conversation={selected} viewer="admin" />
              </div>
              <form onSubmit={handleReply} className="p-4 border-t border-border">
                <Textarea value={reply} onChange={(e) => setReply(e.target.value)} rows={3} placeholder="Réponse visible dans l'espace client + envoyée par email..." className="mb-3" />
                <Button type="submit" disabled={!reply.trim()}><Send className="h-4 w-4" />Envoyer</Button>
              </form>
            </>
          )}
        </div>
      </div>
    </AdminPage>
  );
}
