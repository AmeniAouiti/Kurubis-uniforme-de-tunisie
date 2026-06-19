"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, CheckCircle } from "lucide-react";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);

    const res = await fetch("/api/quotes/landing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientName: form.get("name"),
        clientEmail: form.get("email"),
        phone: form.get("phone") || undefined,
        subject: "Demande de devis — Contact",
        message: form.get("message"),
        items: [],
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || data.hint || "Erreur lors de l'envoi.");
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-google-blue-50 p-12 text-center">
        <CheckCircle className="h-12 w-12 text-google-blue mb-4" />
        <h3 className="text-xl font-bold">Demande envoyée !</h3>
        <p className="mt-2 text-sm text-muted max-w-md">
          Notre équipe a reçu votre demande. Vous serez notifié par email lors d&apos;une réponse.
          Pour suivre la conversation en ligne,{" "}
          <a href="/inscription" className="text-google-blue hover:underline font-medium">créez un compte</a>{" "}
          avec la même adresse email.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-white p-8 shadow-sm">
      <h2 className="text-xl font-bold mb-6">Demande de devis</h2>
      {error && (
        <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Nom</label>
            <Input name="name" required placeholder="Votre nom" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Email</label>
            <Input name="email" type="email" required placeholder="votre@email.com" />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Téléphone</label>
          <Input name="phone" type="tel" placeholder="+216 XX XXX XXX" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Message</label>
          <Textarea name="message" required rows={5} placeholder="Décrivez vos besoins..." />
        </div>
        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          <Send className="h-4 w-4" />
          {loading ? "Envoi..." : "Envoyer la demande"}
        </Button>
      </div>
    </form>
  );
}
