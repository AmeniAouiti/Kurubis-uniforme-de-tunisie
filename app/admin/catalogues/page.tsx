"use client";

import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Download } from "lucide-react";
import { AdminPage } from "@/components/admin/admin-page";
import { Button } from "@/components/ui/button";
import { useCms } from "@/contexts/cms-context";

export default function AdminCataloguesPage() {
  const { catalogs } = useCms();

  return (
    <AdminPage title="Catalogues PDF">
      <div className="flex justify-end mb-6">
        <Link href="/admin/catalogues/nouveau">
          <Button>
            <Plus className="h-4 w-4" />
            Nouveau catalogue
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {catalogs.length === 0 ? (
          <p className="col-span-2 text-center text-sm text-muted py-12 rounded-2xl border border-border bg-white">
            Aucun catalogue. Cliquez sur « Nouveau catalogue » pour commencer.
          </p>
        ) : (
        catalogs.map((catalog) => (
          <article
            key={catalog.id}
            className="rounded-2xl border border-border bg-white overflow-hidden shadow-sm hover:border-google-blue/30 transition-colors"
          >
            <div className="relative h-36">
              <Image src={catalog.image} alt={catalog.title} fill className="object-cover" sizes="50vw" />
            </div>
            <div className="p-5">
              <p className="text-xs text-muted uppercase tracking-wider">{catalog.subtitle}</p>
              <h3 className="font-semibold mt-1">{catalog.title}</h3>
              <p className="text-sm text-muted mt-2 line-clamp-2">{catalog.description}</p>
              <div className="flex gap-3 mt-4">
                <Link
                  href={`/admin/catalogues/${catalog.id}`}
                  className="inline-flex items-center gap-1 text-sm text-google-blue hover:underline"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Modifier
                </Link>
                <a
                  href={`/api/download/${catalog.downloadSlug}`}
                  className="inline-flex items-center gap-1 text-sm text-muted hover:text-google-blue"
                >
                  <Download className="h-3.5 w-3.5" />
                  PDF
                </a>
              </div>
            </div>
          </article>
        ))
        )}
      </div>
    </AdminPage>
  );
}
