# Yvann Boutique — La mode à vos pieds

Boutique en ligne de chaussures. Site client + tableau de bord admin.
Tailwind, Prisma/PostgreSQL.

## État du projet

### Client
- **Accueil** : hero vidéo, catégories, newsletter
- **Boutique** (`/boutique`) : filtres Glass Tags, tri, grille/liste, skeletons
- **Fiche produit** (`/produit/[slug]`) : galerie, sélecteurs pointure/couleur,
  avis, coverflow "Vous aimerez aussi"
- **Panier** (`CartDrawer` + `/panier`)
- **Checkout** (`/checkout`) : Adresse → Livraison → **Paiement manuel**
  (Orange Money / MTN Money / Wave / virement / espèces, avec référence de
  transaction) → Confirmation (statut "en attente de validation")

### Admin (`/admin`)
- **Vue d'ensemble** : StatCards, alerte paiements en attente
- **Paiements** : validation/rejet manuel avec confirmation
- **Commandes** : liste filtrable, détail avec changement de statut
- **Produits** : liste + formulaire (grille de stock pointure × coloris)

### Backend (routes API réelles, Prisma)
- `lib/prisma.ts`, `lib/auth.ts` (JWT + bcrypt), `lib/session.ts`
- Auth : `POST /api/auth/register`, `POST /api/auth/login`,
  `POST /api/auth/logout`, `GET /api/auth/me`
- Produits : `GET /api/products` (filtres + tri + pagination),
  `GET /api/products/[slug]`
- Commandes : `POST /api/orders` (checkout — transaction : décrémente le
  stock, crée Order/OrderItem/Payment)
- Admin : `GET/PATCH /api/admin/orders`, `GET/PATCH /api/admin/payments`
  (validation manuelle → répercute sur `Order.status`),
  `GET/POST /api/admin/products`
- Toutes les routes `/api/admin/*` sont protégées par `requireAdmin()`

> **Mise à jour** : le câblage est fait. Les pages suivantes utilisent
> désormais l'API réelle via `services/*.ts` (TanStack Query) au lieu des
> données mockées :
> - `/boutique` → `useProducts` (`GET /api/products`, filtres server-side)
> - `/produit/[slug]` → `useProduct` (`GET /api/products/[slug]`,
>   variant réel résolu pour le panier)
> - `/checkout` → `useCreateOrder` (`POST /api/orders`), redirige vers
>   `/connexion` si non authentifié
> - `/connexion`, `/inscription` (nouvelles pages) → `useLogin`/`useRegister`
> - Header → `useSession`/`useLogout` (affiche le prénom du client connecté)
> - Admin Paiements/Commandes/Vue d'ensemble → `useAdminPayments`,
>   `useUpdatePaymentStatus`, `useAdminOrders`, `useUpdateOrderStatus`,
>   `useAdminOrderDetail`
>
> **Reste en mock** : `/admin/produits` (liste + formulaire) — le formulaire
> CRUD produit n'est pas encore branché sur `POST /api/admin/products`
> (le TODO est dans `ProductForm.tsx`). Le panier lui-même (`store/cart-store.ts`)
> reste en state local Zustand + `localStorage` par design — c'est le
> checkout qui persiste en base au moment de la commande.
>
> J'ai vérifié la cohérence de tout ce code avec `tsc --noEmit` (en excluant
> les erreurs liées au client Prisma stub généré sans binaire — cf.
> limitation ci-dessous) : plus aucune erreur de type réelle.

### Limitation connue de mon environnement d'exécution

Je n'ai pas pu exécuter `prisma generate`/`migrate` dans mon sandbox : le
téléchargement du moteur Prisma (`binaries.prisma.sh`) y est bloqué par la
configuration réseau (seuls npm/pip/github sont autorisés). **Ça ne concerne
que mon environnement** — en local ou sur Vercel/Render (accès réseau
complet), ces commandes fonctionnent normalement. Le code des routes API n'a
donc pas pu tourner en conditions réelles ici ; à valider en premier chez toi.

## Démarrage local

```bash
npm install
cp .env.example .env   # renseigner DATABASE_URL et les secrets JWT
npx prisma generate --schema=database/schema.prisma
npx prisma migrate dev --schema=database/schema.prisma --name init
npm run prisma:seed
npm run dev
```

## Prochaines étapes

1. Vérifier que `prisma migrate dev` passe bien chez toi (premier test réel
   du schéma dans un environnement avec accès réseau complet).
2. Brancher `/admin/produits` (liste + formulaire) sur
   `GET/POST /api/admin/products` — actuellement encore sur
   `lib/mock-products.ts`.
3. Espace Compte client (`/compte`) : profil, adresses, historique de
   commandes, wishlist — les routes API n'existent pas encore.
4. Pages institutionnelles (CGV, FAQ, contact...) — non bloquant pour un
   premier lancement.
5. OAuth (Google/Facebook/GitHub/Apple), OTP, 2FA — stubs présents dans
   `lib/auth.ts`, non implémentés.

## Points d'attention

- Les images produits (`ProductImage.url`) sont pensées pour un stockage
  externe (CDN/S3) — `next.config.js` autorise tous les domaines HTTPS pour
  l'instant, à restreindre une fois le CDN choisi.
- Le modèle `Variant` porte le stock par combinaison pointure/couleur —
  `StockMovement` trace les entrées/sorties, décrémenté automatiquement à la
  commande (`POST /api/orders`).
- Paiement 100% manuel : pas de clé API de prestataire de paiement à
  provisionner. Les coordonnées Mobile Money/bancaires affichées au checkout
  sont pour l'instant codées dans `PaymentStep.tsx` — à terme, à déplacer
  dans `Setting` (table Prisma) pour être modifiables depuis l'admin.
