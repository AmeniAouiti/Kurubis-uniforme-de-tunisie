"use client";

import { HeroCarousel } from "@/components/home/hero-carousel";
import { BestSellersSection } from "@/components/home/best-sellers-section";
import { NouveautesSection } from "@/components/home/nouveautes-section";
import { MetiersShowcase } from "@/components/home/metiers-showcase";
import { CatalogDownloads } from "@/components/home/catalog-downloads";
import { PersonalizationSection } from "@/components/home/personalization-section";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useCms } from "@/contexts/cms-context";

export function HomePageContent() {
  const { products } = useCms();
  const newProducts = products.filter((p) => p.isNew).slice(0, 5);
  const nouveautesDisplay = newProducts.length > 0 ? newProducts : products.slice(0, 5);

  return (
    <>
      <HeroCarousel />
      <ScrollReveal>
        <BestSellersSection products={products} />
      </ScrollReveal>
      <ScrollReveal delay={80}>
        <NouveautesSection products={nouveautesDisplay} />
      </ScrollReveal>
      <ScrollReveal delay={100}>
        <MetiersShowcase />
      </ScrollReveal>
      <ScrollReveal delay={120}>
        <CatalogDownloads />
      </ScrollReveal>
      <ScrollReveal delay={140}>
        <PersonalizationSection />
      </ScrollReveal>
    </>
  );
}
