import type { Product } from "@/types";

export function isProductVisible(product: Product): boolean {
  return product.isVisible !== false;
}

export function filterVisibleProducts(products: Product[]): Product[] {
  return products.filter(isProductVisible);
}

/** Évite 19.999… → arrondi au centime (ex. 20 reste 20) */
export function parsePrice(value: string | number | null | undefined): number | undefined {
  if (value === null || value === undefined || value === "") return undefined;
  const raw =
    typeof value === "number"
      ? value
      : parseFloat(String(value).replace(",", ".").trim());
  if (!Number.isFinite(raw)) return undefined;
  return Math.round(raw * 100) / 100;
}

export function formatProductPrice(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  const fixed = rounded.toFixed(2);
  return fixed.replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
}

export function getProductPrice(product: Product): number {
  if (product.price !== undefined) return parsePrice(product.price) ?? product.price;
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
