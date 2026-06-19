"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MessageSquare, Plus, Send, FileText, ShoppingBag } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useCart } from "@/contexts/cart-context";
import { useConversations } from "@/hooks/use-conversations";
import { useSocket } from "@/hooks/use-socket";
import { ConversationThread } from "@/components/messaging/conversation-thread";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/platform/format";
import { StatusBadge } from "@/components/admin/status-badge";
import { cn } from "@/lib/utils";

export function UserConversations() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const { items: cartItems } = useCart();
  const { conversations, loading, fetchError, refresh } = useConversations();
  const { socket } = useSocket();

  const [selectedId, setSelectedId] = useState("");
  const [reply, setReply] = useState("");
  const [showNewDevis, setShowNewDevis] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const selected = conversations.find((c) => c.id === selectedId);

  function handleSelect(id: string) {
    setSelectedId(id);
    setReply("");
  }

  useEffect(() => {
    const paramId = searchParams.get("c");
    if (paramId) setSelectedId(paramId);
    else if (conversations[0] && !selectedId) setSelectedId(conversations[0].id);
  }, [searchParams, conversations, selectedId]);

  useEffect(() => {
    if (!socket || !selectedId) return;
    socket.emit("join-conversation", { conversationId: selectedId });
  }, [socket, selectedId]);

  useEffect(() => {
    if (selected?.unreadByClient) {
      fetch(`/api/conversations/${selected.id}/read`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ as: "client" }),
      }).then(() => refresh());
    }
  }, [selected?.id, selected?.unreadByClient, refresh]);

  async function handleSendReply(e: React.FormEvent) {
    e.preventDefault();
    if (!selected || !reply.trim()) return;
    setSending(true);
    await fetch(`/api/conversations/${selected.id}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: reply.trim() }),
    });
    setReply("");
    setSending(false);
    refresh();
  }

  async function handleNewDevis(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !newMessage.trim()) return;
    setSending(true);

    const quoteItems = cartItems.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      sku: item.product.sku,
      quantity: item.quantity,
    }));

    const res = await fetch("/api/quotes/account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientName: `${user.firstName} ${user.lastName}`,
        clientEmail: user.email,
        company: user.company,
        subject: newSubject.trim() || `Devis — ${quoteItems.length || 0} article(s)`,
        message: newMessage.trim(),
        items: quoteItems,
      }),
    });

    const data = await res.json();
    setSending(false);

    if (!res.ok) {
      const hint = data.hint || "";
      setError(
        data.error?.includes("conversations")
          ? "Tables Supabase manquantes. Exécutez supabase/setup-messaging.sql dans Supabase SQL Editor."
          : data.error || hint || "Erreur lors de l'envoi."
      );
      return;
    }

    setError("");
    setShowNewDevis(false);
    setNewMessage("");
    setNewSubject("");
    if (data.conversationId) setSelectedId(data.conversationId);
    await refresh();
  }

  if (loading) {
    return <p className="text-sm text-muted py-8 text-center">Chargement des conversations...</p>;
  }

  const unreadTotal = conversations.filter((c) => c.unreadByClient).length;

  return (
    <div className="space-y-4">
      {fetchError && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-900">
          <p className="font-medium">Configuration base de données</p>
          <p className="mt-1">{fetchError}</p>
          <p className="mt-2 text-xs opacity-80">
            Supabase → <strong>Connect</strong> → <strong>Session pooler</strong> → copiez l&apos;URI dans{" "}
            <code className="bg-amber-100 px-1 rounded">DATABASE_URL</code> (.env.local), ou définissez{" "}
            <code className="bg-amber-100 px-1 rounded">SUPABASE_DB_REGION</code> (ex. eu-west-1)
          </p>
        </div>
      )}
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          {conversations.length} conversation(s)
          {unreadTotal > 0 && <span className="ml-2 text-google-blue font-medium">· {unreadTotal} réponse(s)</span>}
        </p>
        <Button size="sm" onClick={() => { setShowNewDevis(true); setSelectedId(""); }}>
          <Plus className="h-4 w-4" />
          Nouvelle demande de devis
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-5 min-h-[520px]">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-white shadow-sm overflow-hidden flex flex-col">
          <ul className="overflow-y-auto flex-1 divide-y divide-border">
            {conversations.length === 0 ? (
              <li className="p-8 text-center text-sm text-muted">Aucune conversation</li>
            ) : (
              conversations.map((conv) => (
                <li key={conv.id}>
                  <button
                    type="button"
                    onClick={() => { handleSelect(conv.id); setShowNewDevis(false); }}
                    className={cn(
                      "w-full text-left px-4 py-4 hover:bg-google-blue-50/50",
                      selectedId === conv.id && !showNewDevis && "bg-google-blue-light/60 border-l-2 border-google-blue"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      {conv.type === "devis" ? <FileText className="h-4 w-4 text-google-blue mt-1" /> : <MessageSquare className="h-4 w-4 text-google-blue mt-1" />}
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate">{conv.subject}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <p className="text-xs text-muted">{formatDate(conv.updatedAt)}</p>
                          {conv.type === "devis" && (
                            <StatusBadge status={conv.quoteStatus} className="scale-90 origin-left" />
                          )}
                          {conv.source === "landing" && (
                            <span className="text-[10px] text-muted">Site public</span>
                          )}
                        </div>
                        {conv.unreadByClient && <span className="inline-block h-2 w-2 rounded-full bg-google-blue mt-1" />}
                      </div>
                    </div>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="lg:col-span-3 rounded-2xl border border-border bg-white shadow-sm flex flex-col">
          {showNewDevis ? (
            <div className="p-6">
              <h3 className="font-semibold text-lg mb-4">Nouvelle demande de devis</h3>
              {cartItems.length > 0 && (
                <div className="mb-4 rounded-xl bg-google-blue-50 p-4 text-sm">
                  <ShoppingBag className="h-4 w-4 inline text-google-blue mr-1" />
                  {cartItems.length} article(s) du panier inclus
                  <Link href="/panier" className="block text-google-blue text-xs mt-1">Modifier →</Link>
                </div>
              )}
              <form onSubmit={handleNewDevis} className="space-y-4">
                <Input value={newSubject} onChange={(e) => setNewSubject(e.target.value)} placeholder="Objet (optionnel)" />
                <Textarea value={newMessage} onChange={(e) => setNewMessage(e.target.value)} rows={5} required placeholder="Votre message..." />
                <div className="flex gap-2">
                  <Button type="submit" disabled={sending}><Send className="h-4 w-4" />Envoyer</Button>
                  <Button type="button" variant="outline" onClick={() => setShowNewDevis(false)}>Annuler</Button>
                </div>
              </form>
            </div>
          ) : !selected ? (
            <div className="flex flex-1 items-center justify-center text-muted text-sm p-8">Sélectionnez une conversation</div>
          ) : (
            <>
              <div className="p-5 border-b border-border">
                <h3 className="font-semibold">{selected.subject}</h3>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  {selected.type === "devis" && <StatusBadge status={selected.quoteStatus} />}
                  {selected.source === "landing" && (
                    <span className="text-xs text-muted rounded-full border border-border px-2 py-0.5">Via site public</span>
                  )}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-5">
                <ConversationThread conversation={selected} viewer="client" />
              </div>
              <form onSubmit={handleSendReply} className="p-4 border-t border-border">
                <Textarea value={reply} onChange={(e) => setReply(e.target.value)} rows={3} placeholder="Votre message..." className="mb-3" />
                <Button type="submit" disabled={sending || !reply.trim()}><Send className="h-4 w-4" />Envoyer</Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
