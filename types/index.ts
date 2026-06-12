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
  tags: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
  rating: number;
  reviewCount: number;
  features?: string[];
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
}

export interface PersonalizationMethod {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface ClientReference {
  id: string;
  name: string;
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
