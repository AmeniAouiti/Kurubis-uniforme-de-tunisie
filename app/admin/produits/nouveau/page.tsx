"use client";

import { AdminPage } from "@/components/admin/admin-page";
import { ProductForm } from "@/components/admin/product-form";

export default function AdminNouveauProduitPage() {
  return (
    <AdminPage title="Nouvel article">
      <ProductForm />
    </AdminPage>
  );
}
