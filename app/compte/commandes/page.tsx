"use client";

import { AccountPage } from "@/components/account/account-page";
import { Package } from "lucide-react";

const orders = [
  { id: "CMD-2026-003", date: "10 juin 2026", status: "En préparation", total: "—" },
  { id: "CMD-2026-002", date: "28 mai 2026", status: "Expédiée", total: "—" },
  { id: "CMD-2026-001", date: "15 mai 2026", status: "Livrée", total: "—" },
];

export default function CommandesPage() {
  return (
    <AccountPage title="Commandes" breadcrumb="Commandes">
      <div className="rounded-2xl border border-border bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface border-b border-border">
            <tr>
              <th className="px-5 py-3 text-left font-semibold">N° commande</th>
              <th className="px-5 py-3 text-left font-semibold hidden sm:table-cell">Date</th>
              <th className="px-5 py-3 text-left font-semibold">Statut</th>
              <th className="px-5 py-3 text-right font-semibold hidden sm:table-cell">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-google-blue-50/50 transition-colors">
                <td className="px-5 py-4 font-medium">{order.id}</td>
                <td className="px-5 py-4 text-muted hidden sm:table-cell">{order.date}</td>
                <td className="px-5 py-4">
                  <span className="inline-flex rounded-full bg-google-blue-light px-3 py-1 text-xs font-medium text-google-blue-dark">
                    {order.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-right hidden sm:table-cell">
                  <button className="text-google-blue hover:underline text-xs font-medium">Voir détails</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <div className="py-16 text-center text-muted">
            <Package className="h-10 w-10 mx-auto mb-3 text-border" />
            Aucune commande pour le moment.
          </div>
        )}
      </div>
    </AccountPage>
  );
}
