"use client";

import { AdminPage } from "@/components/admin/admin-page";
import { CatalogForm } from "@/components/admin/catalog-form";

export default function AdminNouveauCataloguePage() {
  return (
    <AdminPage title="Nouveau catalogue">
      <CatalogForm />
    </AdminPage>
  );
}
