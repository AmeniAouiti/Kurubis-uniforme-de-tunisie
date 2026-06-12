"use client";

import { useState } from "react";
import { Star, Check } from "lucide-react";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

export function ProductTabs({ product }: { product: Product }) {
  const [tab, setTab] = useState<"description" | "reviews">("description");
  const reviews = product.reviews || [];

  return (
    <div className="mt-12">
      <div className="flex border-b border-border">
        {(["description", "reviews"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "relative px-6 py-3 text-sm font-medium capitalize transition-colors",
              tab === t ? "text-google-blue" : "text-muted hover:text-foreground"
            )}
          >
            {t === "description" ? "Description" : `Avis (${product.reviewCount})`}
            {tab === t && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-google-blue" />
            )}
          </button>
        ))}
      </div>

      <div className="py-8">
        {tab === "description" ? (
          <div>
            {product.characteristics && product.characteristics.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Caractéristiques :</h3>
                <ul className="space-y-2">
                  {product.characteristics.map((c) => (
                    <li key={c} className="flex items-start gap-2 text-sm text-muted">
                      <Check className="h-4 w-4 text-google-blue shrink-0 mt-0.5" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <p className="text-muted leading-relaxed">{product.description}</p>
            {product.features && (
              <ul className="mt-6 space-y-2">
                {product.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-google-blue" />
                    {f}
                  </li>
                ))}
              </ul>
            )}
            {(product.slug === "bavette" || product.slug === "surblouse-covid") && (
              <div className="mt-8 rounded-xl bg-amber-50 border border-amber-200 px-6 py-4 text-center">
                <p className="font-bold text-amber-900">BAVETTES MÉDICALES</p>
                <p className="text-sm text-amber-800 mt-1">
                  CONFORME AUX NORMES INTERNATIONAUX
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.length === 0 ? (
              <p className="text-muted text-sm">Aucun avis pour le moment.</p>
            ) : (
              reviews.map((r, i) => (
                <div key={i} className="border-b border-border pb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star
                          key={j}
                          className={cn(
                            "h-4 w-4",
                            j < r.rating ? "fill-yellow-400 text-yellow-400" : "text-border"
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">{r.author}</span>
                    <span className="text-xs text-muted">{r.date}</span>
                  </div>
                  <p className="text-sm text-muted">{r.comment}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
