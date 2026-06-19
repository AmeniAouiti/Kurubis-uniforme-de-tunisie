"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Eye, EyeOff, MoreVertical, Pencil, Trash2 } from "lucide-react";
import type { Product } from "@/types";
import { useCms } from "@/contexts/cms-context";
import { cn } from "@/lib/utils";

export function ProductRowMenu({ product }: { product: Product }) {
  const { updateProduct, deleteProduct } = useCms();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [menuStyle, setMenuStyle] = useState<{ top: number; left: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onDocClick(e: MouseEvent) {
      const target = e.target as Node;
      if (
        buttonRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    }

    function reposition() {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      const menuWidth = 192;
      const menuHeight = 132;
      const gap = 6;

      let top = rect.bottom + gap;
      let left = rect.right - menuWidth;

      if (left < 8) left = 8;
      if (top + menuHeight > window.innerHeight - 8) {
        top = rect.top - menuHeight - gap;
      }

      setMenuStyle({ top, left });
    }

    reposition();
    document.addEventListener("mousedown", onDocClick);
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);

    return () => {
      document.removeEventListener("mousedown", onDocClick);
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [open]);

  async function toggleVisibility() {
    setBusy(true);
    try {
      await updateProduct(product.id, { isVisible: product.isVisible === false });
      setOpen(false);
    } catch {
      alert("Impossible de modifier la visibilité.");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`Supprimer « ${product.name} » ?`)) return;
    setBusy(true);
    try {
      await deleteProduct(product.id);
    } catch {
      alert("Impossible de supprimer l'article.");
      setBusy(false);
    }
  }

  const visible = product.isVisible !== false;

  const menu =
    open && menuStyle
      ? createPortal(
          <div
            ref={menuRef}
            style={{ position: "fixed", top: menuStyle.top, left: menuStyle.left, zIndex: 9999 }}
            className="w-48 rounded-xl border border-border bg-white py-1 shadow-xl"
          >
            <Link
              href={`/admin/produits/${product.id}`}
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2 px-3 py-2.5 text-sm hover:bg-google-blue-light/60"
            >
              <Pencil className="h-3.5 w-3.5" />
              Modifier
            </Link>
            <button
              type="button"
              onClick={() => void toggleVisibility()}
              disabled={busy}
              className="flex w-full items-center gap-2 px-3 py-2.5 text-sm hover:bg-google-blue-light/60"
            >
              {visible ? (
                <>
                  <EyeOff className="h-3.5 w-3.5" />
                  Masquer
                </>
              ) : (
                <>
                  <Eye className="h-3.5 w-3.5" />
                  Rendre visible
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => void handleDelete()}
              disabled={busy}
              className={cn(
                "flex w-full items-center gap-2 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50",
                busy && "opacity-50"
              )}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Supprimer
            </button>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        disabled={busy}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-surface transition-colors"
        aria-label="Actions"
        aria-expanded={open}
      >
        <MoreVertical className="h-4 w-4" />
      </button>
      {menu}
    </>
  );
}
