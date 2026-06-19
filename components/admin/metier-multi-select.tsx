"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { metiersConfig, type MetierFilter } from "@/lib/data/metiers-config";
import { cn } from "@/lib/utils";

export function getMetierLabel(slug: string): string {
  return metiersConfig.find((m) => m.slug === slug)?.name ?? slug;
}

export function MetierMultiSelect({
  metiers,
  metierSubcategories,
  categories,
  onMetiersChange,
  onMetierSubsChange,
  onCategoriesChange,
}: {
  metiers: string[];
  metierSubcategories: string[];
  categories: string[];
  onMetiersChange: (slugs: string[]) => void;
  onMetierSubsChange: (slugs: string[]) => void;
  onCategoriesChange: (slugs: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(metiersConfig.map((m) => m.slug))
  );
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function toggleExpand(slug: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  function toggleMetier(slug: string) {
    if (metiers.includes(slug)) {
      onMetiersChange(metiers.filter((m) => m !== slug));
      const config = metiersConfig.find((m) => m.slug === slug);
      const relatedSubs =
        config?.filters?.filter((f) => f.type === "sub").map((f) => f.slug) ?? [];
      const relatedCats =
        config?.filters?.filter((f) => f.type === "category").map((f) => f.slug) ?? [];
      if (relatedSubs.length) {
        onMetierSubsChange(metierSubcategories.filter((s) => !relatedSubs.includes(s)));
      }
      if (relatedCats.length) {
        onCategoriesChange(categories.filter((c) => !relatedCats.includes(c)));
      }
    } else {
      onMetiersChange([...metiers, slug]);
    }
  }

  function toggleFilter(metierSlug: string, filter: MetierFilter) {
    if (!metiers.includes(metierSlug)) {
      onMetiersChange([...metiers, metierSlug]);
    }

    if (filter.type === "sub") {
      const next = metierSubcategories.includes(filter.slug)
        ? metierSubcategories.filter((s) => s !== filter.slug)
        : [...metierSubcategories, filter.slug];
      onMetierSubsChange(next);
    } else {
      const next = categories.includes(filter.slug)
        ? categories.filter((c) => c !== filter.slug)
        : [...categories, filter.slug];
      onCategoriesChange(next);
    }
  }

  function isFilterChecked(filter: MetierFilter) {
    return filter.type === "sub"
      ? metierSubcategories.includes(filter.slug)
      : categories.includes(filter.slug);
  }

  const summary =
    metiers.length === 0
      ? "— Choisir un ou plusieurs métiers —"
      : `${metiers.length} métier${metiers.length > 1 ? "s" : ""} sélectionné${metiers.length > 1 ? "s" : ""}`;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-xl border border-border bg-white px-3 py-2.5 text-left text-sm"
      >
        <span className={cn(metiers.length === 0 && "text-muted")}>{summary}</span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted transition", open && "rotate-180")} />
      </button>

      {metiers.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {metiers.map((slug) => (
            <span
              key={slug}
              className="inline-flex items-center gap-1 rounded-full bg-google-blue-light px-2.5 py-1 text-xs font-medium text-google-blue"
            >
              {getMetierLabel(slug)}
              <button
                type="button"
                onClick={() => toggleMetier(slug)}
                className="hover:text-google-blue-dark"
                aria-label="Retirer"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {open && (
        <div className="absolute z-50 mt-1 max-h-80 w-full overflow-y-auto rounded-xl border border-border bg-white py-1 shadow-lg">
          {metiersConfig.map((metier) => {
            const hasFilters = (metier.filters?.length ?? 0) > 0;
            const isExpanded = expanded.has(metier.slug);
            return (
              <div key={metier.slug}>
                <div className="flex items-center gap-1 px-2 py-1.5">
                  {hasFilters ? (
                    <button
                      type="button"
                      onClick={() => toggleExpand(metier.slug)}
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded hover:bg-surface"
                      aria-label="Développer"
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronRight className="h-3.5 w-3.5" />
                      )}
                    </button>
                  ) : (
                    <span className="w-6 shrink-0" />
                  )}
                  <label className="flex flex-1 cursor-pointer items-center gap-2 py-1 text-sm font-medium">
                    <input
                      type="checkbox"
                      checked={metiers.includes(metier.slug)}
                      onChange={() => toggleMetier(metier.slug)}
                      className="rounded"
                    />
                    {metier.name}
                  </label>
                </div>

                {hasFilters &&
                  isExpanded &&
                  metier.filters!.map((filter) => (
                    <label
                      key={`${metier.slug}-${filter.type}-${filter.slug}-${filter.label}`}
                      className="flex cursor-pointer items-center gap-2 py-2 pl-11 pr-3 text-sm text-muted hover:bg-google-blue-light/50"
                    >
                      <input
                        type="checkbox"
                        checked={isFilterChecked(filter)}
                        onChange={() => toggleFilter(metier.slug, filter)}
                        className="rounded"
                      />
                      {filter.label}
                    </label>
                  ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
