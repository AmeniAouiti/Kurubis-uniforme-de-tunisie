"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { User } from "lucide-react";
import { accountNavigation, logoutItem } from "@/lib/data/account-nav";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";

export function UserMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (!isAuthenticated) {
    return (
      <Link
        href="/connexion"
        className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-google-blue-light transition-colors"
        aria-label="Mon compte"
        title="Mon compte"
      >
        <User className="h-5 w-5 text-google-blue" />
      </Link>
    );
  }

  const displayName = user
    ? `${user.firstName.toLowerCase()}.${user.lastName.toLowerCase()}`
    : "";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full transition-colors",
          open ? "bg-google-blue text-white" : "hover:bg-google-blue-light text-google-blue"
        )}
        aria-label="Mon compte"
        title="Mon compte"
      >
        <User className="h-5 w-5" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-border bg-white py-2 shadow-xl shadow-google-blue/10 z-50 animate-fade-in-up">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-xs text-muted">Connecté en tant que</p>
            <p className="text-sm font-semibold text-google-blue truncate">{displayName}</p>
          </div>
          <nav className="py-1">
            {accountNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-google-blue-light hover:text-google-blue transition-colors"
              >
                <item.icon className="h-4 w-4 text-muted" />
                {item.label}
              </Link>
            ))}
            <div className="my-1 border-t border-border" />
            <button
              onClick={async () => {
                await logout();
                setOpen(false);
              }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <logoutItem.icon className="h-4 w-4" />
              {logoutItem.label}
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}
