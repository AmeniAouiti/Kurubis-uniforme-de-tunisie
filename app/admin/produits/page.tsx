"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { Plus, Search, X } from "lucide-react";
import { AdminPage } from "@/components/admin/admin-page";
import { ProductRowMenu } from "@/components/admin/product-row-menu";
import { getMetierLabel } from "@/components/admin/metier-multi-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCms } from "@/contexts/cms-context";
import { Badge } from "@/components/ui/badge";
import { categories } from "@/lib/data/categories";
import { metiersConfig } from "@/lib/data/metiers-config";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

type VisibilityFilter = "all" | "visible" | "hidden";
type StatusFilter = "all" | "new" | "bestseller";

function matchesSearch(product: Product, query: string) {
  if (!query.trim()) return true;
  const q = query.trim().toLowerCase();
  return (
    product.name.toLowerCase().includes(q) ||
    product.sku.toLowerCase().includes(q) ||
    product.slug.toLowerCase().includes(q) ||
    product.description.toLowerCase().includes(q) ||
    product.tags.some((t) => t.toLowerCase().includes(q))
  );
}

export default function AdminProduitsPage() {
  const { products } = useCms();
  const [search, setSearch] = useState("");
  const [metierFilter, setMetierFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [visibilityFilter, setVisibilityFilter] = useState<VisibilityFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filtered = useMemo(() => {
    return products.filter((product) => {
      if (!matchesSearch(product, search)) return false;
      if (metierFilter && !product.metiers.includes(metierFilter)) return false;
      if (categoryFilter && !product.categories.includes(categoryFilter)) return false;

      const visible = product.isVisible !== false;
      if (visibilityFilter === "visible" && !visible) return false;
      if (visibilityFilter === "hidden" && visible) return false;

      if (statusFilter === "new" && !product.isNew) return false;
      if (statusFilter === "bestseller" && !product.isBestSeller) return false;

      return true;
    });
  }, [products, search, metierFilter, categoryFilter, visibilityFilter, statusFilter]);

  const hasActiveFilters =
    search.trim() !== "" ||
    metierFilter !== "" ||
    categoryFilter !== "" ||
    visibilityFilter !== "all" ||
    statusFilter !== "all";

  function resetFilters() {
    setSearch("");
    setMetierFilter("");
    setCategoryFilter("");
    setVisibilityFilter("all");
    setStatusFilter("all");
  }

  const selectClass =
    "w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm outline-none focus:border-google-blue";

  return (
    <AdminPage title="Articles / Produits">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <p className="text-sm text-muted">
          {filtered.length} article{filtered.length > 1 ? "s" : ""}
          {hasActiveFilters && products.length !== filtered.length && (
            <span> sur {products.length}</span>
          )}
        </p>
        <Link href="/admin/produits/nouveau">
          <Button>
            <Plus className="h-4 w-4" />
            Nouvel article
          </Button>
        </Link>
      </div>

      <div className="mb-4 rounded-2xl border border-border bg-white p-4 shadow-sm space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, SKU, slug ou tag..."
            className="pl-10"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">Métier</label>
            <select
              value={metierFilter}
              onChange={(e) => setMetierFilter(e.target.value)}
              className={selectClass}
            >
              <option value="">Tous les métiers</option>
              {metiersConfig.map((m) => (
                <option key={m.slug} value={m.slug}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-muted">Catégorie</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className={selectClass}
            >
              <option value="">Toutes les catégories</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-muted">Visibilité</label>
            <select
              value={visibilityFilter}
              onChange={(e) => setVisibilityFilter(e.target.value as VisibilityFilter)}
              className={selectClass}
            >
              <option value="all">Tous</option>
              <option value="visible">Visibles</option>
              <option value="hidden">Masqués</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-muted">Statut</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className={selectClass}
            >
              <option value="all">Tous</option>
              <option value="new">Nouveautés</option>
              <option value="bestseller">Top vente</option>
            </select>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 text-sm text-google-blue hover:underline"
            >
              <X className="h-3.5 w-3.5" />
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Produit</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">SKU</th>
                <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Métiers</th>
                <th className="text-left px-4 py-3 font-medium hidden xl:table-cell">Catégories</th>
                <th className="text-left px-4 py-3 font-medium">Statut</th>
                <th className="text-right px-4 py-3 font-medium w-16">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm text-muted">
                    Aucun article. Cliquez sur « Nouvel article » pour commencer.
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm text-muted">
                    Aucun article ne correspond à votre recherche.
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="mt-2 block w-full text-google-blue hover:underline"
                    >
                      Réinitialiser les filtres
                    </button>
                  </td>
                </tr>
              ) : (
              filtered.map((product) => {
                const visible = product.isVisible !== false;
                return (
                <tr
                  key={product.id}
                  className={cn(
                    "border-b border-border last:border-0 hover:bg-google-blue-50/50",
                    !visible && "opacity-60 bg-surface/40"
                  )}
                >
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
                    {product.metiers.length > 0
                      ? product.metiers.map(getMetierLabel).join(", ")
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-muted hidden xl:table-cell">
                    {product.categories.length > 0
                      ? product.categories.join(", ")
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {!visible && (
                        <Badge className="bg-surface text-muted border border-border">Masqué</Badge>
                      )}
                      {product.isNew && <Badge variant="new">Nouveau</Badge>}
                      {product.isBestSeller && <Badge>Top vente</Badge>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <ProductRowMenu product={product} />
                  </td>
                </tr>
              );
              })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminPage>
  );
}
