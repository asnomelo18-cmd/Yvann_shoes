import { Hero } from "@/components/sections/Hero";
import { CategoryGrid } from "@/components/sections/CategoryGrid";
import { Newsletter } from "@/components/sections/Newsletter";

// TODO : brancher les sections dynamiques suivantes sur services/products.ts (TanStack Query)
// - "Modèles du moment" (TiltedCoverflow, §3.2 de la spec)
// - "Flash sale" avec compte à rebours
// - "Nouveautés" / "Meilleures ventes"
// - "Marques" (logos)
// - "Avis clients"
// Chacune doit afficher un skeleton (composants/animations) pendant le chargement.

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <Newsletter />
    </>
  );
}
