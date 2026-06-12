"use client";

import { useState } from "react";
import { Mail, Phone, Trash2, UserCheck, UserX } from "lucide-react";
import { AdminPage } from "@/components/admin/admin-page";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { usePlatform } from "@/contexts/platform-context";
import { formatDate, formatDateShort } from "@/lib/platform/format";
import type { ClientStatus } from "@/lib/platform/types";
import { cn } from "@/lib/utils";

export default function AdminClientsPage() {
  const { clients, updateClientStatus, deleteClient, activeClientsCount } = usePlatform();
  const [selectedId, setSelectedId] = useState(clients[0]?.id ?? "");
  const [filter, setFilter] = useState<"all" | ClientStatus>("all");

  const filtered =
    filter === "all" ? clients : clients.filter((c) => c.status === filter);
  const selected = clients.find((c) => c.id === selectedId);

  return (
    <AdminPage
      title="Gestion des clients"
      subtitle={`${activeClientsCount} client(s) actif(s) · Inscriptions et connexions à la plateforme`}
    >
      <div className="flex gap-2 mb-6">
        {(["all", "actif", "inactif"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium border transition-colors",
              filter === f
                ? "border-google-blue bg-google-blue text-white"
                : "border-border hover:border-google-blue/40"
            )}
          >
            {f === "all" ? "Tous" : f === "actif" ? "Actifs" : "Inactifs"}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5 min-h-[480px]">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
          <ul className="divide-y divide-border max-h-[600px] overflow-y-auto">
            {filtered.length === 0 ? (
              <li className="p-8 text-center text-sm text-muted">Aucun client</li>
            ) : (
              filtered.map((client) => (
                <li key={client.id}>
                  <button
                    onClick={() => setSelectedId(client.id)}
                    className={cn(
                      "w-full text-left px-4 py-4 hover:bg-google-blue-50/50 transition-colors",
                      selectedId === client.id && "bg-google-blue-light/60 border-l-2 border-google-blue"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-google-blue-light text-google-blue font-semibold text-sm">
                        {client.firstName[0]}
                        {client.lastName[0]}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-medium text-sm truncate">
                            {client.firstName} {client.lastName}
                          </p>
                          <StatusBadge status={client.status} />
                        </div>
                        <p className="text-xs text-muted truncate">{client.email}</p>
                      </div>
                    </div>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="lg:col-span-3 rounded-2xl border border-border bg-white shadow-sm p-6">
          {!selected ? (
            <div className="flex h-full items-center justify-center text-muted text-sm">
              Sélectionnez un client
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-blue text-white text-xl font-bold">
                  {selected.firstName[0]}
                  {selected.lastName[0]}
                </div>
                <div>
                  <h2 className="text-xl font-semibold">
                    {selected.firstName} {selected.lastName}
                  </h2>
                  {selected.company && (
                    <p className="text-muted">{selected.company}</p>
                  )}
                  <div className="mt-2">
                    <StatusBadge status={selected.status} />
                  </div>
                </div>
              </div>

              <dl className="grid gap-4 sm:grid-cols-2 text-sm">
                <div className="rounded-xl bg-surface p-4">
                  <dt className="text-muted text-xs mb-1">Email</dt>
                  <dd>
                    <a href={`mailto:${selected.email}`} className="flex items-center gap-1.5 text-google-blue hover:underline">
                      <Mail className="h-3.5 w-3.5" />
                      {selected.email}
                    </a>
                  </dd>
                </div>
                {selected.phone && (
                  <div className="rounded-xl bg-surface p-4">
                    <dt className="text-muted text-xs mb-1">Téléphone</dt>
                    <dd>
                      <a href={`tel:${selected.phone.replace(/\s/g, "")}`} className="flex items-center gap-1.5 hover:text-google-blue">
                        <Phone className="h-3.5 w-3.5" />
                        {selected.phone}
                      </a>
                    </dd>
                  </div>
                )}
                <div className="rounded-xl bg-surface p-4">
                  <dt className="text-muted text-xs mb-1">Inscription</dt>
                  <dd className="font-medium">{formatDateShort(selected.createdAt)}</dd>
                </div>
                <div className="rounded-xl bg-surface p-4">
                  <dt className="text-muted text-xs mb-1">Dernière connexion</dt>
                  <dd className="font-medium">
                    {selected.lastLoginAt ? formatDate(selected.lastLoginAt) : "Jamais"}
                  </dd>
                </div>
              </dl>

              <div className="flex flex-wrap gap-2 pt-2">
                {selected.status === "actif" ? (
                  <Button
                    variant="outline"
                    onClick={() => updateClientStatus(selected.id, "inactif")}
                  >
                    <UserX className="h-4 w-4" />
                    Désactiver le compte
                  </Button>
                ) : (
                  <Button onClick={() => updateClientStatus(selected.id, "actif")}>
                    <UserCheck className="h-4 w-4" />
                    Réactiver le compte
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => {
                    if (confirm("Supprimer ce client ?")) {
                      deleteClient(selected.id);
                      setSelectedId(clients.find((c) => c.id !== selected.id)?.id ?? "");
                    }
                  }}
                  className="text-red-600 ml-auto"
                >
                  <Trash2 className="h-4 w-4" />
                  Supprimer
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminPage>
  );
}
