import { ContentPage } from "@/components/shared/ContentPage";

export default function RetoursPage() {
  return (
    <ContentPage title="Retours & remboursements" subtitle="30 jours pour changer d'avis.">
      <h2>Conditions de retour</h2>
      <p>
        Vous disposez de 30 jours après réception pour nous retourner un
        article, à condition qu'il soit non porté et dans son emballage
        d'origine.
      </p>

      <h2>Comment faire une demande de retour</h2>
      <ul>
        <li>Connectez-vous à votre espace <strong>Mon compte</strong></li>
        <li>Sélectionnez la commande concernée</li>
        <li>Choisissez le motif du retour et le mode de remboursement souhaité</li>
      </ul>

      <h2>Remboursement</h2>
      <p>
        Une fois le retour reçu et vérifié, le remboursement est effectué
        selon le moyen de paiement utilisé à la commande (Mobile Money,
        virement) ou sous forme d'avoir, selon votre choix.
      </p>
    </ContentPage>
  );
}
