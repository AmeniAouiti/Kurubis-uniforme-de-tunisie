"use client";

import { X, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { BRAND } from "@/lib/brand";

export function PasswordAlert() {
  const { showPasswordAlert, dismissPasswordAlert } = useAuth();

  if (!showPasswordAlert) return null;

  return (
    <div className="mb-6 flex items-start gap-3 rounded-xl bg-google-blue px-5 py-4 text-white">
      <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
      <p className="flex-1 text-sm leading-relaxed">
        Votre compte pour <strong>{BRAND.name}</strong> utilise un mot de passe temporaire.
        Nous vous avons envoyé un lien par e-mail pour modifier votre mot de passe.
      </p>
      <button
        onClick={dismissPasswordAlert}
        className="shrink-0 rounded-full p-1 hover:bg-white/20 transition-colors"
        aria-label="Fermer"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
