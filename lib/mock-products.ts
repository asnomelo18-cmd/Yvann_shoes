export interface MockProduct {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: "sneakers" | "running" | "ville" | "training";
  gender: "homme" | "femme" | "enfant";
  usage: "running" | "streetwear" | "training" | "ville" | "sport";
  basePrice: number;
  compareAtPrice: number | null;
  imageUrl: string;
  isNew: boolean;
  avgRating: number;
  colors: { name: string; hex: string }[];
  availableSizes: number[]; // EU
}

// TODO : remplacer par un appel à services/products.ts → /api/products (Prisma)
export const MOCK_PRODUCTS: MockProduct[] = [
  {
    id: "1",
    slug: "aero-runner-01",
    name: "Aero Runner 01",
    brand: "Nike",
    category: "running",
    gender: "homme",
    usage: "running",
    basePrice: 65000,
    compareAtPrice: 85000,
    imageUrl: "/images/products/aero-runner-01.jpg",
    isNew: true,
    avgRating: 4.6,
    colors: [
      { name: "Noir", hex: "#0B1220" },
      { name: "Bleu RHO", hex: "#2563EB" },
    ],
    availableSizes: [39, 40, 41, 42, 43, 44],
  },
  {
    id: "2",
    slug: "urban-street-mid",
    name: "Urban Street Mid",
    brand: "Adidas",
    category: "sneakers",
    gender: "homme",
    usage: "streetwear",
    basePrice: 58000,
    compareAtPrice: null,
    imageUrl: "/images/products/urban-street-mid.jpg",
    isNew: false,
    avgRating: 4.3,
    colors: [
      { name: "Blanc", hex: "#F8FAFC" },
      { name: "Gris ardoise", hex: "#64748B" },
    ],
    availableSizes: [38, 39, 40, 41, 42],
  },
  {
    id: "3",
    slug: "flow-knit-w",
    name: "Flow Knit W",
    brand: "New Balance",
    category: "running",
    gender: "femme",
    usage: "running",
    basePrice: 72000,
    compareAtPrice: 90000,
    imageUrl: "/images/products/flow-knit-w.jpg",
    isNew: true,
    avgRating: 4.8,
    colors: [
      { name: "Cyan", hex: "#06B6D4" },
      { name: "Noir", hex: "#0B1220" },
    ],
    availableSizes: [36, 37, 38, 39, 40],
  },
  {
    id: "4",
    slug: "classic-court",
    name: "Classic Court",
    brand: "Puma",
    category: "ville",
    gender: "homme",
    usage: "ville",
    basePrice: 45000,
    compareAtPrice: null,
    imageUrl: "/images/products/classic-court.jpg",
    isNew: false,
    avgRating: 4.1,
    colors: [{ name: "Blanc", hex: "#F8FAFC" }],
    availableSizes: [40, 41, 42, 43, 44, 45],
  },
  {
    id: "5",
    slug: "trainer-grip-w",
    name: "Trainer Grip W",
    brand: "Nike",
    category: "training",
    gender: "femme",
    usage: "training",
    basePrice: 61000,
    compareAtPrice: 70000,
    imageUrl: "/images/products/trainer-grip-w.jpg",
    isNew: false,
    avgRating: 4.4,
    colors: [
      { name: "Bleu RHO", hex: "#2563EB" },
      { name: "Gris ardoise", hex: "#64748B" },
    ],
    availableSizes: [36, 37, 38, 39],
  },
  {
    id: "6",
    slug: "junior-bounce",
    name: "Junior Bounce",
    brand: "Adidas",
    category: "sneakers",
    gender: "enfant",
    usage: "sport",
    basePrice: 32000,
    compareAtPrice: null,
    imageUrl: "/images/products/junior-bounce.jpg",
    isNew: true,
    avgRating: 4.5,
    colors: [
      { name: "Cyan", hex: "#06B6D4" },
      { name: "Blanc", hex: "#F8FAFC" },
    ],
    availableSizes: [28, 29, 30, 31, 32],
  },
  {
    id: "7",
    slug: "swift-pace-02",
    name: "Swift Pace 02",
    brand: "New Balance",
    category: "running",
    gender: "homme",
    usage: "running",
    basePrice: 78000,
    compareAtPrice: 95000,
    imageUrl: "/images/products/swift-pace-02.jpg",
    isNew: false,
    avgRating: 4.7,
    colors: [{ name: "Noir", hex: "#0B1220" }],
    availableSizes: [40, 41, 42, 43, 44, 45],
  },
  {
    id: "8",
    slug: "city-walk-w",
    name: "City Walk W",
    brand: "Puma",
    category: "ville",
    gender: "femme",
    usage: "ville",
    basePrice: 49000,
    compareAtPrice: null,
    imageUrl: "/images/products/city-walk-w.jpg",
    isNew: false,
    avgRating: 4.2,
    colors: [
      { name: "Blanc", hex: "#F8FAFC" },
      { name: "Bleu RHO", hex: "#2563EB" },
    ],
    availableSizes: [36, 37, 38, 39, 40],
  },
];

export const BRANDS = Array.from(new Set(MOCK_PRODUCTS.map((p) => p.brand)));
export const ALL_SIZES = [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46];
export const ALL_COLORS = [
  { name: "Noir", hex: "#0B1220" },
  { name: "Blanc", hex: "#F8FAFC" },
  { name: "Bleu RHO", hex: "#2563EB" },
  { name: "Cyan", hex: "#06B6D4" },
  { name: "Gris ardoise", hex: "#64748B" },
];
