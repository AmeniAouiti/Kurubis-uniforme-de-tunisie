"use client";

import Link from "next/link";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { BRAND } from "@/lib/brand";
import { Shield, ExternalLink } from "lucide-react";

export function AdminShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-google-blue-50/30">
      <header className="border-b border-border/60 bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl gradient-blue text-white shadow-lg shadow-google-blue/25">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted">
                Backoffice
              </p>
              <p className="font-bold text-google-blue leading-tight">{BRAND.name}</p>
            </div>
          </div>
          <Link
            href="/"
            onClick={() => {
              if (typeof window !== "undefined") {
                sessionStorage.setItem("kurubis-admin-preview", "1");
              }
            }}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-4 py-2 text-sm text-muted hover:text-google-blue hover:border-google-blue/30 transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Voir le site
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] px-4 py-8 lg:px-8">
        {(title || subtitle) && (
          <div className="mb-8">
            {title && <h1 className="text-2xl font-bold md:text-3xl tracking-tight">{title}</h1>}
            {subtitle && <p className="mt-1 text-muted">{subtitle}</p>}
          </div>
        )}
        <div className="flex flex-col gap-8 xl:flex-row">
          <AdminSidebar />
          <div className="flex-1 min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
