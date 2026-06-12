"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { AdminPage } from "@/components/admin/admin-page";
import { CatalogForm } from "@/components/admin/catalog-form";
import { useCms } from "@/contexts/cms-context";

export default function AdminEditCataloguePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const catalog = useCms().catalogs.find((c) => c.id === id);

  if (!catalog) notFound();

  return (
    <AdminPage title={`Modifier : ${catalog.title}`}>
      <CatalogForm catalog={catalog} />
    </AdminPage>
  );
}
