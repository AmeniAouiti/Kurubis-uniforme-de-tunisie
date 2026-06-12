import type { Product } from "@/types";
import { computeFilterSlugs } from "@/lib/product-filters";

export interface ShopFilterNode {
  slug: string;
  label: string;
  categorySlugs?: string[];
  tagIncludes?: string;
  children?: ShopFilterNode[];
}

export const shopFilterTree: ShopFilterNode[] = [
  {
    slug: "vetement-travail",
    label: "VÊTEMENT DE TRAVAIL",
    children: [
      { slug: "pantalons-travail", label: "Pantalons de travail", categorySlugs: ["pantalons", "pantalons-haute-visibilite"] },
      { slug: "blouses", label: "Blouses", categorySlugs: ["blouses"] },
      { slug: "blouses-femme", label: "Blouses femme", categorySlugs: ["blouses"], tagIncludes: "FEMME" },
      { slug: "blouses-medical", label: "Blouses médical", categorySlugs: ["medicales", "blouses"] },
      { slug: "combinaisons", label: "Combinaisons", categorySlugs: ["combinaisons"] },
      { slug: "doudounes", label: "Doudoune de travail sans manche", categorySlugs: ["doudounes"] },
      { slug: "gilets", label: "Gilets", categorySlugs: ["gilets"] },
      { slug: "gilets-signalisation", label: "Gilets de signalisation", categorySlugs: ["gilets"], tagIncludes: "SIGNALISATION" },
      {
        slug: "haute-visibilite",
        label: "Haute visibilité",
        children: [
          { slug: "combinaison-hv", label: "Combinaison haute visibilité", categorySlugs: ["combinaisons"], tagIncludes: "HAUTE VISIBILITÉ" },
          { slug: "gilet-securite", label: "Gilet de sécurité", categorySlugs: ["gilets"], tagIncludes: "HAUTE VISIBILITÉ" },
          { slug: "pantalons-hv", label: "Pantalons haute visibilité", categorySlugs: ["pantalons-haute-visibilite"] },
          { slug: "parkas-hv", label: "Parkas haute visibilité", categorySlugs: ["parkas-haute-visibilite"] },
          { slug: "vestes-hv", label: "Vestes haute visibilité", categorySlugs: ["vestes-haute-visibilite"] },
        ],
      },
      { slug: "maille", label: "Maille", categorySlugs: ["polo"] },
      { slug: "parka-hv", label: "Parka haute visibilité", categorySlugs: ["parkas-haute-visibilite"] },
      { slug: "parkas-travail", label: "Parkas de travail", categorySlugs: ["parkas"] },
      { slug: "polo", label: "Polo", categorySlugs: ["polo"] },
      { slug: "pulls-sweats", label: "Pulls de travail et sweats", categorySlugs: ["polo"], tagIncludes: "PULL" },
      { slug: "salopettes", label: "Salopettes", categorySlugs: ["salopettes"] },
      { slug: "tablier", label: "Tablier de travail", categorySlugs: ["blouses"], tagIncludes: "TABLIER" },
      { slug: "anti-feu", label: "Tenue de travail anti-feu", categorySlugs: ["anti-feu", "multirisque"] },
      { slug: "veste-cuisine", label: "Veste de cuisine", categorySlugs: ["hotellerie", "cuisine"] },
      { slug: "vestes-travail", label: "Vestes de travail", categorySlugs: ["parkas", "vestes-haute-visibilite"] },
    ],
  },
];

export function productMatchesFilter(product: Product, node: ShopFilterNode): boolean {
  const slugs = product.filterSlugs ?? computeFilterSlugs(product);

  if (node.children?.length) {
    return (
      slugs.includes(node.slug) ||
      node.children.some((child) => productMatchesFilter(product, child))
    );
  }

  return slugs.includes(node.slug);
}

export function findFilterNode(slug: string, nodes = shopFilterTree): ShopFilterNode | null {
  for (const node of nodes) {
    if (node.slug === slug) return node;
    if (node.children) {
      const found = findFilterNode(slug, node.children);
      if (found) return found;
    }
  }
  return null;
}

export function countForFilter(products: Product[], node: ShopFilterNode): number {
  if (node.children?.length) {
    return products.filter((p) =>
      node.children!.some((child) => productMatchesFilter(p, child))
    ).length;
  }
  return products.filter((p) => productMatchesFilter(p, node)).length;
}

export function filterProducts(products: Product[], filterSlug: string): Product[] {
  const node = findFilterNode(filterSlug);
  if (!node) return products;
  if (node.children?.length) {
    return products.filter((p) =>
      node.children!.some((child) => productMatchesFilter(p, child))
    );
  }
  return products.filter((p) => productMatchesFilter(p, node));
}

export const PRICE_MAX = 350;
