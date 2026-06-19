"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/contexts/cart-context";
import { useAuth } from "@/contexts/auth-context";
import { Minus, Plus, Trash2, ShoppingBag, Send } from "lucide-react";

export default function PanierPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, clearCart, totalItems } = useCart();
  const { user, isAuthenticated } = useAuth();

  async function handleSubmitQuote(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const quoteItems = items.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      sku: item.product.sku,
      quantity: item.quantity,
    }));

    const payload = {
      clientName: (form.get("name") as string) || (user ? `${user.firstName} ${user.lastName}` : ""),
      clientEmail: (form.get("email") as string) || user?.email || "",
      phone: (form.get("phone") as string) || undefined,
      company: (form.get("company") as string) || user?.company || undefined,
      subject: `Devis — ${quoteItems.length} article(s)`,
      message:
        (form.get("message") as string) ||
        `Demande de devis:\n${quoteItems.map((i) => `• ${i.productName} × ${i.quantity}`).join("\n")}`,
      items: quoteItems,
    };

    if (isAuthenticated) {
      const res = await fetch("/api/quotes/account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      clearCart();
      router.push(data.conversationId ? `/compte/conversations?c=${data.conversationId}` : "/compte/conversations");
    } else {
      const res = await fetch("/api/quotes/landing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      clearCart();
      if (res.ok) {
        router.push("/contact?sent=1");
      } else {
        const data = await res.json();
        alert(data.error || data.hint || "Erreur lors de l'envoi.");
      }
    }
  }

  return (
    <>
      <PageHeader title="Demande de devis" description="Votre sélection pour devis" breadcrumb="Accueil / Panier" />
      <div className="mx-auto max-w-4xl px-4 py-12">
        {items.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <ShoppingBag className="h-16 w-16 text-border mb-4" />
            <h2 className="text-xl font-bold">Votre panier est vide</h2>
            <Link href="/boutique" className="mt-6"><Button>Voir le catalogue</Button></Link>
          </div>
        ) : (
          <>
            <p className="mb-6 text-sm text-muted">{totalItems} article(s)</p>
            <div className="space-y-4 mb-8">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4 rounded-2xl border border-border bg-white p-4">
                  <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-surface">
                    <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.product.name}</p>
                    <div className="mt-3 flex items-center gap-3">
                      <button type="button" onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="flex h-8 w-8 items-center justify-center rounded-full border"><Minus className="h-3.5 w-3.5" /></button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="flex h-8 w-8 items-center justify-center rounded-full border"><Plus className="h-3.5 w-3.5" /></button>
                      <button type="button" onClick={() => removeItem(item.product.id)} className="ml-auto text-red-500 text-sm"><Trash2 className="h-4 w-4 inline" /> Retirer</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleSubmitQuote} className="rounded-2xl border border-border bg-white p-6 space-y-4">
              <p className="text-sm text-muted">
                {isAuthenticated
                  ? "La demande ouvre un tunnel de conversation avec notre équipe et est aussi envoyée par email."
                  : "Votre demande est enregistrée. Créez un compte avec le même email pour suivre les réponses en ligne."}
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input name="name" required defaultValue={user ? `${user.firstName} ${user.lastName}` : ""} placeholder="Nom" />
                <Input name="email" type="email" required defaultValue={user?.email ?? ""} placeholder="Email" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input name="phone" type="tel" placeholder="Téléphone" />
                <Input name="company" defaultValue={user?.company ?? ""} placeholder="Entreprise" />
              </div>
              <Textarea name="message" rows={3} placeholder="Message optionnel" />
              <Button type="submit" size="lg" className="w-full"><Send className="h-4 w-4" />Envoyer la demande</Button>
            </form>
          </>
        )}
      </div>
    </>
  );
}
