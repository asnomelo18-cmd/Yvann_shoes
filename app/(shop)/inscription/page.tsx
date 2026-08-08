"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { registerSchema, type RegisterFormValues } from "@/lib/auth-schemas";
import { useRegister } from "@/services/auth";

export default function InscriptionPage() {
  const router = useRouter();
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(values: RegisterFormValues) {
    try {
      await registerMutation.mutateAsync(values);
      toast.success("Compte créé — bienvenue sur Yvann !");
      router.push("/compte");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Inscription impossible.");
    }
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 pt-20 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight text-text">Créer un compte</h1>
      <p className="mt-1 text-sm text-text-muted">
        Rejoignez Yvann pour suivre vos commandes et profiter du programme de fidélité.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-muted">Prénom</label>
            <input
              {...register("firstName")}
              className="w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-text focus:border-yvann-gold-500 focus:outline-none dark:border-slate-700"
            />
            {errors.firstName && (
              <p className="mt-1 text-xs text-yvann-danger">{errors.firstName.message}</p>
            )}
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-muted">Nom</label>
            <input
              {...register("lastName")}
              className="w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-text focus:border-yvann-gold-500 focus:outline-none dark:border-slate-700"
            />
            {errors.lastName && (
              <p className="mt-1 text-xs text-yvann-danger">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-text-muted">E-mail</label>
          <input
            type="email"
            {...register("email")}
            className="w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-text focus:border-yvann-gold-500 focus:outline-none dark:border-slate-700"
          />
          {errors.email && <p className="mt-1 text-xs text-yvann-danger">{errors.email.message}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-text-muted">Mot de passe</label>
          <input
            type="password"
            {...register("password")}
            className="w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-text focus:border-yvann-gold-500 focus:outline-none dark:border-slate-700"
          />
          {errors.password && (
            <p className="mt-1 text-xs text-yvann-danger">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-text-muted">
            Confirmer le mot de passe
          </label>
          <input
            type="password"
            {...register("confirmPassword")}
            className="w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-text focus:border-yvann-gold-500 focus:outline-none dark:border-slate-700"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-yvann-danger">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={registerMutation.isPending}
          className="w-full rounded-full bg-yvann-gold-600 py-3 text-sm font-semibold text-white hover:bg-yvann-gold-700 disabled:opacity-60"
        >
          {registerMutation.isPending ? "Création..." : "Créer mon compte"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-text-muted">
        Déjà un compte ?{" "}
        <Link href="/connexion" className="font-medium text-yvann-gold-700 hover:underline">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
