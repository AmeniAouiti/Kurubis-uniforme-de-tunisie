"use client";

import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus } from "lucide-react";

export default function InscriptionPage() {
  return (
    <>
      <PageHeader
        title="Créer un compte"
        description="Inscrivez-vous pour suivre vos commandes et devis"
        breadcrumb="Accueil / Inscription"
      />
      <div className="mx-auto max-w-md px-4 py-12">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="rounded-2xl border border-border bg-white p-8 shadow-sm"
        >
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Prénom</label>
                <Input required placeholder="Prénom" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Nom</label>
                <Input required placeholder="Nom" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Email</label>
              <Input type="email" required placeholder="votre@email.com" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Téléphone</label>
              <Input type="tel" placeholder="+216 XX XXX XXX" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Mot de passe</label>
              <Input type="password" required placeholder="••••••••" />
            </div>
            <Button type="submit" size="lg" className="w-full">
              <UserPlus className="h-4 w-4" />
              Créer mon compte
            </Button>
          </div>
          <p className="mt-6 text-center text-sm text-muted">
            Déjà un compte ?{" "}
            <Link href="/connexion" className="text-google-blue hover:underline font-medium">
              Se connecter
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}
