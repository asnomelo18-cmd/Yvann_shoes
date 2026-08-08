"use client";

import { useState } from "react";
import { toast } from "sonner";
import { IconMail, IconPhone, IconMapPin } from "@tabler/icons-react";
import { useShopSettings } from "@/services/settings";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const { data: settings } = useShopSettings();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO : brancher sur un service d'envoi d'e-mail (ex. Resend) côté API
    toast.success("Message envoyé — nous vous répondons sous 24h.");
    setSent(true);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight text-text">Contact</h1>
      <p className="mt-2 text-text-muted">Une question ? Écrivez-nous, on vous répond vite.</p>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <div className="space-y-4">
          {settings?.email && (
            <div className="flex items-center gap-3 text-sm text-text">
              <IconMail size={18} className="text-yvann-gold-text" /> {settings.email}
            </div>
          )}
          {settings?.phone && (
            <div className="flex items-center gap-3 text-sm text-text">
              <IconPhone size={18} className="text-yvann-gold-text" /> {settings.phone}
            </div>
          )}
          <div className="flex items-center gap-3 text-sm text-text">
            <IconMapPin size={18} className="text-yvann-gold-text" /> Abidjan, Côte d'Ivoire
          </div>
        </div>

        {sent ? (
          <div className="rounded-2xl border border-yvann-success/30 bg-yvann-success/5 p-6 text-sm text-text">
            Merci, votre message a bien été envoyé. Nous vous répondons sous 24h.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-muted">Nom</label>
              <input
                required
                className="w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-text focus:border-yvann-gold-500 focus:outline-none dark:border-slate-700"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-muted">E-mail</label>
              <input
                type="email"
                required
                className="w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-text focus:border-yvann-gold-500 focus:outline-none dark:border-slate-700"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-muted">Message</label>
              <textarea
                required
                rows={5}
                className="w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-text focus:border-yvann-gold-500 focus:outline-none dark:border-slate-700"
              />
            </div>
            <button
              type="submit"
              className="rounded-full bg-yvann-gold-600 px-6 py-3 text-sm font-semibold text-yvann-black-950 hover:bg-yvann-gold-500"
            >
              Envoyer
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
