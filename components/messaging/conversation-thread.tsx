"use client";

import { Package } from "lucide-react";
import type { Conversation } from "@/lib/platform/types";
import { formatDate } from "@/lib/platform/format";
import { StatusBadge } from "@/components/admin/status-badge";
import { cn } from "@/lib/utils";

export function ConversationThread({
  conversation,
  viewer,
}: {
  conversation: Conversation;
  viewer: "client" | "admin";
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {conversation.type === "devis" && (
          <span className="inline-flex items-center rounded-full bg-google-blue-light px-2.5 py-0.5 text-xs font-semibold text-google-blue">
            Demande de devis
          </span>
        )}
        {conversation.source === "landing" && (
          <span className="inline-flex items-center rounded-full bg-surface border border-border px-2.5 py-0.5 text-xs font-medium text-muted">
            Site public
          </span>
        )}
        {conversation.type === "devis" && (
          <StatusBadge status={conversation.quoteStatus} />
        )}
      </div>

      {conversation.quoteItems.length > 0 && (
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2 bg-surface text-sm font-medium">
            <Package className="h-4 w-4 text-google-blue" />
            Articles demandés ({conversation.quoteItems.length})
          </div>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-border">
              {conversation.quoteItems.map((item, i) => (
                <tr key={i}>
                  <td className="px-4 py-2">{item.productName}</td>
                  <td className="px-4 py-2 text-muted">{item.sku}</td>
                  <td className="px-4 py-2 text-right font-medium">×{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="space-y-3">
        {conversation.thread.map((msg) => {
          const isOwn =
            (viewer === "client" && msg.sender === "client") ||
            (viewer === "admin" && msg.sender === "admin");
          return (
            <div
              key={msg.id}
              className={cn("flex", isOwn ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-3",
                  msg.sender === "admin"
                    ? "bg-google-blue text-white rounded-br-sm"
                    : "bg-surface border border-border rounded-bl-sm"
                )}
              >
                <p className="text-xs font-medium mb-1 opacity-80">
                  {msg.sender === "admin" ? "Kurubis — Équipe commerciale" : conversation.clientName}
                </p>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.body}</p>
                <p
                  className={cn(
                    "text-[10px] mt-2",
                    msg.sender === "admin" ? "text-white/70" : "text-muted"
                  )}
                >
                  {formatDate(msg.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
