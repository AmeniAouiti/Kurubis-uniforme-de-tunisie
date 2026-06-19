"use client";

import { AccountPage } from "@/components/account/account-page";
import { useCms } from "@/contexts/cms-context";
import { Download, BookOpen } from "lucide-react";

export default function TelechargementsPage() {
  const { catalogs, hydrated } = useCms();

  return (
    <AccountPage title="Téléchargements" breadcrumb="Téléchargements">
      <p className="text-sm text-muted mb-6">
        Catalogues PDF publiés par Kurubis uniforme.
      </p>
      {!hydrated ? (
        <p className="text-sm text-muted py-8 text-center">Chargement...</p>
      ) : catalogs.length === 0 ? (
        <div className="rounded-2xl border border-border bg-white p-12 text-center text-sm text-muted">
          Aucun catalogue disponible pour le moment.
        </div>
      ) : (
        <div className="space-y-3">
          {catalogs.map((catalog) => (
            <a
              key={catalog.id}
              href={`/api/download/${catalog.downloadSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center gap-4 rounded-2xl border border-border bg-white p-5 text-left hover:border-google-blue/30 hover:shadow-md transition-all"
            >
              <BookOpen className="h-5 w-5 text-google-blue shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{catalog.title}</p>
                <p className="text-xs text-muted">{catalog.subtitle}</p>
              </div>
              <Download className="h-4 w-4 text-muted shrink-0" />
            </a>
          ))}
        </div>
      )}
    </AccountPage>
  );
}
