"use client";

import Link from "next/link";
import type { Product } from "@/types";
import { getProductFilterLinks } from "@/lib/product-filters";

export function ProductFilterTags({
  product,
  max = 3,
}: {
  product: Product;
  max?: number;
}) {
  const links = getProductFilterLinks(product).slice(0, max);

  if (links.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1">
      {links.map((link) => (
        <Link
          key={link.slug}
          href={link.href}
          onClick={(e) => e.stopPropagation()}
          className="rounded-md bg-google-blue-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-google-blue hover:bg-google-blue-light transition-colors"
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
