"use client";

import { AccountPage } from "@/components/account/account-page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth-context";

export default function DetailsComptePage() {
  const { user } = useAuth();

  return (
    <AccountPage title="Détails du compte" breadcrumb="Détails du compte">
      <form onSubmit={(e) => e.preventDefault()} className="rounded-2xl border border-border bg-white p-6 space-y-4 max-w-lg">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Prénom</label>
            <Input defaultValue={user?.firstName} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Nom</label>
            <Input defaultValue={user?.lastName} />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Email</label>
          <Input type="email" defaultValue={user?.email} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Entreprise</label>
          <Input defaultValue={user?.company} />
        </div>
        <hr className="border-border" />
        <div>
          <label className="mb-1.5 block text-sm font-medium">Nouveau mot de passe</label>
          <Input type="password" placeholder="••••••••" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Confirmer le mot de passe</label>
          <Input type="password" placeholder="••••••••" />
        </div>
        <Button type="submit">Enregistrer les modifications</Button>
      </form>
    </AccountPage>
  );
}
