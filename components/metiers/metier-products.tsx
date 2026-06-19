"use client";

import { useMemo } from "react";
import { CmsImage } from "@/components/ui/cms-image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ProductGrid } from "@/components/product/product-grid";
import { useCms } from "@/contexts/cms-context";
import {
  getCategoryFiltersForMetier,
  getMetierConfig,
  type MetierFilter,
} from "@/lib/data/metiers-config";
import { getCategoryBySlug } from "@/lib/data/categories";
import { cn } from "@/lib/utils";

function FilterCard({
  href,
  label,
  image,
  active,
}: {
  href: string;
  label: string;
  image?: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex shrink-0 flex-col items-center gap-2 rounded-2xl border p-3 w-28 transition-all hover:border-google-blue/40 hover:shadow-md",
        active ? "border-google-blue bg-google-blue-light shadow-sm" : "border-border bg-white"
      )}
    >
      <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-surface">
        {image ? (
          <CmsImage src={image} alt="" fill className="object-cover" sizes="64px" />
        ) : (
          <div className="flex h-full items-center justify-center text-[10px] text-center text-muted px-1">
            {label.slice(0, 12)}
          </div>
        )}
      </div>
      <span className="text-[11px] font-medium text-center leading-tight line-clamp-2">{label}</span>
    </Link>
  );
}

export function MetierProducts({ metierSlug }: { metierSlug: string }) {
  const searchParams = useSearchParams();
  const categorie = searchParams.get("categorie");
  const sousMetier = searchParams.get("sous-metier");
  const { products, hydrated } = useCms();
  const config = getMetierConfig(metierSlug);

  const metierProducts = useMemo(() => {
    return products.filter((p) => p.metiers.includes(metierSlug));
  }, [products, metierSlug]);

  const filtered = useMemo(() => {
    let list = metierProducts;
    if (categorie) list = list.filter((p) => p.categories.includes(categorie));
    if (sousMetier) {
      list = list.filter((p) => (p.metierSubcategories || []).includes(sousMetier));
    }
    return list;
  }, [metierProducts, categorie, sousMetier]);

  const categoryFilters = getCategoryFiltersForMetier(metierSlug);
  const subFilters = config?.filters?.filter((f) => f.type === "sub") ?? [];
  const allFilters: MetierFilter[] = [...categoryFilters, ...subFilters];

  function filterImage(filter: MetierFilter): string | undefined {
    const match = metierProducts.find((p) => {
      if (filter.type === "category") return p.categories.includes(filter.slug);
      return (p.metierSubcategories || []).includes(filter.slug);
    });
    return match?.image;
  }

  function filterHref(filter: MetierFilter) {
    const param = filter.type === "category" ? "categorie" : "sous-metier";
    return `/metiers/${metierSlug}?${param}=${filter.slug}`;
  }

  const activeFilter = categorie || sousMetier;

  if (!hydrated) {
    return <p className="text-sm text-muted py-8">Chargement...</p>;
  }

  return (
    <div className="space-y-8">
      {allFilters.length > 0 && (
        <div>
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
              Filtrer par type de vêtement
            </h2>
            {activeFilter && (
              <Link
                href={`/metiers/${metierSlug}`}
                className="text-sm text-google-blue hover:underline"
              >
                Tout afficher
              </Link>
            )}
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
            {allFilters.map((filter) => (
              <FilterCard
                key={`${filter.type}-${filter.slug}-${filter.label}`}
                href={filterHref(filter)}
                label={filter.label}
                image={filterImage(filter)}
                active={
                  (filter.type === "category" && categorie === filter.slug) ||
                  (filter.type === "sub" && sousMetier === filter.slug)
                }
              />
            ))}
          </div>
        </div>
      )}

      {activeFilter && (
        <p className="text-sm text-muted">
          Filtre actif :{" "}
          <strong className="text-foreground">
            {allFilters.find(
              (f) =>
                (f.type === "category" && f.slug === categorie) ||
                (f.type === "sub" && f.slug === sousMetier)
            )?.label ||
              getCategoryBySlug(categorie || "")?.name ||
              sousMetier}
          </strong>
        </p>
      )}

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-border bg-white p-12 text-center">
          <p className="text-lg font-semibold mb-2">Aucun article disponible pour le moment</p>
          <p className="text-sm text-muted max-w-md mx-auto mb-6">
            {metierProducts.length === 0
              ? `Les tenues pour le secteur « ${config?.name} » seront bientôt disponibles. Contactez-nous pour une demande sur mesure.`
              : "Aucun produit ne correspond à ce filtre. Essayez une autre catégorie ou consultez l'ensemble de la sélection."}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {activeFilter && (
              <Link
                href={`/metiers/${metierSlug}`}
                className="inline-flex rounded-full border border-border px-6 py-2.5 text-sm font-medium hover:border-google-blue/40"
              >
                Voir tout le métier
              </Link>
            )}
            <Link
              href="/boutique"
              className="inline-flex rounded-full bg-google-blue px-6 py-2.5 text-sm font-semibold text-white hover:bg-google-blue-dark"
            >
              Vêtements de travail
            </Link>
            <Link
              href="/contact"
              className="inline-flex rounded-full border border-google-blue px-6 py-2.5 text-sm font-medium text-google-blue hover:bg-google-blue-light"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted">
            {filtered.length} produit{filtered.length > 1 ? "s" : ""}
          </p>
          <ProductGrid products={filtered} />
        </>
      )}
    </div>
  );
}
