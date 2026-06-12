"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useAdminPreview } from "@/contexts/admin-preview-context";

export function AdminSitePreviewBar() {
  const pathname = usePathname();
  const { isAdmin } = useAuth();
  const { sitePreview, exitSitePreview } = useAdminPreview();

  const onPublicSite = !pathname.startsWith("/admin");
  if (!isAdmin || !sitePreview || !onPublicSite) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex items-center gap-2 rounded-full border border-google-blue/30 bg-white px-4 py-2 shadow-xl shadow-google-blue/20">
      <span className="text-xs text-muted hidden sm:inline">Mode visite du site</span>
      <Link
        href="/admin"
        onClick={() => exitSitePreview()}
        className="inline-flex items-center gap-1.5 rounded-full gradient-blue px-4 py-2 text-xs font-semibold text-white hover:opacity-90"
      >
        <Shield className="h-3.5 w-3.5" />
        Retour admin
      </Link>
    </div>
  );
}
