import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductActions } from "@/components/product/product-actions";
import { Badge } from "@/components/ui/badge";
import { getProductBySlug, products } from "@/lib/data/products";
import { Star } from "lucide-react";

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Produit introuvable" };
  return { title: `${product.name} — Kurubis` };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = products
    .filter((p) => p.id !== product.id && p.categories.some((c) => product.categories.includes(c)))
    .slice(0, 4);

  return (
    <>
      <PageHeader
        title={product.name}
        breadcrumb={`Accueil / Produits / ${product.name}`}
      />
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              {product.isNew && <Badge variant="new">Nouveau</Badge>}
              {product.isBestSeller && <Badge variant="sale">Top vente</Badge>}
            </div>
          </div>

          <div>
            <div className="mb-4 flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>

            <h1 className="text-2xl font-bold md:text-3xl">{product.name}</h1>

            {product.reviewCount > 0 && (
              <div className="mt-3 flex items-center gap-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.round(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-border"}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted">
                  {product.rating}/5 ({product.reviewCount} avis)
                </span>
              </div>
            )}

            <p className="mt-2 text-sm text-muted">SKU: {product.sku}</p>

            <p className="mt-6 text-muted leading-relaxed">{product.description}</p>

            {product.features && (
              <ul className="mt-6 space-y-2">
                {product.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-google-blue" />
                    {f}
                  </li>
                ))}
              </ul>
            )}

            <ProductActions product={product} />

            <div className="mt-8 rounded-2xl border border-border bg-google-blue-50 p-6">
              <p className="text-sm font-medium text-google-blue-dark">
                Besoin d&apos;un devis personnalisé ?
              </p>
              <p className="mt-1 text-sm text-muted">
                Ajoutez ce produit à votre demande de devis ou{" "}
                <Link href="/contact" className="text-google-blue hover:underline">
                  contactez-nous directement
                </Link>
                .
              </p>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-8 text-2xl font-bold">Produits similaires</h2>
            <ProductGrid products={related} />
          </div>
        )}
      </div>
    </>
  );
}
