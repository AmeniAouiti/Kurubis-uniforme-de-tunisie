"use client";

import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil } from "lucide-react";
import { AdminPage } from "@/components/admin/admin-page";
import { Button } from "@/components/ui/button";
import { useCms } from "@/contexts/cms-context";
import { Badge } from "@/components/ui/badge";

export default function AdminProduitsPage() {
  const { products } = useCms();

  return (
    <AdminPage title="Articles / Produits">
      <div className="flex justify-end mb-6">
        <Link href="/admin/produits/nouveau">
          <Button>
            <Plus className="h-4 w-4" />
            Nouvel article
          </Button>
        </Link>
      </div>

      <div className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Produit</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">SKU</th>
                <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Catégories</th>
                <th className="text-left px-4 py-3 font-medium">Statut</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-border last:border-0 hover:bg-google-blue-50/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-10 shrink-0 overflow-hidden rounded-lg bg-surface">
                        <Image src={product.image} alt="" fill className="object-cover" sizes="40px" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium truncate">{product.name}</p>
                        <p className="text-xs text-muted truncate">/produits/{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted hidden md:table-cell">{product.sku}</td>
                  <td className="px-4 py-3 text-muted hidden lg:table-cell">
                    {product.categories.slice(0, 2).join(", ")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {product.isNew && <Badge variant="new">Nouveau</Badge>}
                      {product.isBestSeller && <Badge>Top vente</Badge>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/produits/${product.id}`}
                      className="inline-flex items-center gap-1 text-google-blue hover:underline"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Modifier
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminPage>
  );
}
