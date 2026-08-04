import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface SeedProduct {
  slug: string;
  name: string;
  brandSlug: string;
  categorySlugs: string[];
  gender: "HOMME" | "FEMME" | "ENFANT" | "UNISEXE";
  usage: "RUNNING" | "STREETWEAR" | "TRAINING" | "VILLE" | "SPORT";
  basePrice: number;
  compareAtPrice: number | null;
  isNew: boolean;
  colors: string[]; // noms, doivent exister dans la liste Color ci-dessous
  sizes: number[]; // pointures EU disponibles
  description: string;
}

const SEED_PRODUCTS: SeedProduct[] = [
  {
    slug: "aero-runner-01",
    name: "Aero Runner 01",
    brandSlug: "nike",
    categorySlugs: ["running"],
    gender: "HOMME",
    usage: "RUNNING",
    basePrice: 65000,
    compareAtPrice: 85000,
    isNew: true,
    colors: ["Noir", "Bleu RHO"],
    sizes: [39, 40, 41, 42, 43, 44],
    description:
      "Une silhouette pensée pour accompagner chaque foulée, du bitume à la piste. Tige respirante, amorti réactif et maintien du talon renforcé.",
  },
  {
    slug: "urban-street-mid",
    name: "Urban Street Mid",
    brandSlug: "adidas",
    categorySlugs: ["sneakers"],
    gender: "HOMME",
    usage: "STREETWEAR",
    basePrice: 58000,
    compareAtPrice: null,
    isNew: false,
    colors: ["Blanc", "Gris ardoise"],
    sizes: [38, 39, 40, 41, 42],
    description:
      "Silhouette montante inspirée du streetwear, semelle épaisse et tige en cuir texturé pour un look affirmé au quotidien.",
  },
  {
    slug: "flow-knit-w",
    name: "Flow Knit W",
    brandSlug: "new-balance",
    categorySlugs: ["running"],
    gender: "FEMME",
    usage: "RUNNING",
    basePrice: 72000,
    compareAtPrice: 90000,
    isNew: true,
    colors: ["Cyan", "Noir"],
    sizes: [36, 37, 38, 39, 40],
    description:
      "Tige tricotée extensible qui épouse la forme du pied, amorti léger pour les longues distances.",
  },
  {
    slug: "classic-court",
    name: "Classic Court",
    brandSlug: "puma",
    categorySlugs: ["ville"],
    gender: "HOMME",
    usage: "VILLE",
    basePrice: 45000,
    compareAtPrice: null,
    isNew: false,
    colors: ["Blanc"],
    sizes: [40, 41, 42, 43, 44, 45],
    description:
      "Le sneaker de ville intemporel, cuir pleine fleur et semelle en caoutchouc gomme.",
  },
  {
    slug: "trainer-grip-w",
    name: "Trainer Grip W",
    brandSlug: "nike",
    categorySlugs: ["training"],
    gender: "FEMME",
    usage: "TRAINING",
    basePrice: 61000,
    compareAtPrice: 70000,
    isNew: false,
    colors: ["Bleu RHO", "Gris ardoise"],
    sizes: [36, 37, 38, 39],
    description:
      "Stabilité et accroche pour les séances intenses, maintien latéral renforcé.",
  },
  {
    slug: "junior-bounce",
    name: "Junior Bounce",
    brandSlug: "adidas",
    categorySlugs: ["sneakers"],
    gender: "ENFANT",
    usage: "SPORT",
    basePrice: 32000,
    compareAtPrice: null,
    isNew: true,
    colors: ["Cyan", "Blanc"],
    sizes: [28, 29, 30, 31, 32],
    description:
      "Légère et colorée, pensée pour l'énergie débordante des plus jeunes — fermeture scratch facile.",
  },
  {
    slug: "swift-pace-02",
    name: "Swift Pace 02",
    brandSlug: "new-balance",
    categorySlugs: ["running"],
    gender: "HOMME",
    usage: "RUNNING",
    basePrice: 78000,
    compareAtPrice: 95000,
    isNew: false,
    colors: ["Noir"],
    sizes: [40, 41, 42, 43, 44, 45],
    description:
      "Amorti haute performance pour les coureurs réguliers, drop optimisé pour la propulsion.",
  },
  {
    slug: "city-walk-w",
    name: "City Walk W",
    brandSlug: "puma",
    categorySlugs: ["ville"],
    gender: "FEMME",
    usage: "VILLE",
    basePrice: 49000,
    compareAtPrice: null,
    isNew: false,
    colors: ["Blanc", "Bleu RHO"],
    sizes: [36, 37, 38, 39, 40],
    description:
      "Confort urbain au quotidien, semelle intérieure moulante et tige respirante.",
  },
];

