import { ContentPage } from "@/components/shared/ContentPage";

const FAQ_ITEMS = [
  {
    q: "Comment choisir ma pointure ?",
    a: "Consultez notre guide des pointures qui convertit les tailles EU en US/UK, et donne des conseils selon le type de chaussure.",
  },
  {
    q: "Quels moyens de paiement acceptez-vous ?",
    a: "Orange Money, MTN Money, Wave, virement bancaire, et paiement en espèces à la livraison.",
  },
  {
    q: "Combien de temps prend la livraison ?",
    a: "2 à 5 jours ouvrés en livraison standard, 24 à 48h en livraison express.",
  },
  {
    q: "Puis-je retourner un article ?",
    a: "Oui, sous 30 jours, à condition que l'article soit non porté et dans son emballage d'origine.",
  },
  {
    q: "Comment suivre ma commande ?",
    a: "Depuis votre espace « Mon compte », dans la section « Mes commandes ».",
  },
  {
    q: "Les tailles enfant sont-elles différentes ?",
    a: "Oui, la pointure enfant suit aussi l'échelle EU mais sur une plage plus petite (28 à 32 généralement).",
  },
];

export default function FaqPage() {
  return (
    <ContentPage title="Foire aux questions" subtitle="Les réponses aux questions les plus fréquentes.">
      <div className="space-y-3">
        {FAQ_ITEMS.map((item) => (
          <details
            key={item.q}
            className="group rounded-2xl border border-slate-200 p-4 dark:border-slate-800"
          >
            <summary className="cursor-pointer list-none text-sm font-medium text-text">
              {item.q}
            </summary>
            <p className="mt-2 text-sm text-text-muted">{item.a}</p>
          </details>
        ))}
      </div>
    </ContentPage>
  );
}
