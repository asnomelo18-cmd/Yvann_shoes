"use client";

import { Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { loginSchema, type LoginFormValues } from "@/lib/auth-schemas";
import { useLogin } from "@/services/auth";

function ConnexionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginFormValues) {
    try {
      await login.mutateAsync(values);
      toast.success("Connexion réussie.");
      router.push(searchParams.get("next") ?? "/compte");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Connexion impossible.");
    }
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 pt-20 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight text-text">Se connecter</h1>
      <p className="mt-1 text-sm text-text-muted">Accédez à votre compte RHO.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-text-muted">E-mail</label>
          <input
            type="email"
            {...register("email")}
            className="w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-text focus:border-rho-blue-500 focus:outline-none dark:border-slate-700"
          />
          {errors.email && <p className="mt-1 text-xs text-rho-danger">{errors.email.message}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="mb-1.5 block text-xs font-medium text-text-muted">
              Mot de passe
            </label>
            <Link href="/mot-de-passe-oublie" className="text-xs text-rho-blue-600 hover:underline">
              Mot de passe oublié ?
            </Link>
          </div>
          <input
            type="password"
            {...register("password")}
            className="w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-text focus:border-rho-blue-500 focus:outline-none dark:border-slate-700"
          />
          {errors.password && (
            <p className="mt-1 text-xs text-rho-danger">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={login.isPending}
          className="w-full rounded-full bg-rho-blue-600 py-3 text-sm font-semibold text-white hover:bg-rho-blue-700 disabled:opacity-60"
        >
          {login.isPending ? "Connexion..." : "Se connecter"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-text-muted">
        Pas encore de compte ?{" "}
        <Link href="/inscription" className="font-medium text-rho-blue-600 hover:underline">
          Créer un compte
        </Link>
      </p>
    </div>
  );
}

export default function ConnexionPage() {
  return (
    <Suspense fallback={null}>
      <ConnexionForm />
    </Suspense>
  );
}
