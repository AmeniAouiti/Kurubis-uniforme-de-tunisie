"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Package } from "lucide-react";

export default function SuiviCommandePage() {
  return (
    <>
      <PageHeader
        title="Suivi commande"
        description="Suivez l'état de votre commande en temps réel"
        breadcrumb="Accueil / Suivi commande"
      />
      <div className="mx-auto max-w-md px-4 py-12">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="rounded-2xl border border-border bg-white p-8 shadow-sm text-center"
        >
          <Package className="h-12 w-12 text-google-blue mx-auto mb-4" />
          <h2 className="text-lg font-bold mb-2">Suivre ma commande</h2>
          <p className="text-sm text-muted mb-6">
            Entrez votre numéro de commande pour connaître son statut
          </p>
          <Input
            name="orderId"
            placeholder="Ex: CMD-2026-001"
            className="mb-4"
          />
          <Button type="submit" className="w-full">
            <Search className="h-4 w-4" />
            Rechercher
          </Button>
        </form>
      </div>
    </>
  );
}
