import type { Category } from "@/types";
import { metiersConfig } from "@/lib/data/metiers-config";

const METIER_ICONS: Record<string, string> = {
  "protection-civile": "Shield",
  petroliers: "Flame",
  industrie: "Factory",
  batiment: "Building2",
  cuisine: "ChefHat",
  medicales: "HeartPulse",
  "btp-chantiers": "HardHat",
  chaussures: "Footprints",
  "uniforme-scolaire": "GraduationCap",
  metal: "Wrench",
  installateurs: "Plug",
  automobile: "Car",
  bois: "TreePine",
  "espace-vert": "Leaf",
  logistique: "Truck",
};

export const categories: Category[] = [
  { id: "1", slug: "combinaisons", name: "Combinaisons", description: "Combinaisons de travail professionnelles pour tous secteurs" },
  { id: "2", slug: "salopettes", name: "Salopettes", description: "Salopettes de travail résistantes et confortables" },
  { id: "3", slug: "pantalons", name: "Pantalons de travail", description: "Pantalons professionnels multi-poches" },
  { id: "4", slug: "blouses", name: "Blouses", description: "Blouses de travail homme et femme" },
  { id: "5", slug: "gilets", name: "Gilets", description: "Gilets de travail multipoches" },
  { id: "6", slug: "parkas", name: "Parkas de travail", description: "Parkas professionnelles matelassées" },
  { id: "7", slug: "polo", name: "Polo", description: "Polos de travail manches courtes et longues" },
  { id: "8", slug: "doudounes", name: "Doudounes", description: "Doudounes professionnelles sans manches" },
  { id: "9", slug: "pantalons-haute-visibilite", name: "Pantalons haute visibilité", description: "Conformes EN ISO 20471" },
  { id: "10", slug: "parkas-haute-visibilite", name: "Parkas haute visibilité", description: "Protection et visibilité maximale" },
  { id: "11", slug: "vestes-haute-visibilite", name: "Vestes haute visibilité", description: "Vestes et blousons haute visibilité" },
  { id: "12", slug: "medicales", name: "Médicales", description: "Tenues médicales et paramédicales" },
  { id: "13", slug: "hotellerie", name: "Hôtellerie", description: "Uniformes hôtellerie et restauration" },
  { id: "14", slug: "chaussures", name: "Chaussures", description: "Chaussures de sécurité et de ville" },
  { id: "15", slug: "uniforme-scolaire", name: "Uniforme scolaire", description: "Tabliers et tenues scolaires" },
  { id: "16", slug: "anti-feu", name: "Anti-feu", description: "Tenues retardatrices de flamme" },
  { id: "17", slug: "multirisque", name: "Multirisque", description: "Protection multirisques ATEX" },
];

export const metiers = metiersConfig.map((m) => ({
  slug: m.slug,
  name: m.name,
  icon: METIER_ICONS[m.slug] ?? "Factory",
}));

export function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function getMetierBySlug(slug: string) {
  return metiers.find((m) => m.slug === slug);
}
