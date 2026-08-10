"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { IconArrowLeft, IconPlus, IconTrash, IconEdit, IconStar } from "@tabler/icons-react";
import { useSession } from "@/services/auth";
import {
  useAddresses,
  useCreateAddress,
  useUpdateAddress,
  useDeleteAddress,
  type Address,
  type AddressInput,
} from "@/services/addresses";
import { cn } from "@/lib/utils";

const EMPTY_FORM: AddressInput = {
  label: "",
  fullName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  region: "",
  postalCode: "",
  country: "Côte d'Ivoire",
  isDefault: false,
};

export default function AdressesPage() {
  const router = useRouter();
  const { data: session, isLoading: sessionLoading } = useSession();
  const { data: addresses, isLoading } = useAddresses();
  const create = useCreateAddress();
  const update = useUpdateAddress();
  const remove = useDeleteAddress();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<AddressInput>(EMPTY_FORM);

  if (!sessionLoading && !session) {
    router.push("/connexion?next=/compte/adresses");
    return null;
  }

  function openNew() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
  }

  function openEdit(address: Address) {
    setForm({
      label: address.label ?? "",
      fullName: address.fullName,
      phone: address.phone,
      line1: address.line1,
      line2: address.line2 ?? "",
      city: address.city,
      region: address.region ?? "",
      postalCode: address.postalCode ?? "",
      country: address.country,
      isDefault: address.isDefault,
    });
    setEditingId(address.id);
    setShowForm(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const onSettled = {
      onSuccess: () => {
        toast.success(editingId ? "Adresse mise à jour." : "Adresse ajoutée.");
        setShowForm(false);
      },
      onError: () => toast.error("Une erreur est survenue."),
    };
    if (editingId) {
      update.mutate({ id: editingId, ...form }, onSettled);
    } else {
      create.mutate(form, onSettled);
    }
  }

  function handleDelete(id: string) {
    if (!confirm("Supprimer cette adresse ?")) return;
    remove.mutate(id, {
      onSuccess: () => toast.success("Adresse supprimée."),
      onError: () => toast.error("Suppression impossible."),
    });
  }

  function handleSetDefault(address: Address) {
    const { id, ...rest } = address;
    update.mutate(
      { id, ...rest, isDefault: true },
      { onSuccess: () => toast.success("Adresse par défaut mise à jour.") }
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
      <Link href="/compte" className="flex items-center gap-1 text-sm text-text-muted hover:text-text">
        <IconArrowLeft size={15} /> Retour au compte
      </Link>

      <div className="mt-4 flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight text-text">Mes adresses</h1>
        <button
          onClick={openNew}
          className="flex items-center gap-1.5 rounded-full bg-yvann-gold-600 px-4 py-2 text-sm font-semibold text-yvann-black-950 hover:bg-yvann-gold-500"
        >
          <IconPlus size={16} /> Ajouter
        </button>
      </div>

      {isLoading ? (
        <p className="mt-8 text-text-muted">Chargement...</p>
      ) : !addresses || addresses.length === 0 ? (
        <p className="mt-16 text-center text-text-muted">
          Aucune adresse enregistrée — ajoutes-en une pour aller plus vite au prochain checkout.
        </p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={cn(
                "rounded-2xl border p-4",
                address.isDefault ? "border-yvann-gold-600" : "border-slate-200 dark:border-slate-800"
              )}
            >
              <div className="flex items-start justify-between">
                <div>
                  {address.label && (
                    <p className="text-xs font-medium text-yvann-gold-700">{address.label}</p>
                  )}
                  <p className="text-sm font-medium text-text">{address.fullName}</p>
                </div>
                {address.isDefault && (
                  <span className="flex items-center gap-1 rounded-full bg-yvann-gold-600/15 px-2 py-0.5 text-[11px] font-medium text-yvann-gold-700">
                    <IconStar size={11} /> Par défaut
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-text-muted">
                {address.line1}
                {address.line2 ? `, ${address.line2}` : ""}
                <br />
                {address.city}
                {address.region ? `, ${address.region}` : ""} — {address.country}
              </p>
              <p className="mt-1 text-sm text-text-muted">{address.phone}</p>

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => openEdit(address)}
                  className="flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1.5 text-xs font-medium text-text hover:border-yvann-gold-500 dark:border-slate-700"
                >
                  <IconEdit size={13} /> Modifier
                </button>
                {!address.isDefault && (
                  <button
                    onClick={() => handleSetDefault(address)}
                    className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-medium text-text hover:border-yvann-gold-500 dark:border-slate-700"
                  >
                    Définir par défaut
                  </button>
                )}
                <button
                  onClick={() => handleDelete(address.id)}
                  className="flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1.5 text-xs font-medium text-yvann-danger hover:border-yvann-danger dark:border-slate-700"
                >
                  <IconTrash size={13} /> Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowForm(false)} />
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-surface p-6">
            <h2 className="text-lg font-semibold text-text">
              {editingId ? "Modifier l'adresse" : "Nouvelle adresse"}
            </h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <input
                placeholder="Libellé (ex. Domicile, Bureau)"
                value={form.label ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                className="w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-text focus:border-yvann-gold-500 focus:outline-none dark:border-slate-700"
              />
              <input
                required
                placeholder="Nom complet"
                value={form.fullName}
                onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                className="w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-text focus:border-yvann-gold-500 focus:outline-none dark:border-slate-700"
              />
              <input
                required
                placeholder="Téléphone"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                className="w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-text focus:border-yvann-gold-500 focus:outline-none dark:border-slate-700"
              />
              <input
                required
                placeholder="Adresse"
                value={form.line1}
                onChange={(e) => setForm((f) => ({ ...f, line1: e.target.value }))}
                className="w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-text focus:border-yvann-gold-500 focus:outline-none dark:border-slate-700"
              />
              <input
                placeholder="Complément d'adresse (optionnel)"
                value={form.line2 ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, line2: e.target.value }))}
                className="w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-text focus:border-yvann-gold-500 focus:outline-none dark:border-slate-700"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  required
                  placeholder="Ville"
                  value={form.city}
                  onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                  className="w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-text focus:border-yvann-gold-500 focus:outline-none dark:border-slate-700"
                />
                <input
                  placeholder="Région (optionnel)"
                  value={form.region ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))}
                  className="w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-text focus:border-yvann-gold-500 focus:outline-none dark:border-slate-700"
                />
              </div>
              <input
                required
                placeholder="Pays"
                value={form.country}
                onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                className="w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-text focus:border-yvann-gold-500 focus:outline-none dark:border-slate-700"
              />
              <label className="flex items-center gap-2 text-sm text-text-muted">
                <input
                  type="checkbox"
                  checked={form.isDefault ?? false}
                  onChange={(e) => setForm((f) => ({ ...f, isDefault: e.target.checked }))}
                  className="h-4 w-4 accent-yvann-gold-600"
                />
                Définir comme adresse par défaut
              </label>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={create.isPending || update.isPending}
                  className="rounded-full bg-yvann-gold-600 px-6 py-2.5 text-sm font-semibold text-yvann-black-950 hover:bg-yvann-gold-500 disabled:opacity-60"
                >
                  {editingId ? "Enregistrer" : "Ajouter"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-full border border-slate-300 px-6 py-2.5 text-sm font-medium text-text dark:border-slate-700"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
