"use client";

import { useEffect, useState } from "react";
import { AccountPage } from "@/components/account/account-page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AvatarUpload } from "@/components/account/avatar-upload";
import { useAuth } from "@/contexts/auth-context";

export default function DetailsComptePage() {
  const { user, refreshProfile } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) return;
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setEmail(user.email);
    setCompany(user.company || "");
    setPhone(user.phone || "");
    setAvatarUrl(user.avatarUrl || "");
  }, [user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, company, phone, avatarUrl }),
    });

    setSaving(false);
    if (res.ok) {
      setMessage("Profil enregistré.");
      await refreshProfile();
    } else {
      const data = await res.json();
      setMessage(data.error || "Erreur");
    }
  }

  return (
    <AccountPage title="Détails du compte" breadcrumb="Détails du compte">
      <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-white p-6 space-y-6 max-w-lg">
        <AvatarUpload value={avatarUrl} onChange={setAvatarUrl} />

        {message && (
          <p className={`text-sm ${message.includes("Erreur") ? "text-red-600" : "text-green-700"}`}>
            {message}
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Prénom</label>
            <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Nom</label>
            <Input value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Email</label>
          <Input type="email" value={email} disabled className="bg-surface" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Téléphone</label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+216 ..." />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Entreprise</label>
          <Input value={company} onChange={(e) => setCompany(e.target.value)} />
        </div>
        <Button type="submit" disabled={saving}>
          {saving ? "Enregistrement..." : "Enregistrer les modifications"}
        </Button>
      </form>
    </AccountPage>
  );
}
