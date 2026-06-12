"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { AdminPage } from "@/components/admin/admin-page";
import { ProductForm } from "@/components/admin/product-form";
import { useCms } from "@/contexts/cms-context";

export default function AdminEditProduitPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { getProductById } = useCms();
  const product = getProductById(id);

  if (!product) notFound();

  return (
    <AdminPage title={`Modifier : ${product.name}`}>
      <ProductForm product={product} />
    </AdminPage>
  );
}
