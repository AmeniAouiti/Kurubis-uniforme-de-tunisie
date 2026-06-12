import Link from "next/link";
import { ProductCarousel } from "@/components/home/product-carousel";
import type { Product } from "@/types";

export function NouveautesSection({ products }: { products: Product[] }) {
  return (
    <section className="py-16 bg-surface">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold uppercase tracking-wide border-b-2 border-google-blue pb-2 inline-block">
              Nouveautés
            </h2>
            <p className="mt-2 text-sm text-muted">Découvrez nos dernières arrivées</p>
          </div>
          <Link
            href="/boutique?filter=new"
            className="text-sm font-medium text-google-blue hover:underline"
          >
            Voir tout →
          </Link>
        </div>
        <ProductCarousel products={products} />
      </div>
    </section>
  );
}
