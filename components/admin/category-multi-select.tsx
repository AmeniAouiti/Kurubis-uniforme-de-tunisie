"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { vetementsHierarchy } from "@/lib/data/vetements-config";
import { cn } from "@/lib/utils";

function getUniqueCategoryOptions() {
  const seen = new Set<string>();
  const options: { slug: string; label: string; section: string }[] = [];

  for (const section of vetementsHierarchy) {
    if (section.slug && section.groups.length === 0) {
      if (!seen.has(section.slug)) {
        seen.add(section.slug);
        options.push({ slug: section.slug, label: section.label, section: section.label });
      }
      continue;
    }

    for (const group of section.groups) {
      for (const item of group.items) {
        if (seen.has(item.slug)) continue;
        seen.add(item.slug);
        options.push({
          slug: item.slug,
          label: item.label,
          section: section.label,
        });
      }
    }
  }

  return options;
}

const categoryOptions = getUniqueCategoryOptions();

const sections = [...new Set(categoryOptions.map((o) => o.section))];

export function CategoryMultiSelect({
  value,
  onChange,
}: {
  value: string[];
  onChange: (slugs: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(sections));
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function toggleSection(section: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return next;
    });
  }

  function toggleSlug(slug: string) {
    onChange(value.includes(slug) ? value.filter((s) => s !== slug) : [...value, slug]);
  }

  const summary =
    value.length === 0
      ? "— Choisir une ou plusieurs catégories —"
      : `${value.length} catégorie${value.length > 1 ? "s" : ""} sélectionnée${value.length > 1 ? "s" : ""}`;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-xl border border-border bg-white px-3 py-2.5 text-left text-sm"
      >
        <span className={cn(value.length === 0 && "text-muted")}>{summary}</span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted transition", open && "rotate-180")} />
      </button>

      {value.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {value.map((slug) => {
            const opt = categoryOptions.find((o) => o.slug === slug);
            return (
              <span
                key={slug}
                className="inline-flex items-center gap-1 rounded-full bg-google-blue-light px-2.5 py-1 text-xs font-medium text-google-blue"
              >
                {opt?.label || slug}
                <button
                  type="button"
                  onClick={() => toggleSlug(slug)}
                  className="hover:text-google-blue-dark"
                  aria-label="Retirer"
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>
      )}

      {open && (
        <div className="absolute z-50 mt-1 max-h-72 w-full overflow-y-auto rounded-xl border border-border bg-white py-1 shadow-lg">
          {sections.map((section) => {
            const items = categoryOptions.filter((o) => o.section === section);
            const isExpanded = expanded.has(section);
            return (
              <div key={section}>
                <button
                  type="button"
                  onClick={() => toggleSection(section)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium hover:bg-surface"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-3.5 w-3.5 shrink-0" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                  )}
                  {section}
                </button>
                {isExpanded &&
                  items.map((item) => (
                    <label
                      key={`${section}-${item.slug}-${item.label}`}
                      className="flex cursor-pointer items-center gap-2 py-2 pl-9 pr-3 text-sm hover:bg-google-blue-light/50"
                    >
                      <input
                        type="checkbox"
                        checked={value.includes(item.slug)}
                        onChange={() => toggleSlug(item.slug)}
                        className="rounded"
                      />
                      {item.label}
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
