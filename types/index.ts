export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string;
  icon?: string;
  parentId?: string;
  children?: Category[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription?: string;
  sku: string;
  image: string;
  images?: string[];
  categories: string[];
  metiers: string[];
  metierSubcategories?: string[];
  tags: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
  rating: number;
  reviewCount: number;
  features?: string[];
  price?: number;
  filterSlugs?: string[];
  characteristics?: string[];
  reviews?: { author: string; rating: number; comment: string; date: string }[];
}

export interface NavItem {
  label: string;
  href?: string;
  children?: NavItem[];
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  gradient: string;
  icon: string;
  image: string;
  imageAlt: string;
}

export interface PersonalizationMethod {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Guide {
  slug: string;
  title: string;
  content: string;
}

export interface Service {
  slug: string;
  title: string;
  description: string;
  content: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
