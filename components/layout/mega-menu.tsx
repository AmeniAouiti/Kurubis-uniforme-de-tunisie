"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { vetementsMegaMenu } from "@/lib/data/metiers-menu";
import { cn } from "@/lib/utils";

export function VetementsMegaMenu({ onClose }: { onClose?: () => void }) {
  const [activeCategory, setActiveCategory] = useState(0);
  const current = vetementsMegaMenu[activeCategory];

  return (
    <div className="absolute left-0 top-full z-50 w-[720px] rounded-2xl border border-border bg-white shadow-2xl shadow-google-blue/10 overflow-hidden">
      <div className="flex min-h-[320px]">
        <div className="w-52 bg-surface border-r border-border py-2">
          {vetementsMegaMenu.map((cat, i) => (
            <button
              key={cat.label}
              onMouseEnter={() => setActiveCategory(i)}
              className={cn(
                "flex w-full items-center justify-between px-4 py-3 text-sm font-medium transition-colors",
                activeCategory === i
                  ? "bg-white text-google-blue border-r-2 border-google-blue"
                  : "text-muted hover:text-google-blue hover:bg-white/60"
              )}
            >
              {cat.label}
              {cat.groups.length > 0 && (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          ))}
        </div>

        <div className="flex-1 p-6">
          {current.href ? (
            <div className="flex flex-col items-start justify-center h-full">
              <h3 className="text-lg font-bold text-google-blue mb-2">{current.label}</h3>
              <p className="text-sm text-muted mb-4">
                Découvrez notre gamme complète {current.label.toLowerCase()}.
              </p>
              <Link
                href={current.href}
                onClick={onClose}
                className="rounded-full bg-google-blue px-6 py-2 text-sm font-medium text-white hover:bg-google-blue-dark transition-colors"
              >
                Voir la collection
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              {current.groups.map((group, gi) => (
                <div key={gi}>
                  {group.title && (
                    <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-google-blue">
                      {group.title}
                    </h4>
                  )}
                  <ul className="space-y-1">
                    {group.items.map((item) => (
                      <li key={item.label}>
                        <Link
                          href={item.href}
                          onClick={onClose}
                          className="block rounded-lg px-3 py-2 text-sm text-muted hover:bg-google-blue-light hover:text-google-blue transition-colors"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
