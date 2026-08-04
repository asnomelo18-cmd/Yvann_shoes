"use client";

import { useState } from "react";
import { toast } from "sonner";
import { IconSend2 } from "@tabler/icons-react";

export function Newsletter() {
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    // TODO: brancher sur services/newsletter.ts (appel API)
    toast.success("Merci ! Vous êtes inscrit à la newsletter Yvann.");
    setEmail("");
  }

  return (
    <section className="bg-surface-2">
      <div className="mx-auto max-w-3xl px-6 py-16 text-center sm:px-8">
        <h2 className="text-2xl font-semibold tracking-tight text-text sm:text-3xl">
          Ne manquez aucune sortie
        </h2>
        <p className="mt-3 text-text-muted">
          Nouveautés, ventes flash et conseils pointure directement dans votre
          boîte mail.
        </p>
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-6 flex max-w-md items-center gap-2 rounded-full border border-slate-300 bg-surface p-1.5 dark:border-slate-700"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            className="flex-1 bg-transparent px-4 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none"
          />
          <button
            type="submit"
            aria-label="S'inscrire"
            className="flex items-center gap-2 rounded-full bg-yvann-gold-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-yvann-gold-700"
          >
            <IconSend2 size={16} />
          </button>
        </form>
      </div>
    </section>
  );
}