async function main() {
  // Marques
  await prisma.brand.createMany({
    data: [
      { name: "Nike", slug: "nike" },
      { name: "Adidas", slug: "adidas" },
      { name: "New Balance", slug: "new-balance" },
      { name: "Puma", slug: "puma" },
    ],
    skipDuplicates: true,
  });

  // Catégories
  await prisma.category.createMany({
    data: [
      { name: "Homme", slug: "homme" },
      { name: "Femme", slug: "femme" },
      { name: "Enfant", slug: "enfant" },
      { name: "Sneakers", slug: "sneakers" },
      { name: "Running", slug: "running" },
      { name: "Training", slug: "training" },
      { name: "Ville", slug: "ville" },
    ],
    skipDuplicates: true,
  });

  // Pointures EU 28 à 46, demi-pointures incluses (28-32 pour la gamme enfant)
  const sizes = [];
  for (let eu = 28; eu <= 46; eu += 0.5) {
    sizes.push({ eu });
  }
  await prisma.size.createMany({ data: sizes, skipDuplicates: true });

  // Couleurs de base
  await prisma.color.createMany({
    data: [
      { name: "Noir", hexCode: "#0B1220" },
      { name: "Blanc", hexCode: "#F8FAFC" },
      { name: "Bleu RHO", hexCode: "#2563EB" },
      { name: "Cyan", hexCode: "#06B6D4" },
      { name: "Gris ardoise", hexCode: "#64748B" },
    ],
    skipDuplicates: true,
  });

  // Devise et langue par défaut
  await prisma.currency.upsert({
    where: { code: "XOF" },
    update: {},
    create: { code: "XOF", symbol: "FCFA", rate: 1 },
  });
  await prisma.language.upsert({
    where: { code: "fr" },
    update: {},
    create: { code: "fr", name: "Français" },
  });

  // Produits de démo + variantes (pointure × coloris) avec stock
  for (const p of SEED_PRODUCTS) {
    const brand = await prisma.brand.findUniqueOrThrow({ where: { slug: p.brandSlug } });
    const categories = await prisma.category.findMany({
      where: { slug: { in: p.categorySlugs } },
    });

    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug,
        sku: `RHO-${p.slug.toUpperCase()}`,
        name: p.name,
        description: p.description,
        materials: "Tige en mesh technique et overlays synthétiques, semelle intermédiaire en mousse EVA.",
        careInstructions: "Nettoyer avec un chiffon légèrement humide, laisser sécher à l'air libre.",
        gender: p.gender,
        usage: p.usage,
        brandId: brand.id,
        basePrice: p.basePrice,
        compareAtPrice: p.compareAtPrice,
        isNew: p.isNew,
        isPublished: true,
        isFeatured: p.isNew,
        avgRating: 4.3,
        reviewCount: 0,
        categories: { create: categories.map((c) => ({ categoryId: c.id })) },
        images: {
          create: [
            { url: `https://picsum.photos/seed/${p.slug}-1/800/800`, angle: "Face", position: 0 },
            { url: `https://picsum.photos/seed/${p.slug}-2/800/800`, angle: "Profil", position: 1 },
            { url: `https://picsum.photos/seed/${p.slug}-3/800/800`, angle: "Semelle", position: 2 },
          ],
        },
      },
    });

    for (const sizeEu of p.sizes) {
      const size = await prisma.size.findUniqueOrThrow({ where: { eu: sizeEu } });
      for (const colorName of p.colors) {
        const color = await prisma.color.findUniqueOrThrow({ where: { name: colorName } });
        await prisma.variant.upsert({
          where: { productId_sizeId_colorId: { productId: product.id, sizeId: size.id, colorId: color.id } },
          update: {},
          create: {
            productId: product.id,
            sizeId: size.id,
            colorId: color.id,
            stock: 8,
          },
        });
      }
    }
  }

  console.log(`Seed terminé — ${SEED_PRODUCTS.length} produits créés avec leurs variantes.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
