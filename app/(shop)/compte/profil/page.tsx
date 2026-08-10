"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { IconArrowLeft } from "@tabler/icons-react";
import { useSession } from "@/services/auth";
import { useUpdateProfile, useChangePassword } from "@/services/account";
import { ALL_SIZES } from "@/lib/mock-products";

export default function ProfilPage() {
  const router = useRouter();
  const { data: session, isLoading } = useSession();
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    usualSize: "",
    favoriteStyle: "",
  });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirm: "" });

  useEffect(() => {
    if (session) {
      setForm({
        firstName: session.firstName ?? "",
        lastName: session.lastName ?? "",
        phone: session.phone ?? "",
        usualSize: session.usualSize ? String(session.usualSize) : "",
        favoriteStyle: session.favoriteStyle ?? "",
      });
    }
  }, [session]);

  if (!isLoading && !session) {
    router.push("/connexion?next=/compte/profil");
    return null;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateProfile.mutate(
      {
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone || undefined,
        usualSize: form.usualSize ? Number(form.usualSize) : null,
        favoriteStyle: form.favoriteStyle || undefined,
      },
      {
        onSuccess: () => toast.success("Profil mis à jour."),
        onError: (error) => toast.error(error instanceof Error ? error.message : "Erreur."),
      }
    );
  }

  function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirm) {
      toast.error("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }
    changePassword.mutate(
      { currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword },
      {
        onSuccess: () => {
          toast.success("Mot de passe changé.");
          setPasswordForm({ currentPassword: "", newPassword: "", confirm: "" });
        },
        onError: (error) => toast.error(error instanceof Error ? error.message : "Erreur."),
      }
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
      <Link href="/compte" className="flex items-center gap-1 text-sm text-text-muted hover:text-text">
        <IconArrowLeft size={15} /> Retour au compte
      </Link>

      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-text">Mon profil</h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-2xl border border-slate-200 p-6 dark:border-slate-800">
        <h2 className="text-sm font-semibold text-text">Informations personnelles</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-muted">Prénom</label>
            <input
              value={form.firstName}
              onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
              className="w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-text focus:border-yvann-gold-500 focus:outline-none dark:border-slate-700"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-muted">Nom</label>
            <input
              value={form.lastName}
              onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
              className="w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-text focus:border-yvann-gold-500 focus:outline-none dark:border-slate-700"
            />
          </div>
          <div className="col-span-2">
            <label className="mb-1.5 block text-xs font-medium text-text-muted">E-mail</label>
            <input
              value={session?.email ?? ""}
              disabled
              className="w-full cursor-not-allowed rounded-xl border border-slate-300 bg-surface-2 px-4 py-2.5 text-sm text-text-muted dark:border-slate-700"
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
            <label className="mb-1.5 block text-xs font-medium text-text-muted">Pointure habituelle</label>
            <select
              value={form.usualSize}
              onChange={(e) => setForm((f) => ({ ...f, usualSize: e.target.value }))}
              className="w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-text focus:border-yvann-gold-500 focus:outline-none dark:border-slate-700"
            >
              <option value="">Non renseignée</option>
              {ALL_SIZES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-2">
            <label className="mb-1.5 block text-xs font-medium text-text-muted">Style favori</label>
            <input
              value={form.favoriteStyle}
              onChange={(e) => setForm((f) => ({ ...f, favoriteStyle: e.target.value }))}
              placeholder="Ex. Streetwear, running, ville..."
              className="w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-text focus:border-yvann-gold-500 focus:outline-none dark:border-slate-700"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={updateProfile.isPending}
          className="rounded-full bg-yvann-gold-600 px-6 py-2.5 text-sm font-semibold text-yvann-black-950 hover:bg-yvann-gold-500 disabled:opacity-60"
        >
          {updateProfile.isPending ? "Enregistrement..." : "Enregistrer"}
        </button>
      </form>

      <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-4 rounded-2xl border border-slate-200 p-6 dark:border-slate-800">
        <h2 className="text-sm font-semibold text-text">Mot de passe</h2>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-text-muted">Mot de passe actuel</label>
          <input
            type="password"
            value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm((f) => ({ ...f, currentPassword: e.target.value }))}
            className="w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-text focus:border-yvann-gold-500 focus:outline-none dark:border-slate-700"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-muted">Nouveau mot de passe</label>
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm((f) => ({ ...f, newPassword: e.target.value }))}
              className="w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-text focus:border-yvann-gold-500 focus:outline-none dark:border-slate-700"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-muted">Confirmer</label>
            <input
              type="password"
              value={passwordForm.confirm}
              onChange={(e) => setPasswordForm((f) => ({ ...f, confirm: e.target.value }))}
              className="w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-text focus:border-yvann-gold-500 focus:outline-none dark:border-slate-700"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={changePassword.isPending}
          className="rounded-full border border-slate-300 px-6 py-2.5 text-sm font-medium text-text hover:border-yvann-gold-500 disabled:opacity-60 dark:border-slate-700"
        >
          {changePassword.isPending ? "Changement..." : "Changer le mot de passe"}
        </button>
      </form>
    </div>
  );
}
