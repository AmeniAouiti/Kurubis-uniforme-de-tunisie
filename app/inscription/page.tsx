"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

export default function InscriptionPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = new FormData(e.currentTarget);
    const result = await signup({
      email: form.get("email") as string,
      password: form.get("password") as string,
      firstName: form.get("firstName") as string,
      lastName: form.get("lastName") as string,
      phone: (form.get("phone") as string) || undefined,
    });

    if (!result.ok) {
      setError(result.error || "Erreur lors de l'inscription");
      return;
    }
    setDone(true);
    setTimeout(() => router.push("/connexion"), 2500);
  }

  if (done) {
    return (
      <>
        <PageHeader title="Inscription réussie" breadcrumb="Accueil / Inscription" />
        <div className="mx-auto max-w-md px-4 py-12 text-center">
          <CheckCircle className="h-12 w-12 text-google-blue mx-auto mb-4" />
          <h2 className="text-xl font-bold">Compte créé !</h2>
          <p className="text-muted mt-2 text-sm">Vérifiez votre email puis connectez-vous.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Créer un compte"
        description="Inscrivez-vous pour suivre vos commandes et devis"
        breadcrumb="Accueil / Inscription"
      />
      <div className="mx-auto max-w-md px-4 py-12">
        <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-white p-8 shadow-sm space-y-4">
          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Prénom</label>
              <Input name="firstName" required placeholder="Prénom" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Nom</label>
              <Input name="lastName" required placeholder="Nom" />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Email</label>
            <Input name="email" type="email" required placeholder="votre@email.com" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Téléphone</label>
            <Input name="phone" type="tel" placeholder="+216 XX XXX XXX" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Mot de passe</label>
            <Input name="password" type="password" required minLength={6} placeholder="••••••••" />
          </div>
          <Button type="submit" size="lg" className="w-full">
            <UserPlus className="h-4 w-4" />
            Créer mon compte
          </Button>
          <p className="text-center text-sm text-muted">
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
