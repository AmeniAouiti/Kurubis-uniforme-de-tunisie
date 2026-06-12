import type { Product } from "@/types";

export function getProductPrice(product: Product): number {
  if (product.price !== undefined) return product.price;
  return 45 + (parseInt(product.id, 10) * 13) % 280;
}

export function getProductImages(product: Product): string[] {
  if (product.images?.length) return product.images;
  return [product.image];
}

export function getProductBreadcrumbs(product: Product) {
  const items: { label: string; href?: string }[] = [];
  if (product.metiers[0]) {
    const metierLabels: Record<string, string> = {
      medicales: "Médicales / Bien-être",
      cuisine: "Cuisine",
      industrie: "Industrie",
      batiment: "Bâtiment",
      "btp-chantiers": "BTP et chantiers",
      petroliers: "Pétroliers",
      "protection-civile": "Protection civile",
    };
    const label = metierLabels[product.metiers[0]] || "Métiers";
    items.push({ label: "Métiers", href: "/metiers" });
    items.push({ label, href: `/metiers/${product.metiers[0]}` });
  }
  items.push({ label: product.name });
  return items;
}
