"use client";

import { AccountPage } from "@/components/account/account-page";
import { Download, FileText, BookOpen } from "lucide-react";

const downloads = [
  { name: "Facture CMD-2026-002", type: "PDF", date: "28 mai 2026", icon: FileText },
  { name: "Catalogue Kurubis uniforme 2026", type: "PDF", date: "1 janv. 2026", icon: BookOpen },
];

export default function TelechargementsPage() {
  return (
    <AccountPage title="Téléchargements" breadcrumb="Téléchargements">
      <div className="space-y-3">
        {downloads.map((doc) => (
          <button
            key={doc.name}
            className="flex w-full items-center gap-4 rounded-2xl border border-border bg-white p-5 text-left hover:border-google-blue/30 transition-all"
          >
            <doc.icon className="h-5 w-5 text-google-blue shrink-0" />
            <div className="flex-1">
              <p className="font-medium">{doc.name}</p>
              <p className="text-xs text-muted">{doc.type} — {doc.date}</p>
            </div>
            <Download className="h-4 w-4 text-muted" />
          </button>
        ))}
      </div>
    </AccountPage>
  );
}
