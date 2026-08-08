"use client";

import { ContentPage } from "@/components/shared/ContentPage";
import { useShopSettings } from "@/services/settings";
import { formatPrice } from "@/lib/utils";

export default function LivraisonPage() {
  const { data: settings } = useShopSettings();

  return (
    <ContentPage title="Livraison" subtitle="Zones et tarifs de livraison.">
      <h2>Zones et tarifs</h2>
      {settings && settings.shippingZones.length > 0 ? (
        <ul>
          {settings.shippingZones.map((zone) => (
            <li key={zone.name}>
              <strong>{zone.name}</strong> — {formatPrice(zone.price)}
            </li>
          ))}
        </ul>
      ) : (
        <p>Zones de livraison en cours de mise à jour.</p>
      )}

      <h2>Suivi de commande</h2>
      <p>
        Une fois votre commande expédiée, vous pouvez suivre son statut
        directement depuis votre espace{" "}
        <a href="/compte" className="text-yvann-gold-text hover:underline">
          Mon compte
        </a>
        .
      </p>
    </ContentPage>
  );
}
