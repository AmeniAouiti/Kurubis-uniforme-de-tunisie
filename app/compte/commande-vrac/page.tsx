"use client";

import { AccountPage } from "@/components/account/account-page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Package } from "lucide-react";

export default function CommandeVracPage() {
  return (
    <AccountPage title="Commande en vrac" breadcrumb="Commande en vrac">
      <div className="rounded-2xl border border-border bg-white p-6">
        <div className="flex items-center gap-3 mb-6">
          <Package className="h-6 w-6 text-google-blue" />
          <p className="text-sm text-muted">
            Commandez en volume pour votre entreprise. Indiquez les quantités et références souhaitées.
          </p>
        </div>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Référence produit</label>
            <Input placeholder="SKU ou nom du produit" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Quantité</label>
            <Input type="number" min={1} placeholder="Ex: 100" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Notes</label>
            <Textarea rows={4} placeholder="Tailles, coloris, personnalisation..." />
          </div>
          <Button type="submit">Soumettre la commande en vrac</Button>
        </form>
      </div>
    </AccountPage>
  );
}
