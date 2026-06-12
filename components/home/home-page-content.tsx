"use client";

import { HeroCarousel } from "@/components/home/hero-carousel";
import { BestSellersSection } from "@/components/home/best-sellers-section";
import { NouveautesSection } from "@/components/home/nouveautes-section";
import { MetiersShowcase } from "@/components/home/metiers-showcase";
import { CatalogDownloads } from "@/components/home/catalog-downloads";
import { PersonalizationSection } from "@/components/home/personalization-section";
import { useCms } from "@/contexts/cms-context";

export function HomePageContent() {
  const { products } = useCms();
  const newProducts = products.filter((p) => p.isNew);

  return (
    <>
      <HeroCarousel />
      <BestSellersSection products={products} />
      <NouveautesSection products={newProducts.length > 0 ? newProducts : products.slice(0, 8)} />
      <MetiersShowcase />
      <CatalogDownloads />
      <PersonalizationSection />
    </>
  );
}
