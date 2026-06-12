"use client";

import { AccountSidebar } from "@/components/layout/account-sidebar";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PasswordAlert } from "@/components/account/password-alert";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";

export function AccountShell({
  title,
  breadcrumb,
  children,
}: {
  title: string;
  breadcrumb: string;
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center text-muted text-sm">
        Chargement...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Accès au compte</h1>
        <p className="text-muted mb-6">
          Connectez-vous pour accéder à votre tableau de bord et gérer vos commandes.
        </p>
        <Link
          href="/connexion"
          className="inline-flex rounded-full bg-google-blue px-8 py-3 text-sm font-semibold text-white hover:bg-google-blue-dark transition-colors"
        >
          Se connecter
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-surface min-h-[60vh]">
      <div className="border-b border-border bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <Breadcrumbs items={[{ label: breadcrumb }]} />
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 md:text-3xl">{title}</h1>
        <PasswordAlert />
        {user && (
          <p className="mb-6 text-sm text-muted">
            Bonjour{" "}
            <strong className="text-foreground">
              {user.firstName.toLowerCase()}.{user.lastName.toLowerCase()}
            </strong>{" "}
            — gérez vos commandes, adresses et préférences depuis votre espace.
          </p>
        )}
        <div className="flex flex-col gap-8 lg:flex-row">
          <AccountSidebar />
          <div className="flex-1 min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
