"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface HierarchicalOption {
  value: string;
  label: string;
  depth: number;
  /** Si false = en-tête de groupe non sélectionnable */
  selectable?: boolean;
}

interface HierarchicalSelectProps {
  options: HierarchicalOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

function isHeaderOption(opt: HierarchicalOption) {
  return opt.selectable === false || opt.value.startsWith("__");
}

export function HierarchicalSelect({
  options,
  value,
  onChange,
  placeholder = "— Choisir —",
  className,
}: HierarchicalSelectProps) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());
  const rootRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value && !isHeaderOption(o));

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function toggleExpand(key: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function sectionKey(opt: HierarchicalOption, index: number) {
    if (opt.depth === 0) return `sec-${opt.value}-${index}`;
    return `grp-${opt.label}-${index}`;
  }

  function isVisible(index: number) {
    const opt = options[index];
    if (opt.depth === 0) return true;

    let parentDepth = opt.depth - 1;
    for (let i = index - 1; i >= 0; i--) {
      const candidate = options[i];
      if (candidate.depth === parentDepth) {
        const key = sectionKey(candidate, i);
        return expanded.has(key);
      }
    }
    return true;
  }

  function handleSelect(opt: HierarchicalOption) {
    if (isHeaderOption(opt)) return;
    onChange(opt.value);
    setOpen(false);
  }

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-xl border border-border bg-white px-3 py-2.5 text-left text-sm"
      >
        <span className={cn(!selected && "text-muted")}>
          {selected?.label || placeholder}
        </span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted transition", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 max-h-72 w-full overflow-y-auto rounded-xl border border-border bg-white py-1 shadow-lg">
          {options.map((opt, index) => {
            if (!isVisible(index)) return null;

            const header = isHeaderOption(opt);
            const key = sectionKey(opt, index);
            const hasChildren =
              header &&
              options.slice(index + 1).some((o, j) => {
                const nextIndex = index + 1 + j;
                return o.depth > opt.depth;
              });

            if (opt.value === "" && opt.depth === 0) {
              return (
                <button
                  key="empty"
                  type="button"
                  onClick={() => handleSelect(opt)}
                  className="flex w-full px-3 py-2 text-left text-sm text-muted hover:bg-surface"
                >
                  {opt.label}
                </button>
              );
            }

            if (header) {
              return (
                <div
                  key={key}
                  className={cn(
                    "flex items-center gap-1 px-2 py-1.5",
                    opt.depth > 0 && "pl-6"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => toggleExpand(key)}
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded hover:bg-surface"
                    aria-label="Développer"
                  >
                    {hasChildren ? (
                      expanded.has(key) ? (
                        <ChevronDown className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronRight className="h-3.5 w-3.5" />
                      )
                    ) : (
                      <span className="w-3.5" />
                    )}
                  </button>
                  <span
                    className={cn(
                      "text-sm font-medium",
                      opt.depth === 0 ? "text-foreground" : "text-muted"
                    )}
                  >
                    {opt.label}
                  </span>
                </div>
              );
            }

            return (
              <button
                key={`${opt.value}-${index}`}
                type="button"
                onClick={() => handleSelect(opt)}
                className={cn(
                  "flex w-full items-center gap-2 py-2 pr-3 text-left text-sm hover:bg-google-blue-light/60",
                  opt.depth === 1 && "pl-9",
                  opt.depth === 2 && "pl-12",
                  opt.depth >= 3 && "pl-14",
                  value === opt.value && "bg-google-blue-light font-medium text-google-blue"
                )}
              >
                <ChevronRight className="h-3 w-3 shrink-0 text-muted/50" />
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
