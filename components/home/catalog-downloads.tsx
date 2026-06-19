"use client";

import Image from "next/image";
import Link from "next/link";
import { Download, ArrowRight } from "lucide-react";
import { useCms } from "@/contexts/cms-context";

export function CatalogDownloads() {
  const { catalogs } = useCms();

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-google-blue mb-2">
            Documentation
          </p>
          <h2 className="text-2xl font-bold md:text-3xl tracking-tight">Nos catalogues</h2>
          <p className="mt-2 text-muted">
            Téléchargez nos catalogues PDF et découvrez toute notre gamme
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {catalogs.map((catalog) => (
            <article
              key={catalog.id}
              className="group overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all duration-300 hover:border-google-blue/30 hover:shadow-xl hover:shadow-google-blue/10 hover:-translate-y-1"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={catalog.image}
                  alt={catalog.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-xs font-medium text-white/80 uppercase tracking-wider">
                    {catalog.subtitle}
                  </p>
                  <h3 className="text-lg font-bold text-white leading-tight mt-1">
                    {catalog.title}
                  </h3>
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm text-muted leading-relaxed mb-5">
                  {catalog.description}
                </p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <a
                    href={`/api/download/${catalog.downloadSlug}`}
                    download={catalog.fileName}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-google-blue px-4 py-2.5 text-sm font-semibold text-white hover:bg-google-blue-dark transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    Télécharger PDF
                  </a>
                  <Link
                    href={catalog.href}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-google-blue px-4 py-2.5 text-sm font-semibold text-google-blue hover:bg-google-blue-light transition-colors"
                  >
                    Voir en ligne
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
