"use client";

import { AccountPage } from "@/components/account/account-page";
import { Tag } from "lucide-react";

const offers = [
  { id: "DEV-2026-012", title: "Lot 50 combinaisons industrie", status: "En attente", date: "9 juin 2026" },
  { id: "DEV-2026-008", title: "Parkas haute visibilité x20", status: "Acceptée", date: "20 mai 2026" },
];

export default function OffresPage() {
  return (
    <AccountPage title="Mes offres" breadcrumb="Mes offres">
      <div className="space-y-3">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="flex items-center gap-4 rounded-2xl border border-border bg-white p-5"
          >
            <Tag className="h-5 w-5 text-google-blue shrink-0" />
            <div className="flex-1">
              <p className="font-medium">{offer.title}</p>
              <p className="text-xs text-muted">{offer.id} — {offer.date}</p>
            </div>
            <span className="rounded-full bg-google-blue-light px-3 py-1 text-xs font-medium text-google-blue-dark">
              {offer.status}
            </span>
          </div>
        ))}
      </div>
    </AccountPage>
  );
}
