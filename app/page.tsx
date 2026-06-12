import { HeroCarousel } from "@/components/home/hero-carousel";
import { SectionHeader } from "@/components/home/section-header";
import { ProfessionGrid } from "@/components/home/profession-grid";
import { PersonalizationSection } from "@/components/home/personalization-section";
import { ClientReferences } from "@/components/home/client-references";
import { FeatureBanners } from "@/components/home/feature-banners";
import { ProductGrid } from "@/components/product/product-grid";
import { getBestSellers, getNewProducts } from "@/lib/data/products";

export default function HomePage() {
  const bestSellers = getBestSellers().slice(0, 8);
  const newProducts = getNewProducts().slice(0, 8);

  return (
    <>
      <HeroCarousel />

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeader
            title="Meilleures ventes"
            subtitle="Les produits les plus demandés par nos clients professionnels"
            href="/produits?filter=bestseller"
          />
          <ProductGrid products={bestSellers} />
        </div>
      </section>

      <section className="py-16 bg-surface">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeader
            title="Nouveautés"
            subtitle="Découvrez nos dernières arrivées"
            href="/produits?filter=new"
          />
          <ProductGrid products={newProducts} />
        </div>
      </section>

      <ProfessionGrid />
      <FeatureBanners />
      <PersonalizationSection />
      <ClientReferences />
    </>
  );
}
