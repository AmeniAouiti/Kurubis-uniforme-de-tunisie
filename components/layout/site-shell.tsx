"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AdminGuard } from "@/components/admin/admin-guard";
import { AdminSitePreviewBar } from "@/components/admin/admin-site-preview-bar";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    return <AdminGuard>{children}</AdminGuard>;
  }

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <AdminSitePreviewBar />
    </>
  );
}
