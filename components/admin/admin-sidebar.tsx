"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { adminNavigation, adminSiteLink } from "@/lib/data/admin-nav";
import { useConversations } from "@/hooks/use-conversations";
import { useAdminPreview } from "@/contexts/admin-preview-context";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const { unreadByAdmin: unreadConversationsCount, pendingQuotes: pendingQuotesCount } = useConversations();
  const { enterSitePreview } = useAdminPreview();

  const badges: Record<string, number> = {
    "/admin/messagerie": unreadConversationsCount,
    "/admin/devis": pendingQuotesCount,
  };

  async function handleLogout() {
    await logout();
    router.push("/connexion");
  }

  return (
    <aside className="w-full xl:w-72 shrink-0">
      <div className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden sticky top-24">
        <div className="gradient-blue px-5 py-5">
          <p className="text-xs text-white/70 font-medium">Gestion plateforme</p>
          <p className="text-sm font-semibold text-white mt-0.5">Centre de contrôle</p>
        </div>
        <nav className="py-2">
          {adminNavigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            const badge = badges[item.href];
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between gap-3 px-5 py-3 text-sm transition-colors",
                  isActive
                    ? "bg-google-blue-light text-google-blue font-medium border-r-2 border-google-blue"
                    : "text-muted hover:bg-google-blue-50 hover:text-google-blue"
                )}
              >
                <span className="flex items-center gap-3">
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </span>
                {badge !== undefined && badge > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
          <div className="my-2 mx-5 border-t border-border" />
          <Link
            href={adminSiteLink.href}
            onClick={() => enterSitePreview()}
            className="flex items-center gap-3 px-5 py-3 text-sm text-muted hover:bg-google-blue-50 hover:text-google-blue transition-colors"
          >
            <adminSiteLink.icon className="h-4 w-4" />
            {adminSiteLink.label}
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-5 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </button>
        </nav>
      </div>
    </aside>
  );
}
