"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { IconPlus, IconTrash, IconDeviceFloppy } from "@tabler/icons-react";
import { useAdminSettings, useSaveSettings } from "@/services/settings";
import { DEFAULT_SETTINGS, type ShopSettings } from "@/lib/settings";

export default function AdminParametresPage() {
  const { data, isLoading } = useAdminSettings();
  const save = useSaveSettings();
  const [form, setForm] = useState<ShopSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    save.mutate(form, {
      onSuccess: () => toast.success("Réglages enregistrés."),
      onError: () => toast.error("Enregistrement impossible."),
    });
  }

  if (isLoading) return <p className="text-text-muted">Chargement...</p>;

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
      <section>
        <h3 className="mb-4 text-sm font-semibold text-text">Boutique</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-muted">Nom affiché</label>
            <input
              value={form.shopName}
              onChange={(e) => setForm((f) => ({ ...f, shopName: e.target.value }))}
              className="w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-text focus:border-yvann-gold-500 focus:outline-none dark:border-slate-700"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-muted">Nom légal (CGV)</label>
            <input
              value={form.legalName}
              onChange={(e) => setForm((f) => ({ ...f, legalName: e.target.value }))}
              className="w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-text focus:border-yvann-gold-500 focus:outline-none dark:border-slate-700"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-muted">Téléphone</label>
            <input
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              className="w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-text focus:border-yvann-gold-500 focus:outline-none dark:border-slate-700"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-muted">E-mail de contact</label>
            <input
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-text focus:border-yvann-gold-500 focus:outline-none dark:border-slate-700"
            />
          </div>
        </div>
      </section>

      <section>
        <h3 className="mb-4 text-sm font-semibold text-text">Réseaux sociaux</h3>
        <div className="grid grid-cols-2 gap-4">
          {(["instagram", "tiktok", "facebook", "x"] as const).map((key) => (
            <div key={key}>
              <label className="mb-1.5 block text-xs font-medium capitalize text-text-muted">{key}</label>
              <input
                value={form.social[key]}
                onChange={(e) => setForm((f) => ({ ...f, social: { ...f.social, [key]: e.target.value } }))}
                placeholder="https://..."
                className="w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-text focus:border-yvann-gold-500 focus:outline-none dark:border-slate-700"
              />
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-4 text-sm font-semibold text-text">Moyens de paiement (numéros affichés au checkout)</h3>
        <p className="mb-4 text-xs text-text-muted">
          Laisse un champ vide pour masquer ce moyen de paiement au checkout — évite d'afficher un
          numéro factice aux clients.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-muted">Orange Money</label>
            <input
              value={form.payment.orangeMoney}
              onChange={(e) => setForm((f) => ({ ...f, payment: { ...f.payment, orangeMoney: e.target.value } }))}
              className="w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-text focus:border-yvann-gold-500 focus:outline-none dark:border-slate-700"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-muted">MTN Money</label>
            <input
              value={form.payment.mtnMoney}
              onChange={(e) => setForm((f) => ({ ...f, payment: { ...f.payment, mtnMoney: e.target.value } }))}
              className="w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-text focus:border-yvann-gold-500 focus:outline-none dark:border-slate-700"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-muted">Wave</label>
            <input
              value={form.payment.wave}
              onChange={(e) => setForm((f) => ({ ...f, payment: { ...f.payment, wave: e.target.value } }))}
              className="w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-text focus:border-yvann-gold-500 focus:outline-none dark:border-slate-700"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-muted">RIB / virement</label>
            <input
              value={form.payment.bankAccount}
              onChange={(e) => setForm((f) => ({ ...f, payment: { ...f.payment, bankAccount: e.target.value } }))}
              className="w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-text focus:border-yvann-gold-500 focus:outline-none dark:border-slate-700"
            />
          </div>
        </div>
      </section>

      <section>
        <h3 className="mb-4 text-sm font-semibold text-text">Zones de livraison & tarifs (XOF)</h3>
        <div className="space-y-3">
          {form.shippingZones.map((zone, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={zone.name}
                onChange={(e) => {
                  const zones = [...form.shippingZones];
                  zones[i] = { name: e.target.value, price: zones[i]?.price ?? 0 };
                  setForm((f) => ({ ...f, shippingZones: zones }));
                }}
                placeholder="Nom de la zone"
                className="flex-1 rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-text focus:border-yvann-gold-500 focus:outline-none dark:border-slate-700"
              />
              <input
                type="number"
                value={zone.price}
                onChange={(e) => {
                  const zones = [...form.shippingZones];
                  zones[i] = { name: zones[i]?.name ?? "", price: Number(e.target.value) };
                  setForm((f) => ({ ...f, shippingZones: zones }));
                }}
                placeholder="Prix"
                className="w-32 rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-text focus:border-yvann-gold-500 focus:outline-none dark:border-slate-700"
              />
              <button
                type="button"
                onClick={() =>
                  setForm((f) => ({ ...f, shippingZones: f.shippingZones.filter((_, idx) => idx !== i) }))
                }
                className="rounded-full p-2 text-text-muted hover:text-yvann-danger"
                aria-label="Retirer cette zone"
              >
                <IconTrash size={15} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setForm((f) => ({ ...f, shippingZones: [...f.shippingZones, { name: "", price: 0 }] }))
            }
            className="flex items-center gap-1.5 text-sm font-medium text-yvann-gold-600 hover:underline"
          >
            <IconPlus size={15} /> Ajouter une zone
          </button>
        </div>
      </section>

      <button
        type="submit"
        disabled={save.isPending}
        className="flex items-center gap-2 rounded-full bg-yvann-gold-600 px-6 py-3 text-sm font-semibold text-yvann-black-950 hover:bg-yvann-gold-500 disabled:opacity-60"
      >
        <IconDeviceFloppy size={16} /> {save.isPending ? "Enregistrement..." : "Enregistrer"}
      </button>
    </form>
  );
}
