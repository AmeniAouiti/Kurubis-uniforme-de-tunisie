"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  shopFilterTree,
  countForFilter,
  type ShopFilterNode,
} from "@/lib/data/shop-filters";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

function FilterNode({
  node,
  products,
  activeSlug,
  depth = 0,
}: {
  node: ShopFilterNode;
  products: Product[];
  activeSlug?: string;
  depth?: number;
}) {
  const [open, setOpen] = useState(
    activeSlug === node.slug ||
      node.children?.some((c) => c.slug === activeSlug) ||
      false
  );
  const count = countForFilter(products, node);
  const hasChildren = !!node.children?.length;
  const isActive = activeSlug === node.slug;

  if (hasChildren) {
    return (
      <div>
        <div
          className="flex items-center gap-1"
          style={{ paddingLeft: `${depth * 12}px` }}
        >
          <button
            onClick={() => setOpen(!open)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg hover:bg-google-blue-50"
            aria-label={open ? "Réduire" : "Développer"}
          >
            {open ? (
              <ChevronDown className="h-3.5 w-3.5 text-muted" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 text-muted" />
            )}
          </button>
          <Link
            href={`/boutique?filtre=${node.slug}`}
            className={cn(
              "flex flex-1 items-center justify-between py-2 text-sm transition-colors hover:text-google-blue",
              depth === 0 && "font-bold uppercase tracking-wide",
              isActive && "text-google-blue font-medium"
            )}
          >
            <span>{node.label}</span>
            <span className="text-xs text-muted">({count})</span>
          </Link>
        </div>
        {open && (
          <div className="border-l border-border ml-2">
            {node.children!.map((child) => (
              <FilterNode
                key={child.slug}
                node={child}
                products={products}
                activeSlug={activeSlug}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={`/boutique?filtre=${node.slug}`}
      className={cn(
        "flex items-center justify-between py-2 text-sm transition-colors hover:text-google-blue",
        isActive ? "text-google-blue font-medium" : "text-muted"
      )}
      style={{ paddingLeft: `${depth * 12 + 16}px` }}
    >
      <span>{node.label}</span>
      <span className="text-xs">({count})</span>
    </Link>
  );
}

export function ShopSidebar({
  products,
  activeFilter,
}: {
  products: Product[];
  activeFilter?: string;
}) {
  const newProducts = products.filter((p) => p.isNew).slice(0, 4);

  return (
    <aside className="w-full lg:w-72 shrink-0 space-y-6">
      <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
        <Link
          href="/boutique"
          className="mb-4 flex items-center gap-1 text-sm font-medium text-google-blue hover:underline"
        >
          Voir toutes les catégories
          <ChevronRight className="h-4 w-4" />
        </Link>

        {shopFilterTree.map((node) => (
          <FilterNode
            key={node.slug}
            node={node}
            products={products}
            activeSlug={activeFilter}
          />
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-google-blue">
          Nouveaux produits
        </h3>
        <ul className="space-y-3">
          {newProducts.map((p) => (
            <li key={p.id}>
              <Link
                href={`/produits/${p.slug}`}
                className="flex items-center gap-3 group"
              >
                <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-lg bg-surface">
                  <Image src={p.image} alt={p.name} fill className="object-cover" sizes="48px" />
                </div>
                <span className="text-xs font-medium leading-tight group-hover:text-google-blue line-clamp-2">
                  {p.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
