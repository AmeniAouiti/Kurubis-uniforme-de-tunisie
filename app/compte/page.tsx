"use client";

import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { useWishlist } from "@/contexts/wishlist-context";
import { User, Heart, Package, FileText } from "lucide-react";

export default function ComptePage() {
  const { items: wishlistItems } = useWishlist();

  const sections = [
    {
      icon: Package,
      title: "Suivi commande",
      description: "Suivez l'état de vos commandes en cours",
      href: "/suivi-commande",
    },
    {
      icon: FileText,
      title: "Mes devis",
      description: "Consultez vos demandes de devis",
      href: "/panier",
    },
    {
      icon: Heart,
      title: "Mes favoris",
      description: `${wishlistItems.length} produit(s) en favoris`,
      href: "#favoris",
    },
  ];

  return (
    <>
      <PageHeader
        title="Mon compte"
        description="Gérez vos commandes, devis et favoris"
        breadcrumb="Accueil / Mon compte"
      />
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="mb-8 flex items-center gap-4 rounded-2xl border border-border bg-google-blue-50 p-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full gradient-blue text-white">
            <User className="h-8 w-8" />
          </div>
          <div>
            <p className="font-bold text-lg">Bienvenue</p>
            <p className="text-sm text-muted">
              <Link href="/connexion" className="text-google-blue hover:underline">
                Connectez-vous
              </Link>{" "}
              pour accéder à toutes les fonctionnalités
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 mb-12">
          {sections.map((section) => (
            <Link
              key={section.title}
              href={section.href}
              className="group rounded-2xl border border-border bg-white p-6 transition-all hover:border-google-blue/30 hover:shadow-lg"
            >
              <section.icon className="h-8 w-8 text-google-blue mb-3" />
              <h3 className="font-semibold group-hover:text-google-blue">{section.title}</h3>
              <p className="text-sm text-muted mt-1">{section.description}</p>
            </Link>
          ))}
        </div>

        {wishlistItems.length > 0 && (
          <div id="favoris">
            <h2 className="text-xl font-bold mb-4">Mes favoris</h2>
            <div className="space-y-3">
              {wishlistItems.map((product) => (
                <Link
                  key={product.id}
                  href={`/produits/${product.slug}`}
                  className="flex items-center gap-4 rounded-xl border border-border p-4 hover:bg-surface transition-colors"
                >
                  <Heart className="h-4 w-4 text-red-500 fill-red-500 shrink-0" />
                  <span className="text-sm font-medium">{product.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
