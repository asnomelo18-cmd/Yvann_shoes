"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { IconStar, IconCheck, IconX, IconTrash, IconCircleCheck } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface AdminReview {
  id: string;
  productName: string;
  productSlug: string;
  customerName: string;
  rating: number;
  title: string | null;
  comment: string | null;
  verifiedPurchase: boolean;
  status: string;
  createdAt: string;
}

const TABS = [
  { value: "pending", label: "En attente" },
  { value: "approved", label: "Approuvés" },
  { value: "rejected", label: "Rejetés" },
];

export default function AdminAvisPage() {
  const [tab, setTab] = useState("pending");
  const queryClient = useQueryClient();

  const { data: reviews, isLoading } = useQuery({
    queryKey: ["admin", "reviews", tab],
    queryFn: async () => {
      const res = await fetch(`/api/admin/reviews?status=${tab}`);
      if (!res.ok) throw new Error("Chargement impossible.");
      const data = await res.json();
      return data.reviews as AdminReview[];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "approved" | "rejected" }) => {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Mise à jour impossible.");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] });
      toast.success("Avis mis à jour.");
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Suppression impossible.");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] });
      toast.success("Avis supprimé.");
    },
  });

  return (
    <div>
      <div className="flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              tab === t.value ? "bg-yvann-gold-600 text-yvann-black-950" : "border border-slate-300 text-text-muted dark:border-slate-700"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {isLoading ? (
          <p className="text-text-muted">Chargement...</p>
        ) : !reviews || reviews.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-300 py-10 text-center text-text-muted dark:border-slate-700">
            Aucun avis dans cette catégorie.
          </p>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <IconStar
                          key={i}
                          size={13}
                          className={i < r.rating ? "fill-yvann-warning text-yvann-warningText" : "text-slate-300 dark:text-slate-700"}
                        />
                      ))}
                    </div>
                    {r.verifiedPurchase && (
                      <span className="flex items-center gap-1 text-xs text-yvann-successText">
                        <IconCircleCheck size={12} /> Achat vérifié
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm font-medium text-text">{r.title || "(Sans titre)"}</p>
                  <p className="text-sm text-text-muted">{r.comment}</p>
                  <p className="mt-2 text-xs text-text-muted">
                    {r.customerName} · sur{" "}
                    <Link href={`/produit/${r.productSlug}`} className="text-yvann-gold-700 hover:underline">
                      {r.productName}
                    </Link>{" "}
                    · {new Date(r.createdAt).toLocaleDateString("fr-FR")}
                  </p>
                </div>

                {tab === "pending" && (
                  <div className="flex shrink-0 gap-2">
                    <button
                      onClick={() => updateStatus.mutate({ id: r.id, status: "approved" })}
                      className="rounded-full bg-yvann-success/15 p-2 text-yvann-successText hover:bg-yvann-success/25"
                      aria-label="Approuver"
                    >
                      <IconCheck size={15} />
                    </button>
                    <button
                      onClick={() => updateStatus.mutate({ id: r.id, status: "rejected" })}
                      className="rounded-full bg-yvann-danger/15 p-2 text-yvann-danger hover:bg-yvann-danger/25"
                      aria-label="Rejeter"
                    >
                      <IconX size={15} />
                    </button>
                  </div>
                )}
                {tab !== "pending" && (
                  <button
                    onClick={() => remove.mutate(r.id)}
                    className="shrink-0 rounded-full p-2 text-text-muted hover:text-yvann-danger"
                    aria-label="Supprimer"
                  >
                    <IconTrash size={15} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
