"use client";

import { HeroCarousel } from "@/components/home/hero-carousel";
import { BestSellersSection } from "@/components/home/best-sellers-section";
import { NouveautesSection } from "@/components/home/nouveautes-section";
import { MetiersShowcase } from "@/components/home/metiers-showcase";
import { PersonalizationSection } from "@/components/home/personalization-section";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useCms } from "@/contexts/cms-context";
import { filterVisibleProducts } from "@/lib/products-utils";

export function HomePageContent() {
  const { products } = useCms();
  const visibleProducts = filterVisibleProducts(products);
  const newProducts = visibleProducts.filter((p) => p.isNew).slice(0, 5);
  const nouveautesDisplay = newProducts.length > 0 ? newProducts : visibleProducts.slice(0, 5);

  return (
    <>
      <HeroCarousel />
      <ScrollReveal>
        <BestSellersSection products={visibleProducts} />
      </ScrollReveal>
      <ScrollReveal delay={80}>
        <NouveautesSection products={nouveautesDisplay} />
      </ScrollReveal>
      <ScrollReveal delay={100}>
        <MetiersShowcase />
      </ScrollReveal>
      <ScrollReveal delay={120}>
        <PersonalizationSection />
      </ScrollReveal>
    </>
  );
}
