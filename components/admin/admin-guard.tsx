"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { Shield } from "lucide-react";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isAdmin, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/connexion");
    } else if (!loading && isAuthenticated && !isAdmin) {
      router.replace("/compte");
    }
  }, [loading, isAuthenticated, isAdmin, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted text-sm">
        Chargement...
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <Shield className="h-12 w-12 text-google-blue mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">Accès réservé aux administrateurs</h1>
          <p className="text-muted mb-6 text-sm">
            Connectez-vous avec un compte admin créé dans Supabase.
          </p>
          <Link
            href="/connexion"
            className="inline-flex rounded-full bg-google-blue px-6 py-2.5 text-sm font-semibold text-white"
          >
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
