"use client";

import { AdminPage } from "@/components/admin/admin-page";
import { Button } from "@/components/ui/button";
import { useCms } from "@/contexts/cms-context";
import { contactInfo } from "@/lib/data/navigation";
import { BRAND } from "@/lib/brand";
import { RotateCcw } from "lucide-react";

export default function AdminParametresPage() {
  const { resetToDefaults, products, catalogs } = useCms();

  function handleReset() {
    if (
      confirm(
        "Réinitialiser toutes les données aux valeurs par défaut ? Cette action est irréversible."
      )
    ) {
      resetToDefaults();
    }
  }

  return (
    <AdminPage title="Paramètres de la plateforme">
      <div className="space-y-6">
        <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <h2 className="font-semibold mb-4">Informations générales</h2>
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted">Marque</dt>
              <dd className="font-medium">{BRAND.name}</dd>
            </div>
            <div>
              <dt className="text-muted">Email</dt>
              <dd className="font-medium">{contactInfo.email}</dd>
            </div>
            <div>
              <dt className="text-muted">Téléphone</dt>
              <dd className="font-medium">{contactInfo.phones[0]}</dd>
            </div>
            <div>
              <dt className="text-muted">Adresse</dt>
              <dd className="font-medium">{contactInfo.address}</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <h2 className="font-semibold mb-2">Données du site</h2>
          <p className="text-sm text-muted mb-4">
            {products.length} articles et {catalogs.length} catalogues sont actuellement publiés.
            Les modifications sont sauvegardées localement dans votre navigateur.
          </p>
          <Button variant="outline" onClick={handleReset} className="text-red-600 border-red-200 hover:bg-red-50">
            <RotateCcw className="h-4 w-4" />
            Réinitialiser aux données par défaut
          </Button>
        </section>

      </div>
    </AdminPage>
  );
}
