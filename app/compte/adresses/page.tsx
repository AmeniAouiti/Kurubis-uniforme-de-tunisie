"use client";

import { AccountPage } from "@/components/account/account-page";
import { Button } from "@/components/ui/button";
import { MapPin, Plus } from "lucide-react";

const addresses = [
  { type: "Livraison", line: "RUE SFAX KORBA NABEUL 8070", default: true },
  { type: "Facturation", line: "RUE SFAX KORBA NABEUL 8070", default: false },
];

export default function AdressesPage() {
  return (
    <AccountPage title="Adresses" breadcrumb="Adresses">
      <div className="flex justify-end mb-4">
        <Button size="sm">
          <Plus className="h-4 w-4" />
          Ajouter une adresse
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {addresses.map((addr) => (
          <div key={addr.type} className="rounded-2xl border border-border bg-white p-5">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-4 w-4 text-google-blue" />
              <span className="font-semibold">{addr.type}</span>
              {addr.default && (
                <span className="rounded-full bg-google-blue-light px-2 py-0.5 text-[10px] font-medium text-google-blue-dark">
                  Par défaut
                </span>
              )}
            </div>
            <p className="text-sm text-muted">{addr.line}</p>
            <button className="mt-3 text-sm text-google-blue hover:underline">Modifier</button>
          </div>
        ))}
      </div>
    </AccountPage>
  );
}
