"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogIn } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { BRAND } from "@/lib/brand";

export default function ConnexionPage() {
  const router = useRouter();
  const { login, isAuthenticated, isAdmin, loading } = useAuth();
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace(isAdmin ? "/admin" : "/compte");
    }
  }, [isAuthenticated, isAdmin, loading, router]);

  if (loading || isAuthenticated) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    const result = await login(email, password);
    if (!result.ok) {
      setError(result.error || "Identifiants incorrects");
      return;
    }
    router.push(result.role === "admin" ? "/admin" : "/compte");
  }

  return (
    <>
      <PageHeader
        title="Connexion"
        description={`Accédez à votre compte ${BRAND.name}`}
        breadcrumb="Connexion"
      />
      <div className="mx-auto max-w-md px-4 py-12">
        <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-white p-8 shadow-sm space-y-4">
          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>
          )}
          <div>
            <label className="mb-1.5 block text-sm font-medium">Email</label>
            <Input name="email" type="email" required placeholder="votre@email.com" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Mot de passe</label>
            <Input name="password" type="password" required placeholder="••••••••" />
          </div>
          <Button type="submit" size="lg" className="w-full">
            <LogIn className="h-4 w-4" />
            Se connecter
          </Button>
          <p className="text-center text-sm text-muted">
            Pas encore de compte ?{" "}
            <Link href="/inscription" className="text-google-blue hover:underline font-medium">
              S&apos;inscrire
            </Link>
          </p>
          <p className="text-center text-xs text-muted pt-2">
            Les administrateurs se connectent avec le même formulaire.
          </p>
        </form>
      </div>
    </>
  );
}
