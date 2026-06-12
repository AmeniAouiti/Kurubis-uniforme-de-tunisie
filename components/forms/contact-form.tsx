"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, CheckCircle } from "lucide-react";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-google-blue-50 p-12 text-center">
        <CheckCircle className="h-12 w-12 text-google-blue mb-4" />
        <h3 className="text-xl font-bold">Message envoyé !</h3>
        <p className="mt-2 text-sm text-muted">
          Nous vous répondrons dans les plus brefs délais.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-white p-8 shadow-sm">
      <h2 className="text-xl font-bold mb-6">Demande de devis</h2>
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
          <Textarea
            name="message"
            required
            rows={5}
            placeholder="Décrivez vos besoins en tenues de travail..."
          />
        </div>
        <Button type="submit" size="lg" className="w-full">
          <Send className="h-4 w-4" />
          Envoyer la demande
        </Button>
      </div>
    </form>
  );
}
