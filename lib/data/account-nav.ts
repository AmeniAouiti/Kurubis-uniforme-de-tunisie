import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  ShoppingBasket,
  MessageSquare,
  Tag,
  List,
  Package,
  Download,
  MapPin,
  UserCircle,
  LogOut,
} from "lucide-react";

export interface AccountNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  description?: string;
}

export const accountNavigation: AccountNavItem[] = [
  {
    label: "Tableau de bord",
    href: "/compte",
    icon: LayoutDashboard,
    description: "Vue d'ensemble de votre compte",
  },
  {
    label: "Commandes",
    href: "/compte/commandes",
    icon: ShoppingBasket,
    description: "Historique et suivi des commandes",
  },
  {
    label: "Messagerie & devis",
    href: "/compte/conversations",
    icon: MessageSquare,
    description: "Demandes de devis et échanges avec l'équipe",
  },
  {
    label: "Mes offres",
    href: "/compte/offres",
    icon: Tag,
    description: "Devis et offres personnalisées",
  },
  {
    label: "Listes d'achat",
    href: "/compte/listes-achat",
    icon: List,
    description: "Listes de produits sauvegardées",
  },
  {
    label: "Commande en vrac",
    href: "/compte/commande-vrac",
    icon: Package,
    description: "Commandes groupées et volumes",
  },
  {
    label: "Téléchargements",
    href: "/compte/telechargements",
    icon: Download,
    description: "Factures, catalogues et documents",
  },
  {
    label: "Adresses",
    href: "/compte/adresses",
    icon: MapPin,
    description: "Livraison et facturation",
  },
  {
    label: "Détails du compte",
    href: "/compte/details",
    icon: UserCircle,
    description: "Profil et mot de passe",
  },
];

export const logoutItem: AccountNavItem = {
  label: "Se déconnecter",
  href: "/connexion",
  icon: LogOut,
};
