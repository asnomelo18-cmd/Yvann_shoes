"use client";

import * as Tabs from "@radix-ui/react-tabs";
import type { ProductDetail } from "@/lib/mock-product-details";

export function ProductTabs({ product }: { product: ProductDetail }) {
  return (
    <Tabs.Root defaultValue="description" className="mt-14">
      <Tabs.List className="flex gap-6 border-b border-slate-200 dark:border-slate-800">
        {[
          { value: "description", label: "Description" },
          { value: "materials", label: "Matières & entretien" },
          { value: "shipping", label: "Livraison" },
          { value: "warranty", label: "Garantie" },
          { value: "returns", label: "Retours" },
        ].map((tab) => (
          <Tabs.Trigger
            key={tab.value}
            value={tab.value}
            className="border-b-2 border-transparent pb-3 text-sm font-medium text-text-muted data-[state=active]:border-yvann-gold-600 data-[state=active]:text-text"
          >
            {tab.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      <Tabs.Content value="description" className="max-w-2xl py-6 text-sm leading-relaxed text-text-muted">
        {product.description}
        <dl className="mt-6 grid grid-cols-2 gap-4 text-text">
          <div>
            <dt className="text-xs text-text-muted">Référence</dt>
            <dd className="font-medium">{product.sku}</dd>
          </div>
          <div>
            <dt className="text-xs text-text-muted">Poids</dt>
            <dd className="font-medium">{product.weightGrams} g</dd>
          </div>
          {product.drop && (
            <div>
              <dt className="text-xs text-text-muted">Drop</dt>
              <dd className="font-medium">{product.drop} mm</dd>
            </div>
          )}
          <div>
            <dt className="text-xs text-text-muted">Semelle</dt>
            <dd className="font-medium">{product.soleType}</dd>
          </div>
        </dl>
      </Tabs.Content>

      <Tabs.Content value="materials" className="max-w-2xl py-6 text-sm leading-relaxed text-text-muted">
        <p>{product.materials}</p>
        <p className="mt-3">{product.careInstructions}</p>
      </Tabs.Content>

      <Tabs.Content value="shipping" className="max-w-2xl py-6 text-sm leading-relaxed text-text-muted">
        Livraison standard sous 2 à 5 jours ouvrés. Livraison express disponible
        au checkout. Suivi de commande en temps réel depuis votre compte.
      </Tabs.Content>

      <Tabs.Content value="warranty" className="max-w-2xl py-6 text-sm leading-relaxed text-text-muted">
        Garantie fabricant de 6 mois contre les défauts de fabrication à
        compter de la date d'achat.
      </Tabs.Content>

      <Tabs.Content value="returns" className="max-w-2xl py-6 text-sm leading-relaxed text-text-muted">
        Retours gratuits sous 30 jours, produit non porté et dans son
        emballage d'origine. Remboursement ou échange au choix.
      </Tabs.Content>
    </Tabs.Root>
  );
}
