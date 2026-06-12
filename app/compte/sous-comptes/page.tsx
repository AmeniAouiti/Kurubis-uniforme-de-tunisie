"use client";

import { AccountPage } from "@/components/account/account-page";
import { Button } from "@/components/ui/button";
import { Users, Plus } from "lucide-react";

const subAccounts = [
  { name: "Service achats", email: "achats@entreprise.tn", role: "Acheteur" },
  { name: "Service RH", email: "rh@entreprise.tn", role: "Consultation" },
];

export default function SousComptesPage() {
  return (
    <AccountPage title="Sous-comptes" breadcrumb="Sous-comptes">
      <div className="flex justify-end mb-4">
        <Button size="sm">
          <Plus className="h-4 w-4" />
          Ajouter un sous-compte
        </Button>
      </div>
      <div className="space-y-3">
        {subAccounts.map((acc) => (
          <div key={acc.email} className="flex items-center gap-4 rounded-2xl border border-border bg-white p-5">
            <Users className="h-5 w-5 text-google-blue shrink-0" />
            <div className="flex-1">
              <p className="font-medium">{acc.name}</p>
              <p className="text-sm text-muted">{acc.email}</p>
            </div>
            <span className="rounded-full bg-surface px-3 py-1 text-xs font-medium">{acc.role}</span>
          </div>
        ))}
      </div>
    </AccountPage>
  );
}
