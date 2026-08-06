import { ContentPage } from "@/components/shared/ContentPage";

export default function CookiesPage() {
  return (
    <ContentPage title="Politique de cookies">
      <h2>Qu'est-ce qu'un cookie ?</h2>
      <p>
        Un cookie est un petit fichier stocké sur votre appareil qui permet
        au site de mémoriser vos préférences et votre session.
      </p>

      <h2>Les cookies que nous utilisons</h2>
      <ul>
        <li><strong>Cookies de session</strong> — pour vous garder connecté à votre compte</li>
        <li><strong>Cookies de panier</strong> — pour conserver le contenu de votre panier entre deux visites</li>
      </ul>

      <h2>Gestion des cookies</h2>
      <p>
        Vous pouvez configurer votre navigateur pour refuser les cookies,
        mais certaines fonctionnalités du site (connexion, panier) pourraient
        alors ne plus fonctionner correctement.
      </p>
    </ContentPage>
  );
}
