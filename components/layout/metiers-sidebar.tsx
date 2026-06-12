"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, ChevronRight, List } from "lucide-react";
import { metiersSidebarMenu } from "@/lib/data/metiers-menu";
import { cn } from "@/lib/utils";

export function MetiersSidebar({ activeHref }: { activeHref?: string }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <aside className="w-full lg:w-72 shrink-0">
      <div className="rounded-2xl border border-border overflow-hidden bg-white shadow-sm">
        <div className="gradient-blue px-4 py-3 flex items-center gap-2">
          <List className="h-4 w-4 text-white" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Métiers</h3>
        </div>
        <nav className="divide-y divide-border">
          {metiersSidebarMenu.map((item) => {
            const isExpanded = expanded === item.label;
            const hasChildren = !!item.children?.length;

            return (
              <div key={item.label}>
                {hasChildren ? (
                  <button
                    onClick={() =>
                      setExpanded(isExpanded ? null : item.label)
                    }
                    className={cn(
                      "flex w-full items-center justify-between px-4 py-3.5 text-sm font-medium transition-colors hover:bg-google-blue-50",
                      isExpanded && "bg-google-blue-50 text-google-blue"
                    )}
                  >
                    <span>{item.label}</span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-muted transition-transform",
                        isExpanded && "rotate-180 text-google-blue"
                      )}
                    />
                  </button>
                ) : (
                  <Link
                    href={item.href || "#"}
                    className={cn(
                      "flex items-center justify-between px-4 py-3.5 text-sm font-medium transition-colors hover:bg-google-blue-50 hover:text-google-blue",
                      activeHref === item.href && "bg-google-blue-50 text-google-blue"
                    )}
                  >
                    {item.label}
                    <ChevronRight className="h-4 w-4 text-muted" />
                  </Link>
                )}

                {hasChildren && isExpanded && (
                  <div className="bg-surface/50 border-t border-border">
                    {item.children!.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className={cn(
                          "block px-6 py-2.5 text-sm text-muted hover:text-google-blue hover:bg-white transition-colors",
                          activeHref === child.href && "text-google-blue font-medium bg-white"
                        )}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
