import { ContentPage } from "@/components/shared/ContentPage";

export default function LivraisonPage() {
  return (
    <ContentPage title="Livraison" subtitle="Délais, zones et suivi de votre commande.">
      <h2>Délais de livraison</h2>
      <ul>
        <li><strong>Livraison standard</strong> — 2 à 5 jours ouvrés</li>
        <li><strong>Livraison express</strong> — 24 à 48h</li>
      </ul>

      <h2>Zones couvertes</h2>
      <p>
        Nous livrons actuellement à Abidjan et dans les principales villes de
        Côte d'Ivoire. Les délais peuvent varier selon la zone de livraison.
      </p>

      <h2>Suivi de commande</h2>
      <p>
        Une fois votre commande expédiée, vous pouvez suivre son statut
        directement depuis votre espace{" "}
        <a href="/compte" className="text-yvann-gold-600 hover:underline">
          Mon compte
        </a>
        .
      </p>

      <h2>Frais de livraison</h2>
      <p>
        Les frais de livraison sont calculés au moment du paiement, selon le
        mode choisi (standard ou express).
      </p>
    </ContentPage>
  );
}
