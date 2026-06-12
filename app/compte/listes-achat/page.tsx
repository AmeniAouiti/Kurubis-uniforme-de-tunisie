"use client";

import Link from "next/link";
import Image from "next/image";
import { AccountPage } from "@/components/account/account-page";
import { useWishlist } from "@/contexts/wishlist-context";
import { Heart } from "lucide-react";

export default function ListesAchatPage() {
  const { items, removeItem } = useWishlist();

  return (
    <AccountPage title="Listes d'achat" breadcrumb="Listes d'achat">
      {items.length === 0 ? (
        <div className="rounded-2xl border border-border bg-white p-12 text-center">
          <Heart className="h-10 w-10 mx-auto mb-3 text-border" />
          <p className="text-muted">Votre liste d&apos;achat est vide.</p>
          <Link href="/boutique" className="mt-4 inline-block text-google-blue hover:underline text-sm font-medium">
            Parcourir la boutique
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((product) => (
            <div key={product.id} className="flex items-center gap-4 rounded-2xl border border-border bg-white p-4">
              <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-surface">
                <Image src={product.image} alt={product.name} fill className="object-cover" />
              </div>
              <Link href={`/produits/${product.slug}`} className="flex-1 font-medium hover:text-google-blue">
                {product.name}
              </Link>
              <button onClick={() => removeItem(product.id)} className="text-sm text-red-500 hover:underline">
                Retirer
              </button>
            </div>
          ))}
        </div>
      )}
    </AccountPage>
  );
}
