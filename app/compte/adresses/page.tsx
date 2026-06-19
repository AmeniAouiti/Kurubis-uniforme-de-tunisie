"use client";

import { useCallback, useEffect, useState } from "react";
import { AccountPage } from "@/components/account/account-page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Plus, Pencil, Trash2 } from "lucide-react";
import type { UserAddress } from "@/lib/db/map-address";

type AddressForm = {
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  label: string;
};

const emptyForm: AddressForm = {
  street: "",
  city: "",
  postalCode: "",
  country: "Tunisie",
  phone: "",
  label: "",
};

export default function AdressesPage() {
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [showShippingForm, setShowShippingForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [billingForm, setBillingForm] = useState<AddressForm>(emptyForm);
  const [shippingForm, setShippingForm] = useState<AddressForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  const billing = addresses.find((a) => a.type === "billing");
  const shippingList = addresses.filter((a) => a.type === "shipping");

  const load = useCallback(async () => {
    const res = await fetch("/api/profile/addresses");
    if (res.ok) {
      const data = await res.json();
      setAddresses(data.addresses || []);
      const bill = (data.addresses as UserAddress[]).find((a) => a.type === "billing");
      if (bill) {
        setBillingForm({
          street: bill.street,
          city: bill.city,
          postalCode: bill.postalCode,
          country: bill.country,
          phone: bill.phone || "",
          label: bill.label || "",
        });
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function saveBilling(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = { ...billingForm, type: "billing" as const };

    const res = billing
      ? await fetch(`/api/profile/addresses/${billing.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      : await fetch("/api/profile/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

    setSaving(false);
    if (res.ok) await load();
  }

  async function deleteBilling() {
    if (!billing || !confirm("Supprimer l'adresse de facturation ?")) return;
    await fetch(`/api/profile/addresses/${billing.id}`, { method: "DELETE" });
    setBillingForm(emptyForm);
    await load();
  }

  async function saveShipping(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = { ...shippingForm, type: "shipping" as const };

    const res = editingId
      ? await fetch(`/api/profile/addresses/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      : await fetch("/api/profile/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

    setSaving(false);
    if (res.ok) {
      setShowShippingForm(false);
      setEditingId(null);
      setShippingForm(emptyForm);
      await load();
    }
  }

  async function deleteShipping(id: string) {
    if (!confirm("Supprimer cette adresse de livraison ?")) return;
    await fetch(`/api/profile/addresses/${id}`, { method: "DELETE" });
    await load();
  }

  function startEditShipping(addr: UserAddress) {
    setEditingId(addr.id);
    setShippingForm({
      street: addr.street,
      city: addr.city,
      postalCode: addr.postalCode,
      country: addr.country,
      phone: addr.phone || "",
      label: addr.label || "",
    });
    setShowShippingForm(true);
  }

  function formatLine(addr: UserAddress) {
    return `${addr.street}, ${addr.postalCode} ${addr.city}, ${addr.country}`;
  }

  if (loading) {
    return (
      <AccountPage title="Adresses" breadcrumb="Adresses">
        <p className="text-sm text-muted py-8 text-center">Chargement...</p>
      </AccountPage>
    );
  }

  return (
    <AccountPage title="Adresses" breadcrumb="Adresses">
      <div className="space-y-8 max-w-2xl">
        {/* Facturation */}
        <section className="rounded-2xl border border-border bg-white p-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-google-blue" />
            <h2 className="font-semibold">Adresse de facturation</h2>
          </div>
          <form onSubmit={saveBilling} className="space-y-3">
            <Input placeholder="Rue / adresse" value={billingForm.street} onChange={(e) => setBillingForm({ ...billingForm, street: e.target.value })} required />
            <div className="grid gap-3 sm:grid-cols-2">
              <Input placeholder="Ville" value={billingForm.city} onChange={(e) => setBillingForm({ ...billingForm, city: e.target.value })} required />
              <Input placeholder="Code postal" value={billingForm.postalCode} onChange={(e) => setBillingForm({ ...billingForm, postalCode: e.target.value })} required />
            </div>
            <Input placeholder="Pays" value={billingForm.country} onChange={(e) => setBillingForm({ ...billingForm, country: e.target.value })} />
            <Input placeholder="Téléphone" value={billingForm.phone} onChange={(e) => setBillingForm({ ...billingForm, phone: e.target.value })} />
            <div className="flex flex-wrap gap-2 pt-2">
              <Button type="submit" size="sm" disabled={saving}>
                {billing ? "Modifier" : "Enregistrer"}
              </Button>
              {billing && (
                <Button type="button" size="sm" variant="outline" className="text-red-600" onClick={deleteBilling}>
                  <Trash2 className="h-3.5 w-3.5" />Supprimer
                </Button>
              )}
            </div>
          </form>
        </section>

        {/* Livraison colis */}
        <section className="rounded-2xl border border-border bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-google-blue" />
              <h2 className="font-semibold">Adresses de livraison (colis)</h2>
            </div>
            {!showShippingForm && (
              <Button size="sm" variant="outline" onClick={() => { setShowShippingForm(true); setEditingId(null); setShippingForm(emptyForm); }}>
                <Plus className="h-4 w-4" />Ajouter
              </Button>
            )}
          </div>

          {shippingList.length === 0 && !showShippingForm && (
            <p className="text-sm text-muted">Aucune adresse de livraison. Ajoutez-en une pour recevoir vos colis.</p>
          )}

          <div className="space-y-3 mb-4">
            {shippingList.map((addr) => (
              <div key={addr.id} className="rounded-xl border border-border p-4">
                {addr.label && <p className="text-xs font-medium text-google-blue mb-1">{addr.label}</p>}
                <p className="text-sm text-muted">{formatLine(addr)}</p>
                {addr.phone && <p className="text-xs text-muted mt-1">{addr.phone}</p>}
                <div className="flex gap-3 mt-3">
                  <button type="button" onClick={() => startEditShipping(addr)} className="text-sm text-google-blue hover:underline inline-flex items-center gap-1">
                    <Pencil className="h-3.5 w-3.5" />Modifier
                  </button>
                  <button type="button" onClick={() => deleteShipping(addr.id)} className="text-sm text-red-600 hover:underline inline-flex items-center gap-1">
                    <Trash2 className="h-3.5 w-3.5" />Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>

          {showShippingForm && (
            <form onSubmit={saveShipping} className="space-y-3 border-t border-border pt-4">
              <Input placeholder="Libellé (ex. Entrepôt, Bureau)" value={shippingForm.label} onChange={(e) => setShippingForm({ ...shippingForm, label: e.target.value })} />
              <Input placeholder="Rue / adresse" value={shippingForm.street} onChange={(e) => setShippingForm({ ...shippingForm, street: e.target.value })} required />
              <div className="grid gap-3 sm:grid-cols-2">
                <Input placeholder="Ville" value={shippingForm.city} onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })} required />
                <Input placeholder="Code postal" value={shippingForm.postalCode} onChange={(e) => setShippingForm({ ...shippingForm, postalCode: e.target.value })} required />
              </div>
              <Input placeholder="Pays" value={shippingForm.country} onChange={(e) => setShippingForm({ ...shippingForm, country: e.target.value })} />
              <Input placeholder="Téléphone" value={shippingForm.phone} onChange={(e) => setShippingForm({ ...shippingForm, phone: e.target.value })} />
              <div className="flex gap-2">
                <Button type="submit" size="sm" disabled={saving}>{editingId ? "Modifier" : "Ajouter"}</Button>
                <Button type="button" size="sm" variant="outline" onClick={() => { setShowShippingForm(false); setEditingId(null); }}>Annuler</Button>
              </div>
            </form>
          )}
        </section>
      </div>
    </AccountPage>
  );
}
