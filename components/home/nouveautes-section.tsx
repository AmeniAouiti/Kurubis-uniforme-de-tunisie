import Link from "next/link";
import { ProductCarousel } from "@/components/home/product-carousel";
import type { Product } from "@/types";

export function NouveautesSection({ products }: { products: Product[] }) {
  return (
    <section className="py-20 bg-surface">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-google-blue mb-2">
              Nouvelle collection
            </p>
            <h2 className="text-2xl font-bold md:text-3xl tracking-tight">Nouveautés</h2>
            <p className="mt-2 text-sm text-muted">Découvrez nos dernières arrivées</p>
          </div>
          <Link
            href="/boutique?filter=new"
            className="text-sm font-medium text-google-blue hover:underline underline-offset-4 transition-all"
          >
            Voir tout →
          </Link>
        </div>
        <ProductCarousel products={products} />
      </div>
    </section>
  );
}
