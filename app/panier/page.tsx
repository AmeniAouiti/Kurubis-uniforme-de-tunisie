"use client";

import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";
import { Minus, Plus, Trash2, ShoppingBag, Send } from "lucide-react";

export default function PanierPage() {
  const { items, updateQuantity, removeItem, clearCart, totalItems } = useCart();

  return (
    <>
      <PageHeader
        title="Demande de devis"
        description="Votre sélection de produits pour devis"
        breadcrumb="Accueil / Panier devis"
      />
      <div className="mx-auto max-w-4xl px-4 py-12">
        {items.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <ShoppingBag className="h-16 w-16 text-border mb-4" />
            <h2 className="text-xl font-bold">Votre panier est vide</h2>
            <p className="mt-2 text-muted mb-6">
              Parcourez notre catalogue et ajoutez des produits à votre demande de devis.
            </p>
            <Link href="/produits">
              <Button>Voir le catalogue</Button>
            </Link>
          </div>
        ) : (
          <>
            <p className="mb-6 text-sm text-muted">
              {totalItems} article{totalItems > 1 ? "s" : ""} dans votre demande de devis
            </p>
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 rounded-2xl border border-border bg-white p-4"
                >
                  <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-surface">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/produits/${item.product.slug}`}
                      className="font-medium hover:text-google-blue line-clamp-2"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-muted mt-1">SKU: {item.product.sku}</p>
                    <div className="mt-3 flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-border hover:bg-surface"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-border hover:bg-surface"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="ml-auto flex items-center gap-1 text-sm text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                        Retirer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link href="/contact" className="flex-1">
                <Button size="lg" className="w-full">
                  <Send className="h-4 w-4" />
                  Envoyer la demande de devis
                </Button>
              </Link>
              <Button variant="outline" size="lg" onClick={clearCart}>
                Vider le panier
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
