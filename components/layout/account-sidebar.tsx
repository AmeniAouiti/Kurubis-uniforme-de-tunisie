"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { accountNavigation, logoutItem } from "@/lib/data/account-nav";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";

export function AccountSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="w-full lg:w-72 shrink-0">
      <div className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden sticky top-28">
        {user && (
          <div className="gradient-blue px-5 py-4">
            <p className="text-xs text-white/70">Mon compte</p>
            <p className="text-sm font-semibold text-white truncate">
              {user.firstName} {user.lastName}
            </p>
          </div>
        )}
        <nav className="py-2">
          {accountNavigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/compte" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-5 py-3 text-sm transition-colors",
                  isActive
                    ? "bg-google-blue-light text-google-blue font-medium border-r-2 border-google-blue"
                    : "text-muted hover:bg-google-blue-50 hover:text-google-blue"
                )}
              >
                <item.icon className={cn("h-4 w-4", isActive ? "text-google-blue" : "text-muted")} />
                {item.label}
              </Link>
            );
          })}
          <div className="my-2 mx-5 border-t border-border" />
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 px-5 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <logoutItem.icon className="h-4 w-4" />
            {logoutItem.label}
          </button>
        </nav>
      </div>
    </aside>
  );
}
