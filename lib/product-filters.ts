import type { Product } from "@/types";
import { shopFilterTree, type ShopFilterNode } from "@/lib/data/shop-filters";

const CATEGORY_TO_FILTERS: Record<string, string[]> = {
  pantalons: ["pantalons-travail"],
  "pantalons-haute-visibilite": [
    "pantalons-travail",
    "pantalons-hv",
    "haute-visibilite",
  ],
  blouses: ["blouses", "blouses-medical"],
  medicales: ["blouses-medical"],
  combinaisons: ["combinaisons"],
  doudounes: ["doudounes"],
  gilets: ["gilets"],
  polo: ["maille", "polo"],
  parkas: ["parkas-travail", "vestes-travail"],
  "parkas-haute-visibilite": [
    "parka-hv",
    "parkas-hv",
    "haute-visibilite",
  ],
  "vestes-haute-visibilite": [
    "vestes-hv",
    "vestes-travail",
    "haute-visibilite",
  ],
  "anti-feu": ["anti-feu"],
  multirisque: ["anti-feu"],
  hotellerie: ["veste-cuisine"],
  salopettes: ["salopettes"],
};

export function computeFilterSlugs(product: Product): string[] {
  const slugs = new Set<string>();

  for (const cat of product.categories) {
    for (const f of CATEGORY_TO_FILTERS[cat] || []) {
      slugs.add(f);
    }
  }

  const upperTags = product.tags.map((t) => t.toUpperCase());

  if (
    upperTags.some((t) => t.includes("HAUTE VISIBIL")) ||
    product.categories.some((c) => c.includes("haute-visibilite"))
  ) {
    [
      "haute-visibilite",
      "pantalons-hv",
      "parkas-hv",
      "parka-hv",
      "vestes-hv",
      "gilet-securite",
      "combinaison-hv",
    ].forEach((s) => slugs.add(s));
  }

  if (
    product.categories.includes("medicales") ||
    upperTags.some(
      (t) =>
        t.includes("MÉDICAL") ||
        t.includes("MEDICAL") ||
        t.includes("COVID") ||
        t.includes("AMBULANCIER")
    )
  ) {
    slugs.add("blouses-medical");
  }

  if (upperTags.some((t) => t.includes("MAILLE") || t.includes("POLO"))) {
    slugs.add("maille");
    slugs.add("polo");
  }

  if (
    product.categories.includes("anti-feu") ||
    product.categories.includes("multirisque") ||
    upperTags.some((t) => t.includes("ANTI") && t.includes("FEU"))
  ) {
    slugs.add("anti-feu");
  }

  if (upperTags.some((t) => t.includes("FEMME"))) {
    slugs.add("blouses-femme");
  }

  if (upperTags.some((t) => t.includes("TABLIER"))) {
    slugs.add("tablier");
  }

  if (upperTags.some((t) => t.includes("PULL") || t.includes("SWEAT"))) {
    slugs.add("pulls-sweats");
  }

  if (upperTags.some((t) => t.includes("SIGNALISATION"))) {
    slugs.add("gilets-signalisation");
  }

  if (slugs.size > 0) {
    slugs.add("vetement-travail");
  }

  return [...slugs];
}

export function enrichProduct(product: Product): Product {
  return {
    ...product,
    filterSlugs: computeFilterSlugs(product),
  };
}

function walkFilterTree(
  nodes: ShopFilterNode[],
  map: Map<string, string>
) {
  for (const node of nodes) {
    map.set(node.slug, node.label);
    if (node.children) walkFilterTree(node.children, map);
  }
}

export const filterLabels = (() => {
  const map = new Map<string, string>();
  walkFilterTree(shopFilterTree, map);
  return map;
})();

export function getProductFilterLinks(product: Product) {
  const slugs = (product.filterSlugs ?? computeFilterSlugs(product)).filter(
    (s) => s !== "vetement-travail"
  );
  return slugs.map((slug) => ({
    slug,
    label: filterLabels.get(slug) || slug,
    href: `/boutique?filtre=${slug}`,
  }));
}
