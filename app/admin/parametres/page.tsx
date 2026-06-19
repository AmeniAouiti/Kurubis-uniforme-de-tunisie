"use client";

import { AdminPage } from "@/components/admin/admin-page";
import { useCms } from "@/contexts/cms-context";
import { contactInfo } from "@/lib/data/navigation";
import { BRAND } from "@/lib/brand";

export default function AdminParametresPage() {
  const { products, catalogs } = useCms();

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
          <p className="text-sm text-muted">
            {products.length} articles et {catalogs.length} catalogues publiés dans PostgreSQL (Supabase).
            Images et PDF stockés sur Cloudinary.
          </p>
        </section>
      </div>
    </AdminPage>
  );
}
