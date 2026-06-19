"use client";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminNotificationBar } from "@/components/admin/admin-notification-bar";
import { Logo } from "@/components/layout/logo";

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
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-3 lg:px-8">
          <Logo href="/admin" />
          <p className="hidden sm:block text-[10px] font-semibold uppercase tracking-widest text-muted">
            Backoffice
          </p>
        </div>
      </header>

      <AdminNotificationBar />

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
