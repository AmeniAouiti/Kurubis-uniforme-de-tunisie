"use client";

import { AdminShell } from "@/components/admin/admin-shell";

export function AdminPage({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <AdminShell title={title} subtitle={subtitle}>
      {children}
    </AdminShell>
  );
}
