"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

export default function MotDePasseOubliePage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO : brancher sur une vraie API d'envoi d'e-mail (ex. Resend) avec
    // génération d'un lien de réinitialisation à durée limitée.
    toast.success("Si un compte existe avec cet e-mail, un lien de réinitialisation a été envoyé.");
    setSent(true);
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 pt-20 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight text-text">Mot de passe oublié</h1>
      <p className="mt-1 text-sm text-text-muted">
        Indiquez votre e-mail, nous vous envoyons un lien pour réinitialiser
        votre mot de passe.
      </p>

      {sent ? (
        <div className="mt-8 rounded-2xl border border-yvann-success/30 bg-yvann-success/5 p-6 text-sm text-text">
          Vérifiez votre boîte mail — le lien de réinitialisation arrive sous
          quelques minutes.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-muted">E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-text focus:border-yvann-gold-500 focus:outline-none dark:border-slate-700"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-yvann-gold-600 py-3 text-sm font-semibold text-yvann-black-950 hover:bg-yvann-gold-500"
          >
            Envoyer le lien
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-text-muted">
        <Link href="/connexion" className="font-medium text-yvann-gold-700 hover:underline">
          Retour à la connexion
        </Link>
      </p>
    </div>
  );
}
