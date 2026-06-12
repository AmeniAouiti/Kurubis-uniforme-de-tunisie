"use client";

import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogIn } from "lucide-react";

export default function ConnexionPage() {
  return (
    <>
      <PageHeader
        title="Connexion"
        description="Accédez à votre compte client"
        breadcrumb="Accueil / Connexion"
      />
      <div className="mx-auto max-w-md px-4 py-12">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="rounded-2xl border border-border bg-white p-8 shadow-sm"
        >
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Email</label>
              <Input type="email" required placeholder="votre@email.com" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Mot de passe</label>
              <Input type="password" required placeholder="••••••••" />
            </div>
            <Button type="submit" size="lg" className="w-full">
              <LogIn className="h-4 w-4" />
              Se connecter
            </Button>
          </div>
          <p className="mt-6 text-center text-sm text-muted">
            Pas encore de compte ?{" "}
            <Link href="/inscription" className="text-google-blue hover:underline font-medium">
              S&apos;inscrire
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}
