import { ContentPage } from "@/components/shared/ContentPage";

export default function ConfidentialitePage() {
  return (
    <ContentPage title="Politique de confidentialité">
      <h2>Données collectées</h2>
      <p>
        Nous collectons les informations que vous nous fournissez lors de la
        création de votre compte (nom, e-mail, téléphone) et de vos commandes
        (adresse de livraison, historique d'achats).
      </p>

      <h2>Utilisation des données</h2>
      <p>
        Vos données sont utilisées pour traiter vos commandes, assurer le
        suivi de livraison, et vous contacter en cas de besoin concernant
        votre compte ou vos achats.
      </p>

      <h2>Partage des données</h2>
      <p>
        Vos données ne sont jamais vendues à des tiers. Elles peuvent être
        partagées avec nos prestataires de livraison uniquement dans le cadre
        de l'exécution de votre commande.
      </p>

      <h2>Vos droits</h2>
      <p>
        Vous pouvez à tout moment demander l'accès, la rectification ou la
        suppression de vos données personnelles en nous contactant.
      </p>
    </ContentPage>
  );
}
