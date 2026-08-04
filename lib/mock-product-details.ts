import { MOCK_PRODUCTS, type MockProduct } from "@/lib/mock-products";

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  date: string;
}

export interface ProductDetail extends MockProduct {
  sku: string;
  description: string;
  materials: string;
  careInstructions: string;
  weightGrams: number;
  drop: number | null;
  soleType: string;
  images: { url: string; angle: string }[];
  reviews: ProductReview[];
}

const GENERIC_DESCRIPTION =
  "Une silhouette pensée pour accompagner chaque foulée, du bitume à la piste. Tige respirante, amorti réactif et maintien du talon renforcé pour un confort qui dure toute la journée.";

const GENERIC_MATERIALS =
  "Tige en mesh technique et overlays synthétiques, semelle intermédiaire en mousse EVA, semelle extérieure en caoutchouc gomme.";

const GENERIC_CARE =
  "Nettoyer avec un chiffon légèrement humide, laisser sécher à l'air libre à l'abri du soleil direct. Éviter le lave-linge.";

function buildReviews(productId: string, avgRating: number): ProductReview[] {
  const base = [
    {
      author: "Aïcha K.",
      title: "Très confortable",
      comment: "Je les porte tous les jours pour aller au travail, aucune gêne même après plusieurs heures debout.",
      verifiedPurchase: true,
      date: "2026-06-12",
    },
    {
      author: "Moussa D.",
      title: "Bon maintien",
      comment: "Le maintien du talon est vraiment bien pensé, parfait pour la course sur route.",
      verifiedPurchase: true,
      date: "2026-05-28",
    },
    {
      author: "Fatou S.",
      title: "Taille un peu grand",
      comment: "Belle paire mais je conseille de prendre une demi-pointure en dessous de votre taille habituelle.",
      verifiedPurchase: false,
      date: "2026-05-02",
    },
  ];
  return base.map((r, i) => ({
    id: `${productId}-review-${i}`,
    rating: Math.max(3, Math.round(avgRating) - (i === 2 ? 1 : 0)),
    ...r,
  }));
}

export function getProductDetail(slug: string): ProductDetail | null {
  const product = MOCK_PRODUCTS.find((p) => p.slug === slug);
  if (!product) return null;

  return {
    ...product,
    sku: `YV-${product.id.padStart(5, "0")}`,
    description: GENERIC_DESCRIPTION,
    materials: GENERIC_MATERIALS,
    careInstructions: GENERIC_CARE,
    weightGrams: 280,
    drop: product.category === "running" ? 8 : null,
    soleType: product.category === "running" ? "Caoutchouc gomme, crantée" : "Caoutchouc gomme",
    images: [
      { url: product.imageUrl, angle: "Face" },
      { url: product.imageUrl, angle: "Profil" },
      { url: product.imageUrl, angle: "Arrière" },
      { url: product.imageUrl, angle: "Semelle" },
    ],
    reviews: buildReviews(product.id, product.avgRating),
  };
}

export function getRelatedProducts(slug: string, count = 6): MockProduct[] {
  const current = MOCK_PRODUCTS.find((p) => p.slug === slug);
  return MOCK_PRODUCTS.filter(
    (p) => p.slug !== slug && (!current || p.category === current.category)
  ).slice(0, count);
}
