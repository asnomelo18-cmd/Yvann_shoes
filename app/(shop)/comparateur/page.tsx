"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { IconGitCompare, IconX } from "@tabler/icons-react";
import { useSession } from "@/services/auth";
import { useCompareList, useToggleCompare } from "@/services/compare";
import { formatPrice } from "@/lib/utils";

const USAGE_LABELS: Record<string, string> = {
  RUNNING: "Running",
  STREETWEAR: "Streetwear",
  TRAINING: "Training",
  VILLE: "Ville",
  SPORT: "Sport",
};

const GENDER_LABELS: Record<string, string> = {
  HOMME: "Homme",
  FEMME: "Femme",
  ENFANT: "Enfant",
  UNISEXE: "Unisexe",
};

export default function ComparateurPage() {
  const router = useRouter();
  const { data: session, isLoading: sessionLoading } = useSession();
  const { data: items, isLoading } = useCompareList();
  const { remove } = useToggleCompare();

  if (!sessionLoading && !session) {
    return (
      <div className="mx-auto max-w-md px-4 pb-20 pt-32 text-center">
        <p className="text-text-muted">Connectez-vous pour utiliser le comparateur.</p>
        <button
          onClick={() => router.push("/connexion?next=/comparateur")}
          className="mt-4 rounded-full bg-yvann-gold-600 px-6 py-3 text-sm font-semibold text-yvann-black-950 hover:bg-yvann-gold-500"
        >
          Se connecter
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight text-text">Comparateur</h1>
      <p className="mt-1 text-sm text-text-muted">Comparez jusqu'à 4 paires côte à côte.</p>

      {isLoading ? (
        <p className="mt-10 text-text-muted">Chargement...</p>
      ) : !items || items.length === 0 ? (
        <div className="mt-16 flex flex-col items-center gap-3 text-center">
          <IconGitCompare size={32} className="text-text-muted" />
          <p className="text-text-muted">Aucune paire à comparer pour l'instant.</p>
          <Link
            href="/boutique"
            className="mt-2 rounded-full bg-yvann-gold-600 px-6 py-3 text-sm font-semibold text-yvann-black-950 hover:bg-yvann-gold-500"
          >
            Découvrir la boutique
          </Link>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse text-left text-sm">
            <thead>
              <tr>
                <th className="w-40" />
                {items.map((item) => (
                  <th key={item.productId} className="px-4 pb-4">
                    <div className="relative">
                      <button
                        aria-label="Retirer du comparateur"
                        onClick={() => remove.mutate(item.productId)}
                        className="absolute -right-1 -top-1 rounded-full bg-surface-2 p-1 text-text-muted hover:text-yvann-danger"
                      >
                        <IconX size={14} />
                      </button>
                      <Link href={`/produit/${item.slug}`} className="block">
                        <div className="aspect-square overflow-hidden rounded-2xl bg-surface-2">
                          {item.imageUrl && (
                            <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                          )}
                        </div>
                        <p className="mt-2 text-xs text-text-muted">{item.brand}</p>
                        <p className="text-sm font-medium text-text">{item.name}</p>
                        <p className="mt-1 text-sm font-semibold text-text">{formatPrice(item.basePrice)}</p>
                      </Link>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {[
                { label: "Genre", get: (i: (typeof items)[number]) => GENDER_LABELS[i.gender] ?? i.gender },
                { label: "Usage", get: (i: (typeof items)[number]) => (i.usage ? USAGE_LABELS[i.usage] ?? i.usage : "—") },
                { label: "Poids", get: (i: (typeof items)[number]) => (i.weightGrams ? `${i.weightGrams} g` : "—") },
                { label: "Drop", get: (i: (typeof items)[number]) => (i.drop ? `${i.drop} mm` : "—") },
                { label: "Semelle", get: (i: (typeof items)[number]) => i.soleType ?? "—" },
                { label: "Note", get: (i: (typeof items)[number]) => `${i.avgRating.toFixed(1)} / 5` },
              ].map((row) => (
                <tr key={row.label}>
                  <td className="py-3 text-xs font-medium text-text-muted">{row.label}</td>
                  {items.map((item) => (
                    <td key={item.productId} className="px-4 py-3 text-text">
                      {row.get(item)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
